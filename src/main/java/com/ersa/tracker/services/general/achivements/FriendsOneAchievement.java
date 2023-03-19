package com.ersa.tracker.services.general.achivements;

import com.ersa.tracker.models.authentication.User;
import org.springframework.stereotype.Service;

@Service
public class FriendsOneAchievement extends AchievementProviderBase {

    @Override
    public String getName() {
        return "Brother in arms";
    }

    @Override
    public String getDescription() {
        return "Awarded for having/being a friend in tracker";
    }

    @Override
    public String getType() {
        return Type.MISC.toString();
    }

    @Override
    public boolean evaluate(User user) {
        return user.getUserProfile().getFriends() != null && user.getUserProfile().getFriends().size() > 0;
    }
}
