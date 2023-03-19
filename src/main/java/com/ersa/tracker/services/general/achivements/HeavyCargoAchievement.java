package com.ersa.tracker.services.general.achivements;

import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.services.general.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class HeavyCargoAchievement extends AchievementProviderBase {

    @Autowired
    WorkoutService workoutService;

    @Override
    public String getName() {
        return "Heavy Cargo";
    }

    @Override
    public String getDescription() {
        return "Time to install the reverse alarm. Awarded for hitting glutes 1000 times!";
    }

    @Override
    public String getType() {
        return Type.SETS_AND_EXERCISES.toString();
    }

    @Override
    public boolean evaluate(User user) {
        boolean glutes =
                workoutService.getAllSetsForExercise(user, "HIP_THRUST").size() +
                workoutService.getAllSetsForExercise(user, "GLUTE_KICKBACKS").size() +
                workoutService.getAllSetsForExercise(user, "HIP_ABDUCTION").size() +
                workoutService.getAllSetsForExercise(user, "HIP_ADDUCTION").size() +
                workoutService.getAllSetsForExercise(user, "SQUAT").size() > 1000;

        return glutes;
    }
}
