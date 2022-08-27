package com.ersa.tracker.controllers;

import com.ersa.tracker.dto.*;
import com.ersa.tracker.models.PersonalRecord;
import com.ersa.tracker.models.WorkoutSet;
import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.models.Workout;
import com.ersa.tracker.models.user.UserProfile;
import com.ersa.tracker.services.general.APIService;
import com.ersa.tracker.services.general.ExerciseService;
import com.ersa.tracker.services.general.PRService;
import com.ersa.tracker.services.general.WorkoutService;
import com.ersa.tracker.services.authentication.AccountService;
import com.ersa.tracker.services.general.achivements.AchievementService;
import com.ersa.tracker.services.user.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;

import java.security.Principal;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
public class WorkoutController {

    private final APIService apiService;
    private final AccountService accountService;
    private final WorkoutService workoutService;
    private final PRService recordService;
    private final ExerciseService exerciseService;
    private final ProfileService profileService;
    private final AchievementService achievementService;

    @Autowired
    public WorkoutController(final WorkoutService workoutService,
                             final AccountService accountService,
                             final ExerciseService exerciseService,
                             final PRService recordService,
                             final APIService apiService,
                             final ProfileService profileService,
                             final AchievementService achievementService) {
        this.workoutService = workoutService;
        this.accountService = accountService;
        this.exerciseService = exerciseService;
        this.recordService = recordService;
        this.apiService = apiService;
        this.profileService = profileService;
        this.achievementService = achievementService;
    }

    @GetMapping("api/workouts")
    public List<WorkoutSummary> getWorkouts(final Principal principal, @RequestParam(name = "from", defaultValue = "0") Integer from, @RequestParam(name = "to", defaultValue = "999999") Integer to) {
        User currentUser = accountService.getUserByPrincipal(principal);
        from = Math.max(0, from);
        if (to <= from)
            throw new IllegalArgumentException();

        return apiService.getWorkoutSummaries(currentUser, from, to);
    }

    @GetMapping("api/workout/{id}")
    public Workout getWorkouts(@PathVariable final long id, final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        return workoutService.getWorkout(currentUser, id);
    }

    @GetMapping("api/setsForWorkout/{id}")
    public Collection<WorkoutSet> getSetsForWorkout(@PathVariable final long id, final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        return workoutService.getSetsForWorkout(currentUser, id);
    }

    @DeleteMapping("api/removeWorkout/{id}")
    public void deleteWorkout(@PathVariable final long id, final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        workoutService.deleteWorkout(currentUser, id);
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

    @GetMapping("api/predictORM/{exercise}")
    public PredictedORM getWorkoutsPerWeek(@PathVariable String exercise, final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        return apiService.getPredictedORM(currentUser, exercise);
    }

    @GetMapping("api/distribution")
    public Map<String, Float> getSetsPerBodypart(@RequestParam(name = "from", defaultValue = "")
                                                 @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                                                 final Date startdate,
                                                 @RequestParam(name = "to", defaultValue = "")
                                                 @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                                                 final Date enddate,
                                                 final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        if (startdate != null && enddate != null)
            return apiService.getWorkoutDistribution(currentUser, startdate, enddate);
        return apiService.getWorkoutDistribution(currentUser);

    }

    @GetMapping("api/distribution/{userId}")
    public Map<String, Float> getSetsPerBodypart(@PathVariable final long userId,
                                                 @RequestParam(name = "from", defaultValue = "")
                                                 @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                                                 final Date startdate,
                                                 @RequestParam(name = "to", defaultValue = "")
                                                 @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                                                 final Date enddate,
                                                 final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        User friend = profileService.getFriend(currentUser, userId);
        if (startdate != null && enddate != null)
            return apiService.getWorkoutDistribution(friend, startdate, enddate);
        return apiService.getWorkoutDistribution(friend);
    }

    @GetMapping("api/setAverages/{exercise}")
    public List<SetAverage> getExercises(@PathVariable final String exercise, final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        return apiService.getSetAverages(currentUser, exercise);
    }

    @GetMapping("api/setAverages/{exercise}/{userId}")
    public List<SetAverage> getExercises(@PathVariable final String exercise,
                                         @PathVariable final long userId,
                                         final Principal principal) {
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

    @PostMapping("api/updateWorkout/{id}")
    public ResponseEntity<?> updateWorkout(@PathVariable final long id, final Principal principal, @RequestBody final Workout workout) {
        User currentUser = accountService.getUserByPrincipal(principal);
        workoutService.updateWorkout(currentUser, workout, id);
        return ResponseEntity.accepted().build();
    }

    @GetMapping("api/records")
    public List<PersonalRecord> getRecords(final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        return recordService.getRecords(currentUser);
    }

    @GetMapping("api/records/{userId}")
    public List<PersonalRecord> getRecordsForFriend(@PathVariable final long userId, final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        User friend = profileService.getFriend(currentUser, userId);
        return recordService.getRecordsObfuscated(friend);
    }

    @GetMapping("api/achievements")
    public List<Achievement> getAchievements(final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        return achievementService.getAchivements(currentUser);
    }

    @GetMapping("api/stats")
    public StatsDto getHardStats(final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        return workoutService.getStats(currentUser);
    }
}
