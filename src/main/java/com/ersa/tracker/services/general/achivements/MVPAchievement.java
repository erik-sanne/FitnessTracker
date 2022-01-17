package com.ersa.tracker.services.general.achivements;

import com.ersa.tracker.models.Workout;
import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.repositories.WorkoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class MVPAchievement extends AchievementProviderBase {

    //2020-12-31
    static final Date firstYear = new Date(1609369200000L);

    @Autowired
    WorkoutRepository workoutRepository;

    @Override
    public String getName() {
        return "Most Valuable Player";
    }

    @Override
    public String getDescription() {
        return "The MVP has been killing it at the gym while also helping out improving tracker. Awarded for registering a workout in 2020.";
    }

    @Override
    public boolean evaluate(User user) {
        List<Workout> workouts = workoutRepository.findAllByUser(user);
        return workouts.stream().anyMatch(w -> w.getDate().before(firstYear));
    }
}
