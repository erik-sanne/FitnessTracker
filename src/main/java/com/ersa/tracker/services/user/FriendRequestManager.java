package com.ersa.tracker.services.user;

import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.models.user.FriendRequest;
import com.ersa.tracker.models.user.UserProfile;
import com.ersa.tracker.repositories.FriendsRepository;
import com.ersa.tracker.repositories.UserProfileRepository;
import com.ersa.tracker.repositories.authentication.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
public class FriendsService implements FriendService {

    private FriendsRepository friendsRepository;
    private UserProfileRepository profileRepository;
    private UserRepository userRepository;

    @Autowired
    public FriendsService(final FriendsRepository friendsRepository,
                          final UserRepository userRepository,
                          final UserProfileRepository profileRepository){
        this.friendsRepository = friendsRepository;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    @Override
    public Collection<FriendRequest> getFriendRequests(User user) {
        return friendsRepository.getByTo(user.getUserProfile());
    }

    @Override
    public void sendFriendRequest(long toUserId, User currentUser) {
        userRepository.findById(toUserId).ifPresent(toUser -> {
            UserProfile from = currentUser.getUserProfile();
            UserProfile to = toUser.getUserProfile();

            if (friendsRepository.getByFromAndTo(from, to).isEmpty())
                return;

            FriendRequest request = new FriendRequest();
            request.setTo(toUser.getUserProfile());
            request.setFrom(currentUser.getUserProfile());

            friendsRepository.save(request);
        });
    }

    @Override
    public void acceptFriendRequest(long id, User currentUser) {
        friendsRepository.findById(id).ifPresent(friendRequest -> {
            if (!friendRequest.getTo().equals(currentUser.getUserProfile()))
                throw new BadCredentialsException("");

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
    public void deleteFriendRequest(long id, User currentUser) {
        friendsRepository.findById(id).ifPresent(friendRequest -> {
            if (!friendRequest.getTo().equals(currentUser.getUserProfile()))
                throw new BadCredentialsException("");

            friendsRepository.delete(friendRequest);
        });
    }
}
