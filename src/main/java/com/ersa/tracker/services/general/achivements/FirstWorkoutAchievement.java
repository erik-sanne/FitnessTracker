package com.ersa.tracker.services.general.achivements;

import com.ersa.tracker.models.Workout;
import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.repositories.WorkoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FirstWorkoutAchievement extends AchievementProviderBase {

    @Autowired
    WorkoutRepository workoutRepository;

    @Override
    public String getName() {
        return "Fresh Recruit";
    }

    @Override
    public String getDescription() {
        return "Has registered a workout in tracker";
    }

    @Override
    public String getType() {
        return Type.MISC.toString();
    }

    @Override
    public boolean evaluate(User user) {
        List<Workout> workouts = workoutRepository.findAllByUser(user);
        return !workouts.isEmpty();
    }
}
