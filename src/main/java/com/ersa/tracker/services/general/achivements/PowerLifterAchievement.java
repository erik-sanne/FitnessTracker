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
        return "Has performed 250 sets of deadlift, bench press and squat each";
    }

    @Override
    public String getType() {
        return Type.SETS_AND_EXERCISES.toString();
    }

    @Override
    public boolean evaluate(User user) {
        boolean bench = workoutService.getAllSetsForExercise(user, "BENCH_PRESS").size() > 250;
        boolean deadlift = workoutService.getAllSetsForExercise(user, "DEADLIFT").size() > 250;
        boolean squat = workoutService.getAllSetsForExercise(user, "SQUAT").size() > 250;

        return bench && deadlift && squat;
    }
}
