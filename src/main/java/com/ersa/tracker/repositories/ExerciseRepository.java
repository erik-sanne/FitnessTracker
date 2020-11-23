package com.ersa.tracker.repositories;

import com.ersa.tracker.models.Exercise;
import org.springframework.data.repository.CrudRepository;

public interface ExerciseRepository extends CrudRepository<Exercise, Long> {
    Exercise findByName(String name);
}
