package com.ersa.tracker.services.general.achivements;

import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.services.general.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class CappedCaptainAchievement extends AchievementProviderBase {

    @Autowired
    WorkoutService workoutService;

    @Override
    public String getName() {
        return "Captain Capped";
    }

    @Override
    public String getDescription() {
        return "Equipped with death star deltoids, Captain Capped has targeted all three heads of the deltoids 250 times each";
    }

    @Override
    public boolean evaluate(User user) {
        boolean front =
                workoutService.getAllSetsForExercise(user, "MILITARY_PRESS").size() +
                workoutService.getAllSetsForExercise(user, "SHOULDER_PRESS").size() > 250;
        boolean side = workoutService.getAllSetsForExercise(user, "LATERAL_RAISES").size() > 250;
        boolean rear = workoutService.getAllSetsForExercise(user, "REVERSED_FLIES").size() > 250;

        return front && side && rear;
    }
}
