package com.ersa.tracker.controllers;

import com.ersa.tracker.dto.Week;
import com.ersa.tracker.dto.WorkoutSummary;
import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.models.Workout;
import com.ersa.tracker.services.APIService;
import com.ersa.tracker.services.ExerciseService;
import com.ersa.tracker.services.WorkoutService;
import com.ersa.tracker.services.authentication.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
public class WorkoutController {

    private final APIService apiService;
    private final AccountService accountService;
    private final WorkoutService workoutService;
    private final ExerciseService exerciseService;

    @Autowired
    public WorkoutController(final WorkoutService workoutService,
                             final AccountService accountService,
                             final ExerciseService exerciseService,
                             final APIService apiService) {
        this.workoutService = workoutService;
        this.accountService = accountService;
        this.exerciseService = exerciseService;
        this.apiService = apiService;
    }

    @GetMapping("api/workouts")
    public List<WorkoutSummary> getWorkouts(final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        return apiService.getWorkoutSummaries(currentUser);
    }

    @GetMapping("api/workoutsPerWeek")
    public Iterable<Week> getWorkoutsPerWeek(final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        return apiService.getWorkoutsPerWeek(currentUser);
    }

    @GetMapping("api/distribution")
    public Map<String, Float> getSetsPerBodypart(final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        return apiService.getWorkoutDistribution(currentUser);
    }

    @GetMapping("api/exercises")
    public List<String> getExercises() {
        return exerciseService.getAllExerciseNames();
    }

    @PostMapping("api/saveWorkout")
    public ResponseEntity<?> saveWorkout(final Principal principal, @RequestBody final Workout workout) {
        User currentUser = accountService.getUserByPrincipal(principal);
        workoutService.saveWorkout(currentUser, workout);
        return ResponseEntity.accepted().build();
    }
}
