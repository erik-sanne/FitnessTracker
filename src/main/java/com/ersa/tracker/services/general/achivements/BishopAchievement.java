package com.ersa.tracker.services.general.achivements;

import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.services.general.WorkoutService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class BishopAchievement extends AchievementProviderBase {

    WorkoutService workoutService;

    @Override
    public String getName() {
        return "Bishop";
    }

    @Override
    public String getDescription() {
        return "You have the arms of a bishop. Awarded for performing 100 sets of preacher curls.";
    }

    @Override
    public boolean evaluate(User user) {
        return workoutService.getPartitionedWorkoutSets(user, "PREACHER_CURLS").size() > 100;
    }
}
