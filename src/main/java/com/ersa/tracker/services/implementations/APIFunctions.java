package com.ersa.tracker.services.implementations;

import com.ersa.tracker.dto.Week;
import com.ersa.tracker.models.*;
import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.repositories.TargetRepository;
import com.ersa.tracker.services.APIService;
import com.ersa.tracker.services.ExerciseService;
import com.ersa.tracker.services.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class APIFunctions implements APIService {

    private WorkoutService workoutService;
    private ExerciseService exerciseService;
    private TargetRepository targetRepository;

    @Autowired
    public APIFunctions(WorkoutService workoutService, ExerciseService exerciseService, TargetRepository targetRepository){
        this.workoutService = workoutService;
        this.exerciseService = exerciseService;
        this.targetRepository = targetRepository;
    }


    /**
     * @return Iterable of Weeks since first workout until today, containing the number of workouts performed each week
     * Always returns at least 7 weeks even if there is not sufficient data.
     */
    public Iterable<Week> getWorkoutsPerWeek(User user) {
        final int WEEKS_IN_YEAR = 52;
        List<Week> result = new ArrayList<>();
        Iterable<Workout> workouts = workoutService.getWorkouts(user);

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

        for (int i = result.size(); i < 7; i++) {
            Week prev = result.get(result.size()-1);
            int week = prev.getWeekNumber() - 1;
            int year = prev.getYear();
            if (week == 0) {
                year--;
                week = 52;
            }
            result.add(new Week(year, week, 0));
        }

        return result;
    }

    /**
     * @param user
     * @return returns distribution for last 30 workouts (not 30 days)
     */
    public Map<String, Float> getSetPerBodypart(User user) {
        Map<String, Float> resultMap = new HashMap<>();

        Iterable<Workout> workouts = workoutService.getWorkouts(user, 30);
        Iterator<Workout> iterator = workouts.iterator();

        Iterable<Target> targets = targetRepository.findAll();
        Iterator<Target> targetIterator = targets.iterator();

        while (targetIterator.hasNext()) {
            Target target = targetIterator.next();
            resultMap.put(target.getName(), 0f);
        }

        while (iterator.hasNext()) {
            Workout workout = iterator.next();

            Iterator<WorkoutSet> setIterator = workout.getSets().iterator();

            while (setIterator.hasNext()) {
                WorkoutSet set = setIterator.next();

                Exercise exercise = exerciseService.getExerciseByName(set.getExercise());
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

        return resultMap;
    }
}