package com.ersa.tracker.repositories;

import com.ersa.tracker.models.User;
import com.ersa.tracker.models.Workout;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.CrudRepository;

public interface WorkoutRepository extends CrudRepository<Workout, Long> {
    Iterable<Workout> findAllByUser(User user, Sort sort);
}
