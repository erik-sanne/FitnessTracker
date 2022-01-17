package com.ersa.tracker.repositories;

import com.ersa.tracker.models.Achievement;
import com.ersa.tracker.models.authentication.User;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface AchievementRepository extends CrudRepository<Achievement, Long> {
    Achievement findByUserAndName(User user, String name);
    List<Achievement> findByUser(User user);
}
