package com.ersa.tracker.services.user;

import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.models.user.UserProfile;
import com.ersa.tracker.repositories.UserProfileRepository;
import com.ersa.tracker.repositories.authentication.UserRepository;
import com.ersa.tracker.security.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class UserProfileService implements ProfileService {

    private UserRepository userRepository;
    private UserProfileRepository profileRepository;

    @Autowired
    public UserProfileService(final UserRepository userRepository, final UserProfileRepository profileRepository) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    @Override
    public UserProfile getProfile(long userId) {
        User user = userRepository.findById(userId).get();
        if (user == null)
            throw new ResourceNotFoundException("User not found");
        return getProfile(user);
    }

    @Override
    public UserProfile getProfile(User user) {
        return user.getUserProfile();
    }

    @Override
    public void saveProfile(String displayName, String profilePicture, User user) throws IOException {
        UserProfile profile = user.getUserProfile();
        if (profile == null) {
            profile = new UserProfile();
            profile.setUser(user);
        }

        if (displayName != null)
            profile.setDisplayName(displayName);

        if (profilePicture != null)
            profile.setProfilePicture(profilePicture.getBytes());

        user.setUserProfile(profile);
        userRepository.save(user);
    }
}
