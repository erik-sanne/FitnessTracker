package com.ersa.tracker.services.general;

import com.ersa.tracker.dto.PredictedORM;
import com.ersa.tracker.dto.SetAverage;
import com.ersa.tracker.dto.Week;
import com.ersa.tracker.dto.WorkoutSummary;
import com.ersa.tracker.models.*;
import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.repositories.TargetRepository;
import com.ersa.tracker.repositories.WTypeRepository;
import com.ersa.tracker.utils.DateUtils;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Log4j2
public class WorkoutStatsService implements APIService {
    private static final int MAX_YEARS_DISPLAY = 5;

    private final WorkoutService workoutService;
    private final ExerciseService exerciseService;
    private final TargetRepository targetRepository;
    private final WTypeRepository wTypeRepository;

    private final int DEFAULT_WORKOUTS_TO_CONSIDER = 30;

    final float SCALE_FACTOR_PRIMARY = 1f;
    final float SCALE_FACTOR_SECONDARY = 0.5f;

    @Autowired
    public WorkoutStatsService(final WorkoutService workoutService,
                               final ExerciseService exerciseService,
                               final TargetRepository targetRepository,
                               final WTypeRepository wTypeRepository) {
        this.workoutService = workoutService;
        this.exerciseService = exerciseService;
        this.targetRepository = targetRepository;
        this.wTypeRepository = wTypeRepository;
    }


    /**
     * @return Iterable of Weeks since first workout until today, containing
     * the number of workouts performed each week.
     * Always returns at least 7 weeks even if there is not sufficient data.
     */
    @SuppressWarnings("checkstyle:MagicNumber")
    public List<Week> getWorkoutsPerWeek(final User user) {
        List<Week> result = new ArrayList<>();
        Iterable<Workout> workouts = workoutService.getWorkouts(user);

        Calendar cal = Calendar.getInstance();
        // ISO 8601
        cal.setMinimalDaysInFirstWeek(4);

        String yyyyww = DateUtils.FORMAT_YYYYww.format(cal.getTime());
        int currentWeek = Integer.parseInt(yyyyww.substring(4));
        int currentYear = Integer.parseInt(yyyyww.substring(0,4));

        result.add(new Week(currentYear, currentWeek, 0));

        for (Workout workout : workouts) {

            Date nextEntryDate = workout.getDate();

            if (Calendar.getInstance().getTimeInMillis() - nextEntryDate.getTime() > MAX_YEARS_DISPLAY * 31556952000L)
                break;

            yyyyww = DateUtils.FORMAT_YYYYww.format(nextEntryDate);
            int nextEntryWeek = Integer.parseInt(yyyyww.substring(4));
            int nextEntryYear = Integer.parseInt(yyyyww.substring(0,4));

            Week prevEntry = result.get(result.size()-1);
            if (prevEntry.getWeekNumber() == nextEntryWeek && prevEntry.getYear() == nextEntryYear) {
                prevEntry.setTotalWorkouts(prevEntry.getTotalWorkouts()+1);
                continue;
            }

            int emptyEntryWeek = -1;
            int emptyEntryYear = -1;
            while (true) {
                cal.add(Calendar.WEEK_OF_YEAR, -1);
                yyyyww = DateUtils.FORMAT_YYYYww.format(cal.getTime());
                emptyEntryWeek = Integer.parseInt(yyyyww.substring(4));
                emptyEntryYear = Integer.parseInt(yyyyww.substring(0,4));
                if (emptyEntryWeek == nextEntryWeek && emptyEntryYear == nextEntryYear)
                    break;
                else
                    result.add(new Week(emptyEntryYear, emptyEntryWeek, 0));
            }
            cal.setTime(nextEntryDate);
            result.add(new Week(nextEntryYear, nextEntryWeek, 1));
        }

        final int minimumWeeks = 7;
        for (int i = result.size(); i < minimumWeeks; i++) {
            cal.add(Calendar.WEEK_OF_YEAR, -1);
            yyyyww = DateUtils.FORMAT_YYYYww.format(cal.getTime());
            int emptyEntryWeek = Integer.parseInt(yyyyww.substring(4));
            int emptyEntryYear = Integer.parseInt(yyyyww.substring(0,4));
            result.add(new Week(emptyEntryYear, emptyEntryWeek, 0));
        }

        return result;
    }

