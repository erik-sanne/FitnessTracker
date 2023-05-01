package com.ersa.tracker.services.user;

import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.models.user.UserProfile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

public interface ProfileService {
    UserProfile getProfile(long userId);
    UserProfile getProfile(User user);
    boolean saveCover(User user, MultipartFile inputStream);
    byte[] getCover(User me, long userId);
    User getFriend(User me, long userId);
    void saveProfile(String displayName, String profilePicture, User user) throws IOException;
}
