package com.ersa.tracker.repositories;

import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.models.Workout;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.CrudRepository;

public interface WorkoutRepository extends CrudRepository<Workout, Long> {
    Iterable<Workout> findAllByUser(User user, Sort sort);
    Page<Workout> findAllByUser(User user, Pageable page);
}
