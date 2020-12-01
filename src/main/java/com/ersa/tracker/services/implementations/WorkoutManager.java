package com.ersa.tracker.services.implementations;

import com.ersa.tracker.models.Exercise;
import com.ersa.tracker.models.Workout;
import com.ersa.tracker.models.WorkoutSet;
import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.repositories.WorkoutRepository;
import com.ersa.tracker.security.exceptions.ResourceNotFoundException;
import com.ersa.tracker.services.WorkoutService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import javax.mail.AuthenticationFailedException;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Log4j2
public class WorkoutManager implements WorkoutService {
    private static final Sort SORT_DESCENDING = Sort.by("date").descending();

    private WorkoutRepository workoutRepository;

    @Autowired
    public WorkoutManager(final WorkoutRepository workoutRepository) {
        this.workoutRepository = workoutRepository;
    }


    @Override
    public List<Workout> getWorkouts(final User user, final int limit) {
        return workoutRepository.findAllByUser(user, PageRequest.of(0, limit, SORT_DESCENDING)).getContent();
    }

    @Override
    public List<Workout> getWorkouts(final User user) {
        List<Workout> workouts = workoutRepository.findAllByUser(user, SORT_DESCENDING);
        return workouts;
    }

    @Override
    public Collection<WorkoutSet> getSetsForWorkout(User user, long workoutId) {
        Workout workout = workoutRepository.findById(workoutId).get();

        if (!workout.getUser().equals(user)){
            log.warn("user id {} requested workout for user id {}", user.getId(), workout.getUser().getId());
        }

        Collection<WorkoutSet> sets = workout.getSets();
        sets.forEach(s -> s.setWorkout(null));
        return sets;
    }

    @Override
    public List<Set<WorkoutSet>> getPartitionedWorkoutSets(final User user, final Exercise exercise) {
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
    public void saveWorkout(final User user, final Workout workout) {
        workout.setUser(user);
        workout.getSets().stream().forEach(set -> set.setWorkout(workout));
        workoutRepository.save(workout);
    }
}
