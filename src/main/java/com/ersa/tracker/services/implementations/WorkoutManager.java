package com.ersa.tracker.services.implementations;

import com.ersa.tracker.models.Exercise;
import com.ersa.tracker.models.Workout;
import com.ersa.tracker.models.WorkoutSet;
import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.repositories.WorkoutRepository;
import com.ersa.tracker.repositories.WorkoutSetRepository;
import com.ersa.tracker.security.exceptions.ResourceNotFoundException;
import com.ersa.tracker.services.PRService;
import com.ersa.tracker.services.WorkoutService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Log4j2
public class WorkoutManager implements WorkoutService {
    private static final Sort SORT_DESCENDING = Sort.by("date").descending();

    private final WorkoutRepository workoutRepository;
    private final WorkoutSetRepository workoutSetRepository;
    private final PRService personalRecordService;

    @Autowired
    public WorkoutManager(final WorkoutRepository workoutRepository,
                          final PRService personalRecordService,
                          final WorkoutSetRepository workoutSetRepository) {
        this.workoutRepository = workoutRepository;
        this.personalRecordService = personalRecordService;
        this.workoutSetRepository = workoutSetRepository;
    }

    @Override
    public List<Workout> getWorkouts(final User user, final int limit) {
        return workoutRepository.findAllByUser(user, PageRequest.of(0, limit, SORT_DESCENDING)).getContent();
    }

    @Override
    public List<Workout> getWorkouts(final User user) {
        return workoutRepository.findAllByUser(user, SORT_DESCENDING);
    }

    @Override
    public Workout getWorkout(final User user, final long workoutId) {
        Optional<Workout> workout = workoutRepository.findById(workoutId);
        if (workout.isEmpty()) {
            log.warn("Workout not found");
            throw new ResourceNotFoundException();
        }
        if (workout.get().getUser().getId() != user.getId()) {
            log.error("Workout {} does not belong to user {}", workoutId, user.getId());
        }
        return workout.get();
    }

    @Override
    public Collection<WorkoutSet> getSetsForWorkout(final User user, final long workoutId) {
        @SuppressWarnings("OptionalGetWithoutIsPresent")
        Workout workout = workoutRepository.findById(workoutId).get();

        if (!workout.getUser().equals(user)) {
            log.warn("user id {} requested workout for user id {}", user.getId(), workout.getUser().getId());
        }

        Collection<WorkoutSet> sets = workout.getSets();
        sets.forEach(s -> s.setWorkout(null));
        return sets.stream().sorted(Comparator.comparingLong(WorkoutSet::getId)).collect(Collectors.toList());
    }

    @Override
    public List<Set<WorkoutSet>> getPartitionedWorkoutSets(final User user, final Exercise exercise) {
        return getWorkouts(user)
                .stream()
                .map(workout -> workout
                        .getSets()
                        .stream()
                        .filter(set -> set
                                .getExercise()
                                .equals(exercise.getName()))
                        .collect(Collectors.toSet()))
                .collect(Collectors.toList());
    }

    @Override
    public void saveWorkout(final User user, final Workout workout) {
        workout.setUser(user);
        workout.getSets().forEach(set -> set.setWorkout(workout));
        workoutRepository.save(workout);
        personalRecordService.updatePersonalRecords(user);
        log.info("User with id {} published new workout", user.getId());
    }

    @Override
    public void updateWorkout(final User user, final Workout submittedWorkout, final long id) {
        Optional<Workout> persistedWorkoutOpt = workoutRepository.findById(id);
        if (persistedWorkoutOpt.isEmpty()) {
            log.error("Workout was not found");
            throw new ResourceNotFoundException("Workout not found");
        }
        Workout persistedWorkout = persistedWorkoutOpt.get();
        if (persistedWorkout.getUser().getId() != user.getId()) {
            log.error("Workout {} does not belong to user {}", persistedWorkout.getId(), user.getId());
            throw new BadCredentialsException("Resource not accessible by user");
        }
        Collection<WorkoutSet> oldSets = persistedWorkout.getSets();
        persistedWorkout.setSets(null);
        persistedWorkout = workoutRepository.save(persistedWorkout);
        oldSets.forEach(workoutSetRepository::delete);
        for (WorkoutSet set : submittedWorkout.getSets()) {
            set.setWorkout(persistedWorkout);
        }
        persistedWorkout.setSets(submittedWorkout.getSets());
        persistedWorkout.setDate(submittedWorkout.getDate());
        persistedWorkout = workoutRepository.save(persistedWorkout);
        personalRecordService.updatePersonalRecords(user);
        log.info("User with id {} edited workout {}", user.getId(), persistedWorkout.getId());
    }

    @Override
    public void deleteWorkout(final User user, final long workoutId) {
        workoutRepository.deleteById(workoutId);
        personalRecordService.updatePersonalRecords(user);
        log.info("Workout with id {} removed by user with id {}", workoutId, user.getId());
    }
}
