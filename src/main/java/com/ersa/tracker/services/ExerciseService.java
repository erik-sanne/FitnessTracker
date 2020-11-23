package com.ersa.tracker.services;

import com.ersa.tracker.models.Exercise;

import java.util.List;

public interface ExerciseService {
    List<String> getAllExerciseNames();
    Exercise getExerciseByName(String name);
}
