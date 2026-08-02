package com.ersa.tracker.controllers;

import com.ersa.tracker.dto.ExerciseDto;
import com.ersa.tracker.models.Exercise;
import com.ersa.tracker.models.WType;
import com.ersa.tracker.repositories.ExerciseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@RestController
public class InfoController {
    @Autowired
    ExerciseRepository exerciseRepository;

    @GetMapping("exerciseinfo/{name}")
    public ExerciseDto getExerciseInfo(@PathVariable String name) {
        Exercise exercise = exerciseRepository.findByName(name);
        if (exercise == null) return null;
        return new ExerciseDto(
            exercise.getName(),
            exercise.getPrimaryTargets().stream().map(t -> new ExerciseDto.Target(t.getName(), t.getWtypes().stream().map(WType::getName).toList())).collect(Collectors.toList()),
            exercise.getSecondaryTargets().stream().map(t -> new ExerciseDto.Target(t.getName(), t.getWtypes().stream().map(WType::getName).toList())).collect(Collectors.toList())
        );
    }

    @GetMapping("exerciseinfo/")
    public List<ExerciseDto> getExerciseInfo() {
        return StreamSupport.stream(exerciseRepository.findAll().spliterator(), false).map(exercise -> new ExerciseDto(
            exercise.getName(),
            exercise.getPrimaryTargets().stream().map(t -> new ExerciseDto.Target(t.getName(), t.getWtypes().stream().map(WType::getName).toList())).collect(Collectors.toList()),
            exercise.getSecondaryTargets().stream().map(t -> new ExerciseDto.Target(t.getName(), t.getWtypes().stream().map(WType::getName).toList())).collect(Collectors.toList())
        )).collect(Collectors.toList());
    }
}
