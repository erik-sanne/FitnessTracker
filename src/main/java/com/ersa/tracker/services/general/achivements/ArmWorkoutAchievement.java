package com.ersa.tracker.services.general.achivements;

import com.ersa.tracker.dto.WorkoutSummary;
import com.ersa.tracker.models.Workout;
import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.repositories.WorkoutRepository;
import com.ersa.tracker.services.general.APIService;
import com.ersa.tracker.services.general.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ArmWorkoutAchievement extends AchievementProviderBase {

    @Autowired
    APIService apiService;

    @Override
    public String getName() {
        return "Bro Splitter";
    }

    @Override
    public String getDescription() {
        return "Has registered an arm workout";
    }

    @Override
    public String getType() {
        return Type.SETS_AND_EXERCISES.toString();
    }

    @Override
    public boolean evaluate(User user) {
        List<WorkoutSummary> summaries = apiService.getWorkoutSummaries(user);
        return summaries.stream().anyMatch(s -> "ARMS".equals(s.getDescription()));
    }
}
