package com.ersa.tracker.services.general.achivements;

import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.services.general.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class AllCompundsAchievement extends AchievementProviderBase {

    @Autowired
    WorkoutService workoutService;

    @Override
    public String getName() {
        return "Jack Of All Trades";
    }

    @Override
    public String getDescription() {
        return "Has performed a squat, deadlift and a bench press";
    }

    @Override
    public boolean evaluate(User user) {
        boolean bench = !workoutService.getAllSetsForExercise(user, "BENCH_PRESS").isEmpty();
        boolean deadlift = !workoutService.getAllSetsForExercise(user, "DEADLIFT").isEmpty();
        boolean squat = !workoutService.getAllSetsForExercise(user, "SQUAT").isEmpty();

        return bench && deadlift && squat;
    }
}
