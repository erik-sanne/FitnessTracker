package com.ersa.tracker.services.user;

import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.models.user.FriendRequest;
import com.ersa.tracker.models.user.UserProfile;
import com.ersa.tracker.repositories.FriendsRepository;
import com.ersa.tracker.repositories.UserProfileRepository;
import com.ersa.tracker.repositories.authentication.UserRepository;
import com.ersa.tracker.security.exceptions.ResourceNotFoundException;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
@Log4j2
public class FriendRequestManager implements FriendRequestService {

    private FriendsRepository friendsRepository;
    private UserProfileRepository profileRepository;
    private UserRepository userRepository;

    @Autowired
    public FriendRequestManager(final FriendsRepository friendsRepository,
                                final UserRepository userRepository,
                                final UserProfileRepository profileRepository) {
        this.friendsRepository = friendsRepository;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    @Override
    public Collection<FriendRequest> getFriendRequests(final User user) {
        return friendsRepository.findAllByToUserId(user.getId());
    }

    @Override
    public void sendFriendRequest(final String toUserEmail, final User currentUser) throws
            ResourceNotFoundException, IllegalArgumentException {
        if (currentUser.getEmail().equals(toUserEmail))
            throw new IllegalArgumentException("Sender and receiver must be different");

        User toUser = userRepository.findByEmail(toUserEmail);

        if (toUser == null) {
            log.warn(String.format("Failed to send friend request from user %d to user with email %s. User not found.",
                    currentUser.getId(), toUserEmail));
            throw new ResourceNotFoundException("User not found");
        }

        if (toUser.getUserProfile() == null) {
            log.warn(String.format("Failed to send friend request from user %d to user %d. No profile created.",
                    currentUser.getId(), toUser.getId()));
            throw new ResourceNotFoundException("User has not created a profile");
        }

        if (!friendsRepository.getByFromUserIdAndToUserId(currentUser.getId(), toUser.getId()).isEmpty()) {
            log.info(String.format("Ignoring friend request from user %d to user %d. Request already in place.",
                    currentUser.getId(), toUser.getId()));

            return;
        }

        FriendRequest request = new FriendRequest();
        request.setTo(toUser.getUserProfile());
        request.setFrom(currentUser.getUserProfile());

        friendsRepository.save(request);
    }

    @Override
    public void acceptFriendRequest(final long id, final User currentUser) {
        friendsRepository.findById(id).ifPresent(friendRequest -> {
            if (!friendRequest.getTo().equals(currentUser.getUserProfile())) {
                log.error(String.format(
                        "Friend request from %d to %d was accepted by %d, but profile id's did not match!",
                        friendRequest.getFrom().getUser().getId(),
                        friendRequest.getTo().getUser().getId(),
                        currentUser.getId()));
                throw new BadCredentialsException("");
            }

            UserProfile from = friendRequest.getFrom();
            UserProfile to = friendRequest.getTo();

            from.getFriends().add(to);
            to.getFriends().add(from);

            profileRepository.save(from);
            profileRepository.save(to);

            friendsRepository.delete(friendRequest);
        });

    }

    @Override
    public void deleteFriendRequest(final long id, final User currentUser) {
        friendsRepository.findById(id).ifPresent(friendRequest -> {
            if (!friendRequest.getTo().equals(currentUser.getUserProfile())) {
                log.error(String.format(
                        "Friend request from %d to %d was denied by %d, but profile id's did not match!",
                        friendRequest.getFrom().getUser().getId(),
                        friendRequest.getTo().getUser().getId(),
                        currentUser.getId()));
                throw new BadCredentialsException("");
            }

            friendsRepository.delete(friendRequest);
        });
    }
}
