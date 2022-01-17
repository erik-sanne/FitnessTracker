package com.ersa.tracker.services.general.achivements;

import com.ersa.tracker.dto.WorkoutSummary;
import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.services.general.APIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoLegsAchievement extends AchievementProviderBase {

    @Autowired
    APIService apiService;

    @Override
    public String getName() {
        return "Trickster";
    }

    @Override
    public String getDescription() {
        return "The trickster defies your social constructs - gainz can be had without training legs! Awarded for registering ten consecutive workouts without any leg training.";
    }

    @Override
    public boolean evaluate(User user) {
        List<WorkoutSummary> summaries = apiService.getWorkoutSummaries(user);

        int i = 0;
        for (WorkoutSummary summary : summaries) {
            if ("LEGS".equals(summary.getDescription())){
                i = 0;
            }
            i++;

            if (i == 10) {
                return true;
            }
        }
        return false;
    }
}
