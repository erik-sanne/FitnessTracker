package com.ersa.tracker.services.general.achivements;

import com.ersa.tracker.dto.Achievement;
import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.models.user.UserProfile;
import com.ersa.tracker.repositories.AchievementRepository;
import com.ersa.tracker.repositories.UserProfileRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Log4j2
@Service
public class UserAchievementService implements AchievementService {

    @Autowired
    List<AchievementProvider> providers;
    @Autowired
    AchievementRepository achievementRepository;
    @Autowired
    UserProfileRepository userProfileRepository;

    @Override
    public List<Achievement> getAchivements(User user) {
        return providers.stream().map(provider -> provider.getAchievement(user)).collect(Collectors.toList());
    }

    @Override
    public void setActive(User user, String achievement) {
        com.ersa.tracker.models.Achievement selected = achievementRepository.findByUserAndName(user, achievement);
        if (selected == null){
            log.warn("user {} does not have achievement {}", user.getId(), achievement);
            return;
        }

        UserProfile up = user.getUserProfile();
        if (up == null) {
            log.error("User {} - profile was null", user.getId());
            return;
        }
        up.setTitle(selected);
        userProfileRepository.save(up);

    }
}
