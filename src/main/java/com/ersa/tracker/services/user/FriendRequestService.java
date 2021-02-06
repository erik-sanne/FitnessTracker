package com.ersa.tracker.services.user;

import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.models.user.FriendRequest;

import java.util.Collection;

public interface FriendRequestService {

    Collection<FriendRequest> getFriendRequests(User user);
    void sendFriendRequest(String toUserEmail, User currentUser);
    void acceptFriendRequest(long id, User currentUser);
    void deleteFriendRequest(long id, User currentUser);

}
