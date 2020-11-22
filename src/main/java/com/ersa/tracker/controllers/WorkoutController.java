package com.ersa.tracker.controllers;

import com.ersa.tracker.dto.Week;
import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.models.Workout;
import com.ersa.tracker.repositories.ExerciseRepository;
import com.ersa.tracker.repositories.authentication.UserRepository;
import com.ersa.tracker.repositories.WorkoutRepository;
import com.ersa.tracker.services.AccountService;
import com.ersa.tracker.services.WorkoutsService;
import com.ersa.tracker.utils.KVPair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@RestController
public class WorkoutController {

    @Autowired
    private WorkoutsService workoutsService;

    @Autowired
    private AccountService accountService;

    @Autowired
    private ExerciseRepository exerciseRepository;

    @Autowired
    private WorkoutRepository workoutRepository;

    @GetMapping("api/workoutsPerWeek")
    public Iterable<Week> getWorkoutsPerWeek(Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        return workoutsService.getWorkoutsPerWeek(currentUser);
    }

    @GetMapping("api/distribution")
    public List<KVPair<String, Float>> getSetsPerBodypart(Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        return workoutsService.getSetPerBodypart(currentUser);
    }

    @GetMapping("api/exercises")
    public List<String> getExercises() {
        List<String> exercises = new ArrayList<>();
        exerciseRepository.findAll().forEach(e -> exercises.add(e.getName()));
        return exercises;
    }

    @PostMapping("api/saveWorkout")
    public ResponseEntity<?> saveWorkout(Principal principal, @RequestBody Workout workout) {
        User currentUser = accountService.getUserByPrincipal(principal);

        workout.setUser(currentUser);
        workoutRepository.save(workout);

        return ResponseEntity.accepted().build();
    }
}
