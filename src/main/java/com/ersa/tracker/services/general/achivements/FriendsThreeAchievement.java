package com.ersa.tracker.services.general.achivements;

import com.ersa.tracker.models.authentication.User;
import org.springframework.stereotype.Service;

@Service
public class FriendsThreeAchievement extends AchievementProviderBase {

    @Override
    public String getName() {
        return "Part of the pack";
    }

    @Override
    public String getDescription() {
        return "Wolves live in packs, and so do gym bros. Awarded for having three or more friends in tracker.";
    }

    @Override
    public String getType() {
        return Type.MISC.toString();
    }

    @Override
    public boolean evaluate(User user) {
        return user.getUserProfile().getFriends() != null && user.getUserProfile().getFriends().size() > 2;
    }
}
