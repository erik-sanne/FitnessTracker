package com.ersa.tracker.repositories;

import com.ersa.tracker.models.user.UserProfile;
import org.springframework.data.repository.CrudRepository;

public interface UserProfileRepository extends CrudRepository<UserProfile, Long> {
}
