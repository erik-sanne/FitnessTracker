package com.ersa.tracker.services.general.achivements;

import com.ersa.tracker.dto.AchievementDto;
import com.ersa.tracker.models.authentication.User;

import java.util.List;

public interface AchievementService {
    List<AchievementDto> getAchievements(User user);
    void setActive(User user, String achievement);
}
