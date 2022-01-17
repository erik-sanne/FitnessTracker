package com.ersa.tracker.services.general.achivements;

import com.ersa.tracker.dto.Week;
import com.ersa.tracker.models.Workout;
import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.repositories.WorkoutRepository;
import com.ersa.tracker.services.general.APIFunctions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Iterator;
import java.util.List;

@Service
public class Day3Week5Achievement extends AchievementProviderBase {

    @Autowired
    APIFunctions funcs;

    @Override
    public String getName() {
        return "True Viking";
    }

    @Override
    public String getDescription() {
        return "Has been working out for 3 days a week for at least 5 weeks in a row";
    }

    @Override
    public boolean evaluate(User user) {
        Iterator<Week> weeks = funcs.getWorkoutsPerWeek(user).iterator();

        int i = 0;
        while (weeks.hasNext()) {
            Week week = weeks.next();
            if (week.getTotalWorkouts() < 3) {
                i = 0;
            }

            if (i == 3) {
                return true;
            }

            i++;
        }
        return false;
    }
}
