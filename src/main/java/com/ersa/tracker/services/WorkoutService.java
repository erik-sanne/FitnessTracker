package com.ersa.tracker.services;
import com.ersa.tracker.dto.WorkoutSummary;
import com.ersa.tracker.models.Exercise;
import com.ersa.tracker.models.Workout;
import com.ersa.tracker.models.WorkoutSet;
import com.ersa.tracker.models.authentication.User;

import java.util.List;
import java.util.Set;

public interface WorkoutService {
    List<Set<WorkoutSet>> getPartitionedWorkoutSets(User user, Exercise exercise);
    List<Workout> getWorkouts(User user, int limit);
    List<Workout> getWorkouts(User user);

    void saveWorkout(User user, Workout workout);
}
