package com.ersa.tracker.services.general.achivements;

import com.ersa.tracker.dto.Week;
import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.services.general.APIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Iterator;

@Service
public class FullWeekAchievement extends AchievementProviderBase {

    @Autowired
    APIService funcs;

    @Override
    public String getName() {
        return "Barbell Assaulter";
    }

    @Override
    public String getDescription() {
        return "You need a rest day. Rewarded for working out every day for an entire week";
    }

    @Override
    public String getType() {
        return Type.FREQUENCY.toString();
    }

    @Override
    public boolean evaluate(User user) {
        Iterator<Week> weeks = funcs.getWorkoutsPerWeek(user).iterator();
        while (weeks.hasNext()) {
            Week w = weeks.next();
            if (w.getTotalWorkouts() >= 7)
                return true;
        }
        return false;
    }
}
