package com.ersa.tracker.services.general;
import com.ersa.tracker.dto.StatsDto;
import com.ersa.tracker.models.Exercise;
import com.ersa.tracker.models.Workout;
import com.ersa.tracker.models.WorkoutSet;
import com.ersa.tracker.models.authentication.User;

import javax.transaction.Transactional;
import java.util.Collection;
import java.util.List;
import java.util.Set;

public interface WorkoutService {
    List<WorkoutSet> getAllSetsForExercise(User user, Exercise exercise);
    List<WorkoutSet> getAllSetsForExercise(User user, String exercise);
    List<Workout> getWorkouts(User user, int limit);
    List<Workout> getWorkouts(User user);
    Workout getWorkout(User user, long workoutId);
    Collection<WorkoutSet> getSetsForWorkout(User user, long workoutId);
    StatsDto getStats(User user);

    @Transactional
    void saveWorkout(User user, Workout workout);
    @Transactional
    void updateWorkout(User user, Workout workout, long id);
    @Transactional
    void deleteWorkout(User user, long workoutId);
}
