package com.ersa.tracker.controllers;

import com.ersa.tracker.dto.*;
import com.ersa.tracker.models.PersonalRecord;
import com.ersa.tracker.models.Workout;
import com.ersa.tracker.models.WorkoutSet;
import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.models.user.UserProfile;
import com.ersa.tracker.services.authentication.AccountService;
import com.ersa.tracker.services.general.APIService;
import com.ersa.tracker.services.general.ExerciseService;
import com.ersa.tracker.services.general.PRService;
import com.ersa.tracker.services.general.WorkoutService;
import com.ersa.tracker.services.general.achivements.AchievementService;
import com.ersa.tracker.services.general.missions.TemplateResolver;
import com.ersa.tracker.services.user.ProfileService;
import lombok.AllArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.*;

@RestController
@AllArgsConstructor
public class WorkoutController {

    private final APIService apiService;
    private final AccountService accountService;
    private final WorkoutService workoutService;
    private final PRService recordService;
    private final ExerciseService exerciseService;
    private final ProfileService profileService;
    private final AchievementService achievementService;
    private final TemplateResolver missionResolver;

    @GetMapping("api/workouts")
    public List<WorkoutSummary> getWorkouts(final Principal principal, @RequestParam(name = "from", defaultValue = "0") Integer from, @RequestParam(name = "to", defaultValue = "999999") Integer to) {
        User currentUser = accountService.getUserByPrincipal(principal);
        from = Math.max(0, from);
        if (to <= from)
            throw new IllegalArgumentException();

        return apiService.getWorkoutSummaries(currentUser, from, to);
    }

    @GetMapping("api/workouts/{userId}")
    public List<WorkoutSummary> getWorkouts(final Principal principal, @PathVariable final long userId, @RequestParam(name = "from", defaultValue = "0") Integer from, @RequestParam(name = "to", defaultValue = "999999") Integer to) {
        from = Math.max(0, from);
        if (to <= from)
            throw new IllegalArgumentException();

        User currentUser = accountService.getUserByPrincipal(principal);
        Optional<User> resource = currentUser.getUserProfile().getFriends().stream().filter(friend -> friend.getUser().getId() == userId).map(UserProfile::getUser).findAny();

        if (resource.isEmpty()) {
            if (userId == currentUser.getId())
                resource = Optional.of(currentUser);
            else
                return new ArrayList<>();
        }

        return apiService.getWorkoutSummaries(resource.get(), from, to);
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
        return achievementService.getAchievements(currentUser);
    }

    @GetMapping("api/achievements/{userId}")
    public List<Achievement> getAchievements(@PathVariable long userId, final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        User friend = profileService.getFriend(currentUser, userId);
        return achievementService.getAchievements(friend);
    }

    @GetMapping("api/missions")
    public List<MissionDto> getMissions(final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        return missionResolver.getActive(currentUser);
    }

    @GetMapping("api/stats")
    public StatsDto getHardStats(final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        return workoutService.getStats(currentUser);
    }

    @GetMapping("api/stats/{userId}")
    public StatsDto getHardStats(@PathVariable long userId, final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        User friend = profileService.getFriend(currentUser, userId);
        return workoutService.getStats(friend);
    }
}
