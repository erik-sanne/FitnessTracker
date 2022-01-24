package com.ersa.tracker.repositories;

import com.ersa.tracker.models.WorkoutSet;
import com.ersa.tracker.models.authentication.User;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface WorkoutSetRepository extends CrudRepository<WorkoutSet, Long> {
    int countByWorkoutUser(User user);
    int countByWorkoutUserAndExercise(User user, String exercise);
    List<WorkoutSet> findByWorkoutUserAndExercise(User user, String exercise);
}
