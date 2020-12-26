package com.ersa.tracker.repositories;

import com.ersa.tracker.models.user.FriendRequest;
import com.ersa.tracker.models.user.UserProfile;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
public interface FriendsRepository extends CrudRepository<FriendRequest, Long> {
    Collection<FriendRequest> findAllByToUserId(Long id);
    Collection<FriendRequest> getByFromUserIdAndToUserId(Long from, Long to);
}
