package com.ersa.tracker.repositories;

import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.models.Workout;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface WorkoutRepository extends CrudRepository<Workout, Long> {
    List<Workout> findAllByUser(User user);
    List<Workout> findAllByUser(User user, Sort sort);
    Page<Workout> findAllByUser(User user, Pageable page);
}