    @Override
    public Map<String, List<Number>> getBodyPartDistributionOverTime(User user) {
        final String DATES = "dates";
        List<Workout> workouts = workoutService.getWorkouts(user);
        Collections.reverse(workouts);

        Map<String, List<Number>> res = new HashMap<>();
        targetRepository.findAll().forEach(target -> res.put(target.getName(), new ArrayList<>(workouts.size())));
        res.put(DATES, new ArrayList<>(workouts.size()));

        workouts.forEach(workout -> {
            res.forEach((key, arr) -> {
                if (DATES.equals(key))
                    arr.add(0L);
                else
                    arr.add(0f);
            });
        });

        for (int i = 0; i < workouts.size(); i++) {
            final int index = i;
            Workout workout = workouts.get(i);
            List<Exercise> exercises = workout.getSets().stream()
                    .map(WorkoutSet::getExercise)
                    .map(exerciseService::getExerciseByName)
                    .toList();

            Long milli = workout.getDate().toInstant().toEpochMilli();
            res.get(DATES).set(index, milli);

            exercises.stream()
                    .map(Exercise::getPrimaryTargets)
                    .flatMap(Collection::stream)
                    .map(Target::getName)
                    .forEach(bodyPart -> addExercise(res, index, bodyPart, SCALE_FACTOR_PRIMARY));

            exercises.stream()
                    .map(Exercise::getSecondaryTargets)
                    .flatMap(Collection::stream)
                    .map(Target::getName)
                    .forEach(bodyPart -> addExercise(res, index, bodyPart, SCALE_FACTOR_SECONDARY));
        }

        return res;
    }

    private void addExercise(Map<String, List<Number>> map, int index, String bodyPart, Float scaleFactor) {
        List<Number> list = map.get(bodyPart);
        Float currentVal = (Float)list.get(index);
        list.set(index, currentVal + scaleFactor);
    }

    @Override
    public PredictedORM getPredictedORM(User user, String exercise) {
        List<Workout> workouts = workoutService.getWorkouts(user, DEFAULT_WORKOUTS_TO_CONSIDER);
        List<WorkoutSet> sets = workouts.stream().map(Workout::getSets).flatMap(Collection::stream).filter(set -> set.getExercise().equals(exercise)).collect(Collectors.toList());

        return new PredictedORM(
                exercise,
                sets.stream().map(this::epley).reduce(0f, Math::max));
    }

    private float epley(WorkoutSet set) {
        int reps = set.getReps();
        float weight = Math.max(set.getWeight(), 1f);

        if (reps == 1)
            return weight;

        return weight * (1f + reps / 30f);
    }

    @Override
    public Map<String, Float> getWorkoutDistribution(final User user) {
        return getWorkoutDistribution(user, DEFAULT_WORKOUTS_TO_CONSIDER);
    }

    @Override
    public Map<String, Float> getWorkoutDistribution(final User user, final int workoutsToConsider) {
        Iterable<Workout> workouts = workoutService.getWorkouts(user, workoutsToConsider);
        return getWorkoutDistribution(workouts);
    }

    @Override
    public Map<String, Float> getWorkoutDistribution(final User user, final Date start, final Date end) {
        List<Workout> workouts = workoutService.getWorkouts(user);
        workouts = workouts.stream().filter(workout ->
            workout.getDate().compareTo(start) >= 0 && workout.getDate().compareTo(end) <= 0
        ).collect(Collectors.toList());
        return getWorkoutDistribution(workouts);
    }

    public Map<String, Float> getWorkoutDistribution(final Iterable<Workout> workouts) {
        Map<String, Float> resultMap = new HashMap<>();

        Iterator<Workout> iterator = workouts.iterator();

        Iterable<Target> targets = targetRepository.findAll();

        for (Target target : targets) {
            resultMap.put(target.getName(), 0f);
        }

        while (iterator.hasNext()) {
            Workout workout = iterator.next();

            for (WorkoutSet set : workout.getSets()) {
                Exercise exercise = exerciseService.getExerciseByName(set.getExercise());
                exercise.getPrimaryTargets().forEach(target -> {
                    float prevValue = resultMap.get(target.getName());
                    resultMap.put(target.getName(), prevValue + SCALE_FACTOR_PRIMARY);
                });

                exercise.getSecondaryTargets().forEach(target -> {
                    float prevValue = resultMap.get(target.getName());
                    resultMap.put(target.getName(), prevValue + SCALE_FACTOR_SECONDARY);
                });
            }
        }

        return resultMap;
    }

    @Override
    public List<WorkoutSummary> getWorkoutSummaries(final User user) {
        return getWorkoutSummaries(user, 0, Integer.MAX_VALUE);
    }

    @Override
    public List<WorkoutSummary> getWorkoutSummaries(final User user, int from, int to) {
        return this.getWorkoutSummaries(user, false, from, to);
    }

