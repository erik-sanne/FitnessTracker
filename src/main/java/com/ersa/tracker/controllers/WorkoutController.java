package com.ersa.tracker.controllers;

import com.ersa.tracker.dto.SetAverage;
import com.ersa.tracker.dto.Week;
import com.ersa.tracker.dto.WorkoutSummary;
import com.ersa.tracker.models.Exercise;
import com.ersa.tracker.models.WorkoutSet;
import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.models.Workout;
import com.ersa.tracker.models.user.UserProfile;
import com.ersa.tracker.services.APIService;
import com.ersa.tracker.services.ExerciseService;
import com.ersa.tracker.services.WorkoutService;
import com.ersa.tracker.services.authentication.AccountService;
import com.ersa.tracker.services.user.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Collection;
import java.util.List;
import java.util.Map;

@RestController
public class WorkoutController {

    private final APIService apiService;
    private final AccountService accountService;
    private final WorkoutService workoutService;
    private final ExerciseService exerciseService;
    private final ProfileService profileService;

    @Autowired
    public WorkoutController(final WorkoutService workoutService,
                             final AccountService accountService,
                             final ExerciseService exerciseService,
                             final APIService apiService,
                             final ProfileService profileService) {
        this.workoutService = workoutService;
        this.accountService = accountService;
        this.exerciseService = exerciseService;
        this.apiService = apiService;
        this.profileService = profileService;
    }

    @GetMapping("api/workouts")
    public List<WorkoutSummary> getWorkouts(final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        return apiService.getWorkoutSummaries(currentUser);
    }

    @GetMapping("api/setsForWorkout/{id}")
    public Collection<WorkoutSet> getSetsForWorkout(@PathVariable long id, final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        return workoutService.getSetsForWorkout(currentUser, id);
    }

    @GetMapping("api/workoutsPerWeek")
    public Iterable<Week> getWorkoutsPerWeek(final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        return apiService.getWorkoutsPerWeek(currentUser);
    }

    @GetMapping("api/workoutsPerWeek/{userId}")
    public Iterable<Week> getWorkoutsPerWeek(@PathVariable final long userId, final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        User friend = profileService.getFriend(currentUser, userId);
        return apiService.getWorkoutsPerWeek(friend);
    }

    @GetMapping("api/distribution")
    public Map<String, Float> getSetsPerBodypart(final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        return apiService.getWorkoutDistribution(currentUser);
    }

    @GetMapping("api/distribution/{userId}")
    public Map<String, Float> getSetsPerBodypart(@PathVariable final long userId, final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        User friend = profileService.getFriend(currentUser, userId);
        return apiService.getWorkoutDistribution(friend);
    }

    @GetMapping("api/setAverages/{exercise}")
    public List<SetAverage> getExercises(@PathVariable String exercise, final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        return apiService.getSetAverages(currentUser, exercise);
    }

    @GetMapping("api/setAverages/{exercise}/{userId}")
    public List<SetAverage> getExercises(@PathVariable String exercise, @PathVariable final long userId, final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        User friend = profileService.getFriend(currentUser, userId);
        return apiService.getSetAverages(friend, exercise);
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
