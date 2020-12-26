package com.ersa.tracker.services.user;

import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.models.user.UserProfile;

import java.io.IOException;

public interface ProfileService {
    UserProfile getProfile(long userId);
    UserProfile getProfile(User user);
    User getFriend(User me, long userId);
    void saveProfile(String displayName, String profilePicture, User user) throws IOException;
}
