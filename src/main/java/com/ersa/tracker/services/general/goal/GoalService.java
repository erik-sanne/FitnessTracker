package com.ersa.tracker.services.general.goal;

import com.ersa.tracker.controllers.GoalController;
import com.ersa.tracker.models.user.UserProfile;

import java.util.List;

public interface GoalService {
    void createGoal(GoalController.CreateGoal goal, UserProfile userProfile);
    List<GoalController.GoalProgress> getProgress(UserProfile profile);
}
