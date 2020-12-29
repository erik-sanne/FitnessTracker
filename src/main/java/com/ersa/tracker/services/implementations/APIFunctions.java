package com.ersa.tracker.services.implementations;

import com.ersa.tracker.dto.SetAverage;
import com.ersa.tracker.dto.Week;
import com.ersa.tracker.dto.WorkoutSummary;
import com.ersa.tracker.models.Exercise;
import com.ersa.tracker.models.Target;
import com.ersa.tracker.models.WType;
import com.ersa.tracker.models.Workout;
import com.ersa.tracker.models.WorkoutSet;
import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.repositories.TargetRepository;
import com.ersa.tracker.repositories.WTypeRepository;
import com.ersa.tracker.services.APIService;
import com.ersa.tracker.services.ExerciseService;
import com.ersa.tracker.services.WorkoutService;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class APIFunctions implements APIService {

    private final WorkoutService workoutService;
    private final ExerciseService exerciseService;
    private final TargetRepository targetRepository;
    private final WTypeRepository wTypeRepository;

    @Autowired
    public APIFunctions(final WorkoutService workoutService,
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
    public Iterable<Week> getWorkoutsPerWeek(final User user) {
        final int weeksInYear = 52;
        List<Week> result = new ArrayList<>();
        Iterable<Workout> workouts = workoutService.getWorkouts(user);

        Calendar cal = Calendar.getInstance();
        // ISO 8601
        cal.setMinimalDaysInFirstWeek(4);
        int currentWeek = cal.get(Calendar.WEEK_OF_YEAR);
        int currentYear = cal.get(Calendar.YEAR);
        result.add(new Week(currentYear, currentWeek, 0));

        for (Workout workout : workouts) {
            cal.setTime(workout.getDate());

            int nextEntryWeek = cal.get(Calendar.WEEK_OF_YEAR);
            int nextEntryYear = cal.get(Calendar.YEAR);

            Week lastRecord = result.get(result.size() - 1);

            int differenceInWeeks = (lastRecord.getWeekNumber() - nextEntryWeek);
            int differenceInYears = lastRecord.getYear() - nextEntryYear;

            int weeksDifference = differenceInWeeks + weeksInYear * differenceInYears;

            if (weeksDifference == 0) {
                lastRecord.setTotalWorkouts(lastRecord.getTotalWorkouts() + 1);
                continue;
            }

            int week = lastRecord.getWeekNumber() - 1;
            int year = lastRecord.getYear();

            while (year > nextEntryYear || week != nextEntryWeek) {
                if (week == 0) {
                    week = weeksInYear;
                    year--;
                }

                result.add(new Week(year, week, 0));
                week--;
            }

            result.add(new Week(nextEntryYear, nextEntryWeek, 1));
        }

        final int minimumWeeks = 7;
        for (int i = result.size(); i < minimumWeeks; i++) {
            Week prev = result.get(result.size() - 1);
            int week = prev.getWeekNumber() - 1;
            int year = prev.getYear();
            if (week == 0) {
                year--;
                week = weeksInYear;
            }
            result.add(new Week(year, week, 0));
        }

        return result;
    }

    public Map<String, Float> getWorkoutDistribution(final User user) {
        final int limit = 30;
        return getWorkoutDistribution(user, limit);
    }

    public Map<String, Float> getWorkoutDistribution(final User user, final int workoutsToConsider) {
        Map<String, Float> resultMap = new HashMap<>();

        Iterable<Workout> workouts = workoutService.getWorkouts(user, workoutsToConsider);
        Iterator<Workout> iterator = workouts.iterator();

        Iterable<Target> targets = targetRepository.findAll();

        for (Target target : targets) {
            resultMap.put(target.getName(), 0f);
        }

        final float primaryWeight = 1f;
        final float secondaryWeight = 0.5f;
        while (iterator.hasNext()) {
            Workout workout = iterator.next();

            for (WorkoutSet set : workout.getSets()) {
                Exercise exercise = exerciseService.getExerciseByName(set.getExercise());
                exercise.getPrimaryTargets().forEach(target -> {
                    float prevValue = resultMap.get(target.getName());
                    resultMap.put(target.getName(), prevValue + primaryWeight);
                });

                exercise.getSecondaryTargets().forEach(target -> {
                    float prevValue = resultMap.get(target.getName());
                    resultMap.put(target.getName(), prevValue + secondaryWeight);
                });
            }
        }

        float maxVal = resultMap.entrySet().stream().max((a, b) -> Float.compare(a.getValue(), b.getValue())).get().getValue();
        for (Map.Entry<String, Float> entry: resultMap.entrySet()){
            entry.setValue(entry.getValue() / maxVal);
        }

        return resultMap;
    }

    @Override
    public List<WorkoutSummary> getWorkoutSummaries(final User user) {
        List<WorkoutSummary> summaries = new ArrayList<>();

        Iterable<WType> types = wTypeRepository.findAll();
        List<Workout> workouts = workoutService.getWorkouts(user);
        workouts.forEach(workout -> {
            Map<WType, Float> setsPerType = new HashMap<>();
            types.forEach(type -> setsPerType.put(type, 0f));

            workout.getSets().stream().forEach(set -> {
                Exercise exercise = exerciseService.getExerciseByName(set.getExercise());
                exercise.getPrimaryTargets().forEach(target -> {
                    target.getWtypes().forEach(type -> {
                        Float prevVal = setsPerType.get(type);
                        setsPerType.put(type, prevVal + 1);
                    });
                });
                exercise.getSecondaryTargets().forEach(target -> {
                    target.getWtypes().forEach(type -> {
                        Float prevVal = setsPerType.get(type);
                        setsPerType.put(type, prevVal + 1);
                    });
                });
            });

            Map.Entry<WType, Float> bestEntry = null;
            for (Map.Entry<WType, Float> entry : new ArrayList<>(setsPerType.entrySet())) {
                if (bestEntry == null)
                    bestEntry = entry;
                else {
                    if (entry.getValue() > bestEntry.getValue()) {
                        bestEntry = entry;
                    }
                }
            }

            WorkoutSummary summary = new WorkoutSummary();
            summary.setWorkoutId(workout.getId());
            summary.setDate(workout.getDate());
            summary.setDescription(bestEntry.getValue() > 0 ? bestEntry.getKey().getName() : "CUSTOM");
            summaries.add(summary);
        });
        return summaries;
    }

    @Override
    public List<SetAverage> getSetAverages(final User user, final String exercise) {
        List<Workout> workouts = workoutService.getWorkouts(user);
        List<SetAverage> result = workouts.stream().map(w -> computeSetAvg(w, exercise)).filter(Objects::nonNull).collect(Collectors.toList());
        if (result.isEmpty())
            return result;

        float maxW = (float)result.stream().mapToDouble(SetAverage::getWeight).max().getAsDouble();
        float maxR = (float)result.stream().mapToDouble(SetAverage::getReps).max().getAsDouble();

        result.forEach(e -> e.setWeight(e.getWeight() / maxW));
        result.forEach(e -> e.setReps(e.getReps() / maxR));

        return result;
    }

    private SetAverage computeSetAvg(Workout workout, String exercise) {

        List<WorkoutSet> sets = workout.getSets().stream().filter(set -> set.getExercise().equals(exercise)).collect(Collectors.toList());

        if (sets.size() == 0)
            return null;

        float weightAvg = (float)sets.stream().mapToDouble(WorkoutSet::getWeight).reduce(0, Double::sum) / sets.size();
        float repsAvg = (float)sets.stream().mapToInt(WorkoutSet::getReps).reduce(0, Integer::sum) / sets.size();

        return new SetAverage(workout.getDate(), repsAvg, weightAvg);
    }
}
