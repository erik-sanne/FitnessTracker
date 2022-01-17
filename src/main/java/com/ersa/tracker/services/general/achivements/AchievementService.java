package com.ersa.tracker.services.general.achivements;

import com.ersa.tracker.dto.Achievement;
import com.ersa.tracker.models.authentication.User;

import java.util.List;

public interface AchievementService {
    List<Achievement> getAchivements(User user);
    void setActive(User user, String achievement);
}