    @Override
    public List<WorkoutSummary> getWorkoutSummaries(User user, boolean groupPPL, int from, int to) {
        List<WorkoutSummary> summaries = new ArrayList<>();

        List<Workout> workouts = workoutService.getWorkouts(user);
        to = Math.min(to, workouts.size());
        if (to <= from)
            return summaries;
        workouts = workouts.subList(from, to);

        Map<String, Exercise> exerciseMap = exerciseService.getAllExerciseNames().stream().map(exerciseService::getExerciseByName).collect(Collectors.toMap(Exercise::getName, e -> e));

        return workouts.stream().map( workout ->
                new WorkoutSummary(workout.getId(),
                        workout.getDate(),
                        classifySplitType(workout, exerciseMap, groupPPL))).toList();
    }

    private String classifySplitType(Workout workout, Map<String, Exercise> exerciseMap, boolean groupPPL) {
        Map<String, Float> splitTypeWeights = new HashMap<>();
        Stream<WType> primary = workout.getSets().stream().map(set -> exerciseMap.get(set.getExercise())).flatMap(exercise -> exercise.getPrimaryTargets().stream()).flatMap(target -> target.getWtypes().stream());
        Stream<WType> secondary = workout.getSets().stream().map(set -> exerciseMap.get(set.getExercise())).flatMap(exercise -> exercise.getSecondaryTargets().stream()).flatMap(target -> target.getWtypes().stream());
        primary.forEach(target -> splitTypeWeights.compute(target.getName(), (k, accumulated) -> accumulated == null ? SCALE_FACTOR_PRIMARY : accumulated + SCALE_FACTOR_PRIMARY));
        secondary.forEach(target -> splitTypeWeights.compute(target.getName(), (k, accumulated) -> accumulated == null ? SCALE_FACTOR_SECONDARY : accumulated + SCALE_FACTOR_SECONDARY));

        if (splitTypeWeights.isEmpty()) {
            return "CUSTOM";
        }

        var prioTypes = groupPPL ? List.of("PUSH", "PULL", "LEGS") : List.of("BACK", "CHEST", "SHOULDERS", "ARMS");
        Map.Entry<String, Float> bestEntry = splitTypeWeights.entrySet().stream().findAny().get();
        for (Map.Entry<String, Float> entry : splitTypeWeights.entrySet()) {
            if (bestEntry.getValue().equals(entry.getValue()) && prioTypes.contains(entry.getKey())) {
                bestEntry = entry;
            }

            if (entry.getValue() > bestEntry.getValue()) {
                bestEntry = entry;
            }
        }

        if (!groupPPL) {
            var generalTypes = List.of("PUSH", "PULL", "LEGS", "BACK");
            if (generalTypes.contains(bestEntry.getKey())) {
                var push = splitTypeWeights.getOrDefault("PUSH", 0f);
                var pull = splitTypeWeights.getOrDefault("PULL", 0f);
                var legs = splitTypeWeights.getOrDefault("LEGS", 0f);
                var comb = push + pull + legs;
                if (push / comb > 0.15f && pull / comb > 0.15f && legs / comb > 0.15f) {
                    return "FULL BODY";
                }

                comb = push + pull;
                if (push / comb > 0.4f && pull / comb > 0.4f) {
                    return "UPPER BODY";
                }
            }
        }

        return bestEntry.getKey();
    }


    @Override
    public List<SetAverage> getSetAverages(final User user, final String exercise) {
        List<Workout> workouts = workoutService.getWorkouts(user);

        return workouts.stream().map(w -> computeSetAvg(w, exercise))
                .filter(Objects::nonNull).collect(Collectors.toList());
    }

    private SetAverage computeSetAvg(final Workout workout, final String exercise) {

        List<WorkoutSet> sets = workout.getSets().stream().filter(set ->
                set.getExercise().equals(exercise)).collect(Collectors.toList());

        if (sets.isEmpty())
            return null;

        float weightAvg = (float) sets.stream().mapToDouble(WorkoutSet::getWeight).reduce(0, Double::sum) / sets.size();
        float repsAvg = (float) sets.stream().mapToInt(WorkoutSet::getReps).reduce(0, Integer::sum) / sets.size();

        float effortA = sets.stream().map(this::epley).reduce(0f, Float::sum) / sets.size();

        var top3Sets = sets.stream().map(this::epley).sorted().limit(3).toList();
        float effortB = top3Sets.stream().reduce(0f, Float::sum) / Math.max(1, top3Sets.size());

        float setSacleFactor = (float) Math.sqrt(3 * Math.sqrt(3 * sets.size()));

        float effort = setSacleFactor * ((effortA + effortB) / 2);

        List<SetAverage.Set> mappedSets = sets.stream().map(set -> new SetAverage.Set(set.getId(), set.getReps(), set.getWeight())).collect(Collectors.toList());

        return new SetAverage(workout.getDate(), repsAvg, weightAvg, effort, mappedSets);
    }
}
