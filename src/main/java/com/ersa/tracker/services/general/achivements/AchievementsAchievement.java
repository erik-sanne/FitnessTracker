package com.ersa.tracker.services.general.achivements;

import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.repositories.AchievementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class AchievementsAchievement extends AchievementProviderBase {

    @Autowired
    AchievementRepository achievementRepository;

    @Override
    public String getName() {
        return "Treasure Hunter";
    }

    @Override
    public String getDescription() {
        return "Awarded for being awarded ten or more achievements";
    }

    @Override
    public boolean evaluate(User user) {
        return achievementRepository.findByUser(user).size() >= 10;
    }
}
