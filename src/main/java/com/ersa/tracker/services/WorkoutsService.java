package com.ersa.tracker.services;

import com.ersa.tracker.dto.Week;
import com.ersa.tracker.models.*;
import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.repositories.ExerciseRepository;
import com.ersa.tracker.repositories.TargetRepository;
import com.ersa.tracker.repositories.WorkoutRepository;
import com.ersa.tracker.utils.KVPair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class WorkoutsService {

    private static final Sort descDateSort = Sort.by("date").descending();

    @Autowired
    private WorkoutRepository workoutRepository;

    @Autowired
    private ExerciseRepository exerciseRepository;

    @Autowired
    private TargetRepository targetRepository;

    /**
     * @return Iterable of Weeks since first workout until today, containing the number of workouts performed each week
     */
    public Iterable<Week> getWorkoutsPerWeek(User user) {
        final int WEEKS_IN_YEAR = 52;
        List<Week> result = new ArrayList<>();
        Iterable<Workout> workouts = workoutRepository.findAllByUser(user, descDateSort);

        Calendar cal = Calendar.getInstance();
        int currentWeek = cal.get(Calendar.WEEK_OF_YEAR);
        int currentYear = cal.get(Calendar.YEAR);
        result.add(new Week(currentYear, currentWeek, 0));

        for (Workout workout : workouts) {
            cal.setTime(workout.getDate());

            int next_entry_week = cal.get(Calendar.WEEK_OF_YEAR);
            int next_entry_year = cal.get(Calendar.YEAR);

            Week lastRecord = result.get(result.size()-1);

            int differenceInWeeks = (lastRecord.getWeekNumber() - next_entry_week);
            int differenceInYears = lastRecord.getYear() - next_entry_year;

            int weeksDifference = differenceInWeeks + WEEKS_IN_YEAR * differenceInYears;

            if (weeksDifference == 0) {
                lastRecord.setTotalWorkouts(lastRecord.getTotalWorkouts()+1);
                continue;
            }

            int week = lastRecord.getWeekNumber() - 1;
            int year = lastRecord.getYear();

            while (year > next_entry_year || week != next_entry_week) {
                if (week == 0){
                    week = 52;
                    year--;
                }

                result.add(new Week(year, week, 0));
                week--;
            }

            result.add(new Week(next_entry_year, next_entry_week, 1));
        }
        return result;
    }

    /**
     * @param user
     * @return returns relative intensity per body part based on the last 30 workouts (not 30 days)
     */
    public List<KVPair<String, Float>> getSetPerBodypart(User user) {
        Map<String, Float> resultMap = new HashMap<>();

        Iterable<Workout> workouts = workoutRepository.findAllByUser(user, PageRequest.of(0, 30, descDateSort));
        Iterator<Workout> iterator = workouts.iterator();

        Iterable<Target> targets = targetRepository.findAll();
        Iterator<Target> targetIterator = targets.iterator();

        Map<String, String> types = new HashMap<>();

        while (targetIterator.hasNext()) {
            Target target = targetIterator.next();
            resultMap.put(target.getName(), 0f);
            types.put(target.getName(), target.getWtypes().stream()
                    .map(e -> e.getName())
                    .filter(e -> e.equals("PUSH") || e.equals("PULL") || e.equals("LEGS"))
                    .reduce("", (acc, e) -> acc + e));
        }

        while (iterator.hasNext()) {
            Workout workout = iterator.next();

            Iterator<WorkoutSet> setIterator = workout.getSets().iterator();

            while (setIterator.hasNext()) {
                WorkoutSet set = setIterator.next();

                Exercise exercise = exerciseRepository.findByName(set.getExercise());
                exercise.getPrimaryTargets().forEach( target -> {
                    float prevValue = resultMap.get(target.getName());
                    resultMap.put(target.getName(), prevValue + 1f);
                });

                exercise.getSecondaryTargets().forEach( target -> {
                    float prevValue = resultMap.get(target.getName());
                    resultMap.put(target.getName(), prevValue + 0.5f);
                });
            }
        }

        List<KVPair<String, Float>> result = resultMap.entrySet().stream()
                .filter(elem -> !elem.getKey().equals("SPINAL_ERECTORS"))
                .map(elem -> new KVPair<>(elem.getKey(), elem.getValue()))
                .sorted(Comparator.comparing(e -> types.get(e.getKey())))
                .collect(Collectors.toList());

        int smoothnessFactor = 10;
        smooth(result, smoothnessFactor);

        return result;
    }

    private void smooth (List<KVPair<String, Float>> source, Integer smoothness) {
        List<Float> values = new ArrayList<>();
        int size = source.size();
        for (int i = 0; i < size; i++) {

            float sum = 0f;
            for (int j = i - smoothness; j < i + smoothness; j++) {
                int index =  ((j % size + size) % size);
                float falloff = 1f / (1f + Math.abs(i - j));
                sum += source.get(index).getValue() * falloff;
            }

            sum = sum / (2f * smoothness + 1f);
            values.add(sum);
        }

        for (int i = 0; i < size; i++) {
            source.get(i).setValue(values.get(i));
        }
    }

}