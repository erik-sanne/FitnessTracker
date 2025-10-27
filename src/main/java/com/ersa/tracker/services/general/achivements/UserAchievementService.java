package com.ersa.tracker.services.general.achivements;

import com.ersa.tracker.dto.Achievement;
import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.models.user.UserProfile;
import com.ersa.tracker.repositories.AchievementRepository;
import com.ersa.tracker.repositories.UserProfileRepository;
import com.ersa.tracker.repositories.authentication.UserRepository;
import com.ersa.tracker.services.general.NewWorkoutEvent;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.LoadingCache;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Log4j2
@Service
@RequiredArgsConstructor
public class UserAchievementService implements AchievementService, ApplicationListener<NewWorkoutEvent> {

    private final List<AchievementProvider> providers;
    private final AchievementRepository achievementRepository;
    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;

    private LoadingCache<Long, List<Achievement>> cache = Caffeine.newBuilder()
            .expireAfterWrite(30, TimeUnit.MINUTES)
            .build(this::load);

    @Override
    public List<Achievement> getAchievements(User user) {
        return cache.get(user.getId());
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

    private List<Achievement> load(Long userId) {
        return userRepository.findById(userId).map(user ->
                providers.stream().map(provider -> provider.getAchievement(user)).collect(Collectors.toList())
        ).orElse(Collections.emptyList());
    }

    @Override
    public void onApplicationEvent(NewWorkoutEvent event) {
        cache.invalidate(event.getUserId());
    }
}
