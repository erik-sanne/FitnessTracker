package com.ersa.tracker.services.general.achivements;

import com.ersa.tracker.models.Workout;
import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.repositories.WorkoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class Workouts250Achievement extends AchievementProviderBase {

    @Autowired
    WorkoutRepository workoutRepository;

    @Override
    public String getName() {
        return "Messiah of Gainz";
    }

    @Override
    public String getDescription() {
        return "Has registered a total of 250 workouts";
    }

    @Override
    public boolean evaluate(User user) {
        List<Workout> workouts = workoutRepository.findAllByUser(user);
        return workouts.size() > 250;
    }
}
