package com.ersa.tracker.repositories;

import com.ersa.tracker.models.user.Goal;
import com.ersa.tracker.models.user.UserProfile;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoalRepository extends CrudRepository<Goal, Long> {
    List<Goal> findByUserProfile(UserProfile user);
}
