package com.ersa.tracker.services.general.achivements;

import com.ersa.tracker.dto.Achievement;
import com.ersa.tracker.models.authentication.User;

public interface AchievementProvider {
    String getName();
    String getDescription();
    Achievement getAchievement(User user);
}
