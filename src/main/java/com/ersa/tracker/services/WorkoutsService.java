package com.ersa.tracker.services;

import com.ersa.tracker.dto.Week;
import com.ersa.tracker.models.User;
import com.ersa.tracker.models.Workout;
import com.ersa.tracker.repositories.WorkoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class WorkoutsService {

    @Autowired
    private WorkoutRepository workoutRepository;

    /**
     * @return Iterable of Weeks since first workout until today, containing the number of workouts performed each week
     */
    public Iterable<Week> getWorkoutsPerWeek(User user) {
        final int WEEKS_IN_YEAR = 52;
        List<Week> result = new ArrayList<>();
        Iterable<Workout> workouts = workoutRepository.findAllByUser(user, Sort.by("date").descending());

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
}
