package com.ersa.tracker.controllers;

import com.ersa.tracker.models.Exercise;
import com.ersa.tracker.repositories.ExerciseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class InfoController {
    @Autowired
    ExerciseRepository exerciseRepository;

    @GetMapping("exerciseinfo/{name}")
    public Exercise getExerciseInfo(@PathVariable String name) {
        return exerciseRepository.findByName(name);
    }

    @GetMapping("exerciseinfo/")
    public Iterable<Exercise> getExerciseInfo() {
        return exerciseRepository.findAll();
    }
}
