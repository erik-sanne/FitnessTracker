package com.ersa.tracker.services.general.achivements;

import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.services.general.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class PowerLifterAchievement extends AchievementProviderBase {

    @Autowired
    WorkoutService workoutService;

    @Override
    public String getName() {
        return "Powerlifter";
    }

    @Override
    public String getDescription() {
        return "Has performed the deadlift, bench press and squat 50 times each";
    }

    @Override
    public boolean evaluate(User user) {
        boolean bench = workoutService.getPartitionedWorkoutSets(user, "BENCH_PRESS").size() > 50;
        boolean deadlift = workoutService.getPartitionedWorkoutSets(user, "DEADLIFT").size() > 50;
        boolean squat = workoutService.getPartitionedWorkoutSets(user, "SQUAT").size() > 50;

        return bench && deadlift && squat;
    }
}
