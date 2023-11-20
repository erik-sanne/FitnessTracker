package com.ersa.tracker.services.general;

import com.ersa.tracker.dto.StatsDto;
import com.ersa.tracker.models.Exercise;
import com.ersa.tracker.models.Workout;
import com.ersa.tracker.models.WorkoutSet;
import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.repositories.ExerciseRepository;
import com.ersa.tracker.repositories.WorkoutRepository;
import com.ersa.tracker.repositories.WorkoutSetRepository;
import com.ersa.tracker.security.exceptions.ResourceNotFoundException;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Log4j2
public class WorkoutManager implements WorkoutService {
    private static final Sort SORT_DESCENDING = Sort.by("date").descending();

    private final WorkoutRepository workoutRepository;
    private final WorkoutSetRepository workoutSetRepository;
    private final ExerciseRepository exerciseRepository;
    private final PRService personalRecordService;
    private ApplicationEventPublisher applicationEventPublisher;

    @Autowired
    public WorkoutManager(final WorkoutRepository workoutRepository,
                          final PRService personalRecordService,
                          final WorkoutSetRepository workoutSetRepository,
                          final ExerciseRepository exerciseRepository,
                          final ApplicationEventPublisher applicationEventPublisher) {
        this.workoutRepository = workoutRepository;
        this.personalRecordService = personalRecordService;
        this.workoutSetRepository = workoutSetRepository;
        this.exerciseRepository = exerciseRepository;
        this.applicationEventPublisher = applicationEventPublisher;
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
    public List<WorkoutSet> getAllSetsForExercise(final User user, final Exercise exercise) {
        return getAllSetsForExercise(user, exercise.getName());
    }

    @Override
    public List<WorkoutSet> getAllSetsForExercise(User user, String exercise) {
        return getWorkouts(user).stream()
                .map(Workout::getSets)
                .flatMap(Collection::stream)
                        .filter(set -> set.getExercise().equals(exercise))
                .collect(Collectors.toList());
    }

    @Override
    public void saveWorkout(final User user, final Workout workout) {
        workout.setUser(user);
        workout.getSets().forEach(set -> set.setWorkout(workout));
        workoutRepository.save(workout);
        log.info("User with id {} published new workout", user.getId());
        personalRecordService.updatePersonalRecords(user);
        applicationEventPublisher.publishEvent(new NewWorkoutEvent(this));
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
        applicationEventPublisher.publishEvent(new NewWorkoutEvent(this));
        log.info("User with id {} edited workout {}", user.getId(), persistedWorkout.getId());
    }

    @Override
    public void deleteWorkout(final User user, final long workoutId) {
        workoutRepository.deleteById(workoutId);
        personalRecordService.updatePersonalRecords(user);
        applicationEventPublisher.publishEvent(new NewWorkoutEvent(this));
        log.info("Workout with id {} removed by user with id {}", workoutId, user.getId());
    }

    @Override
    public StatsDto getStats(User user) {
        StatsDto dto = new StatsDto();
        dto.setWorkouts(workoutRepository.countByUser(user));
        dto.setSets(workoutSetRepository.countByWorkoutUser(user));
        dto.setSetTypes(new HashMap<>());
        List<String> exercises = new ArrayList<>();
        exerciseRepository.findAll().forEach(e -> exercises.add(e.getName()));

        for (String exercise : exercises) {
            dto.getSetTypes().put(exercise, workoutSetRepository.countByWorkoutUserAndExercise(user, exercise));
        }
        Workout firstWorkout = workoutRepository.findFirstByUserOrderByDate(user);
        dto.setFirstWorkout(firstWorkout == null ? null : firstWorkout.getDate());

        Map<String, Set<Long>> workouts = new HashMap<>();
        for (String exercise : exercises) {
            if (!workouts.containsKey(exercise))
                workouts.put(exercise, new HashSet<>());
            workouts.get(exercise).addAll(workoutSetRepository.findByWorkoutUserAndExercise(user, exercise).stream().map(WorkoutSet::getWorkout).map(Workout::getId).collect(Collectors.toSet()));
        }
        dto.setSetWorkouts(new HashMap<>());
        workouts.forEach((key, value) -> dto.getSetWorkouts().put(key, value.size()));
        return dto;
    }
}
