package com.ersa.tracker.services.general;
import com.ersa.tracker.models.Exercise;
import com.ersa.tracker.repositories.ExerciseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ExerciseRetrievalService implements ExerciseService {

    private final ExerciseRepository exerciseRepository;

    @Autowired
    public ExerciseRetrievalService(final ExerciseRepository exerciseRepository) {
        this.exerciseRepository = exerciseRepository;
    }

    @Override
    public List<String> getAllExerciseNames() {
        List<String> exercises = new ArrayList<>();
        exerciseRepository.findAll().forEach(e -> exercises.add(e.getName()));
        return exercises;
    }

    @Override
    public Exercise getExerciseByName(final String name) {
        return exerciseRepository.findByName(name);
    }
}
