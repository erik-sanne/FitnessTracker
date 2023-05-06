package com.ersa.tracker.services.user;

import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.models.user.UserProfile;
import com.ersa.tracker.repositories.UserProfileRepository;
import com.ersa.tracker.repositories.authentication.UserRepository;
import com.ersa.tracker.repositories.filestorage.CachedFileRepository;
import com.ersa.tracker.security.exceptions.ResourceNotFoundException;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;


@Service
@Log4j2
@AllArgsConstructor
public class UserProfileService implements ProfileService {

    private UserRepository userRepository;
    private UserProfileRepository profileRepository;
    private CachedFileRepository fileRepository;

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
    public boolean saveCover(User user, MultipartFile file) {
        String fileName = createCoverFileName(user.getId());
        if (!"image/png".equalsIgnoreCase(file.getContentType())) {
            throw new IllegalArgumentException("Unsupported content type");
        }

        try {
            return fileRepository.saveFile(fileName, file.getInputStream(), "image/png");
        } catch (IOException exception) {
            log.error("Failed reading file {} uploaded by user {}, {}",
                    file.getOriginalFilename(),
                    user.getId(),
                    exception);
            return false;
        }
    }

    @Override
    public byte[] getCover(final User me, final long userId) {
        String fileName = createCoverFileName(userId);
        return fileRepository.getFile(fileName);
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

    private String createCoverFileName(long userId) {
        return userId + "_cover.png";
    }
}
