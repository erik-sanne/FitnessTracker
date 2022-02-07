package com.ersa.tracker.services.general.achivements;

import com.ersa.tracker.models.Achievement;
import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.repositories.AchievementRepository;
import com.ersa.tracker.services.user.PostService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Date;

public abstract class AchievementProviderBase implements AchievementProvider {
    @Autowired
    private AchievementRepository achievementRepository;
    @Autowired
    private PostService postService;

    @Override
    public abstract String getName();

    @Override
    public abstract String getDescription();

    @Override
    public com.ersa.tracker.dto.Achievement getAchievement(User user) {
        Achievement achievement = achievementRepository.findByUserAndName(user, getName());
        if (achievement != null)
            return new com.ersa.tracker.dto.Achievement(getName(), getDescription(), achievement.getDate());


        if (evaluate(user)) {
            achievement = new Achievement();
            achievement.setName(getName());
            achievement.setDate(new Date());
            achievement.setUser(user);
            achievementRepository.save(achievement);
            postService.createPost(user, "New Achievement", String.format("%s unlocked the achievement %s", PostService.DISPLAY_NAME, getName()));
        }

        return new com.ersa.tracker.dto.Achievement(getName(), getDescription(), achievement != null ? achievement.getDate() : null);
    }

    public abstract boolean evaluate(User user);
}
