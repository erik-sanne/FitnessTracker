package com.ersa.tracker.services.user;

import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.models.user.UserProfile;
import com.ersa.tracker.repositories.UserProfileRepository;
import com.ersa.tracker.repositories.authentication.UserRepository;
import com.ersa.tracker.security.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


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
    public UserProfile getProfile(final long userId) {
        User user = userRepository.findById(userId).get();
        if (user == null)
            throw new ResourceNotFoundException("User not found");
        return getProfile(user);
    }

    @Override
    public UserProfile getProfile(final User user) {
        UserProfile userProfile = user.getUserProfile();
        if (userProfile == null)
            return null;

        return userProfile;
    }

    @Override
    public User getFriend(final User me, final long userId) {
        for (UserProfile friendProfile : me.getUserProfile().getFriends()) {
            if (friendProfile.getUser().getId() == userId) {
                return friendProfile.getUser();
            }
        }
        throw new IllegalArgumentException("User id is not a friend");
    }

    @Override
    public void saveProfile(final String displayName, final String profilePicture, final User user) {
        UserProfile profile = user.getUserProfile();
        if (profile == null) {
            profile = new UserProfile();
            profile.setUser(user);
        }

        if (displayName != null)
            profile.setDisplayName(displayName);

        if (profilePicture != null)
            profile.setProfilePicture(profilePicture.getBytes());
        else
            profile.setProfilePicture(null);

        user.setUserProfile(profile);
        userRepository.save(user);
    }
}
