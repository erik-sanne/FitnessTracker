package com.ersa.tracker.services.general.achivements;

import com.ersa.tracker.dto.Week;
import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.services.general.APIFunctions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Iterator;

@Service
public class Day1Week52Achievement extends AchievementProviderBase {

    @Autowired
    APIFunctions funcs;

    @Override
    public String getName() {
        return "Resilient Mofo";
    }

    @Override
    public String getDescription() {
        return "Has been working out every single week for over a year";
    }

    @Override
    public boolean evaluate(User user) {
        Iterator<Week> weeks = funcs.getWorkoutsPerWeek(user).iterator();

        int i = 0;
        while (weeks.hasNext()) {
            Week week = weeks.next();
            if (week.getTotalWorkouts() < 1) {
                i = 0;
            }

            if (i == 52) {
                return true;
            }

            i++;
        }
        return false;
    }
}