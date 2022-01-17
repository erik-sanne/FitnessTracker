package com.ersa.tracker.services.general.achivements;

import com.ersa.tracker.dto.Achievement;
import com.ersa.tracker.models.authentication.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserAchievementService implements AchievementService {

    @Autowired
    List<AchievementProvider> providers;

    @Override
    public List<Achievement> getAchivements(User user) {
        return providers.stream().map(provider -> provider.getAchievement(user)).collect(Collectors.toList());
    }
}
