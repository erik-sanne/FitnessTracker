package com.ersa.tracker.services.implementations;

import com.ersa.tracker.models.Exercise;
import com.ersa.tracker.models.Workout;
import com.ersa.tracker.models.WorkoutSet;
import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.repositories.WorkoutRepository;
import com.ersa.tracker.services.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class WorkoutManager implements WorkoutService {
    private static final Sort descDateSort = Sort.by("date").descending();

    private WorkoutRepository workoutRepository;

    @Autowired
    public WorkoutManager(WorkoutRepository workoutRepository) {
        this.workoutRepository = workoutRepository;
    }


    @Override
    public List<Workout> getWorkouts(User user, int limit) {
        return workoutRepository.findAllByUser(user, PageRequest.of(0, limit, descDateSort)).getContent();
    }

    @Override
    public List<Workout> getWorkouts(User user) {
        return workoutRepository.findAllByUser(user, descDateSort);
    }

    @Override
    public List<Set<WorkoutSet>> getPartitionedWorkoutSets(User user, Exercise exercise) {
        List<Set<WorkoutSet>> setsForExercise = getWorkouts(user)
                .stream()
                .map(workout -> workout
                        .getSets()
                        .stream()
                        .filter(set -> set
                                .getExercise()
                                .equals(exercise.getName()))
                        .collect(Collectors.toSet()))
                .collect(Collectors.toList());
        return setsForExercise;
    }

    @Override
    public void saveWorkout(User user, Workout workout) {
        workout.setUser(user);
        workout.getSets().stream().forEach(set -> set.setWorkout(workout));
        workoutRepository.save(workout);
    }
}
