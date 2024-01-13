package com.ersa.tracker.services.general.goal;

import com.ersa.tracker.controllers.GoalController;
import com.ersa.tracker.models.user.Goal;
import com.ersa.tracker.models.user.UserProfile;
import com.ersa.tracker.repositories.GoalRepository;
import com.ersa.tracker.repositories.WorkoutRepository;
import com.ersa.tracker.utils.DateUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.logging.log4j.util.Strings;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.temporal.ChronoField;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class WorkoutGoalService implements GoalService {

    private final GoalRepository repository;
    private final WorkoutRepository workoutRepository;

    @Override
    public void createGoal(GoalController.CreateGoal goalDto, UserProfile userProfile) {
        Goal goal = new Goal();
        goal.setType(Goal.Type.valueOf(goalDto.getType()));
        goal.setUserProfile(userProfile);
        goal.setComplete(false);
        goal.setStartDate(goalDto.getStart());
        goal.setEndDate(goalDto.getEnd());
        goal.setTarget(goalDto.getTarget());
        if (!Strings.isBlank(goalDto.getName())) {
            goal.setName(goalDto.getName());
        }

        repository.save(goal);
    }

    @Override
    public void updateGoal(long id, GoalController.CreateGoal goalDto, UserProfile userProfile) {
        Goal goal = repository.findById(id).orElse(null);
        if (goal == null || !userProfile.equals(goal.getUserProfile())) {
            log.error("UserProfile {} tried to update goal with id {}. Goal: {}", userProfile.getUser().getId(), id, goal);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden");
        }
        goal.setComplete(false);
        goal.setStartDate(goalDto.getStart());
        goal.setEndDate(goalDto.getEnd());
        goal.setTarget(goalDto.getTarget());
        if (!Strings.isBlank(goalDto.getName())) {
            goal.setName(goalDto.getName());
        }

        repository.save(goal);
    }

    @Override
    public void removeGoal(long id, UserProfile userProfile) {
        Goal goal = repository.findById(id).orElse(null);
        if (goal == null || !userProfile.equals(goal.getUserProfile())) {
            log.error("UserProfile {} tried to remove goal with id {}. Goal: {}", userProfile.getUser().getId(), id, goal);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden");
        }
        repository.delete(goal);
    }

    @Override
    public void trackGoal(long id, UserProfile userProfile) {
        Goal goal = repository.findById(id).orElse(null);
        if (goal == null || !userProfile.equals(goal.getUserProfile())) {
            log.error("UserProfile {} tried to track goal with id {}. Goal: {}", userProfile.getUser().getId(), id, goal);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden");
        }

        if (goal.isTracked()) {
            goal.setTracked(false);
        } else {
            List<Goal> allGoals = repository.findByUserProfile(userProfile);
            allGoals = allGoals.stream().peek(g -> g.setTracked(false)).toList();
            repository.saveAll(allGoals);
            goal.setTracked(true);
        }
        repository.save(goal);
    }

    @Override
    public List<GoalController.GoalProgress> getProgress(UserProfile profile) {
        closeFinished(profile);
        List<Goal> ongoing = repository.findByUserProfile(profile).stream().filter(goal -> !goal.isComplete()).toList();
        return ongoing.stream().map(this::evaluateProgress).toList();
    }

    @Override
    public List<GoalController.GoalProgress> getArchived(UserProfile profile) {
        return null;
    }

    private GoalController.GoalProgress evaluateProgress(Goal goal) {
        var target = goal.getTarget();

        GoalController.GoalProgress goalProgress = new GoalController.GoalProgress();
        goalProgress.setId(goal.getId());
        goalProgress.setType(goal.getType().name());
        goalProgress.setStartDate(DateUtils.FORMAT_yyyyMMdd.format(goal.getStartDate()));
        goalProgress.setEndDate(DateUtils.FORMAT_yyyyMMdd.format(goal.getEndDate()));
        goalProgress.setTargetValue(target);
        goalProgress.setName(goal.getName());
        goalProgress.setTracked(goal.isTracked());

        return switch (goal.getType()) {
            case WORKOUTS -> evaluateWorkoutsTotal(goal, goalProgress);
            case WORKOUTS_WEEKLY -> evaluateWorkoutsWeekly(goal, goalProgress);
        };
    }

    private GoalController.GoalProgress evaluateWorkoutsTotal(Goal goal, GoalController.GoalProgress goalProgress) {
        var current = workoutRepository.countByUserAndDateGreaterThanEqualAndDateLessThanEqual(goal.getUserProfile().getUser(), goal.getStartDate(), goal.getEndDate());
        goalProgress.setCurrentValue(current);

        var startOfWeek = Instant.now().atZone(DateUtils.TZ_SWE.toZoneId()).with(ChronoField.DAY_OF_WEEK, 1);
        var currentAtStartOfWeek = workoutRepository.countByUserAndDateGreaterThanEqualAndDateLessThanEqual(goal.getUserProfile().getUser(), goal.getStartDate(), Date.from(startOfWeek.toInstant()));
        var targetDate = goal.getEndDate().toInstant().atZone(DateUtils.TZ_SWE.toZoneId());
        var weeksDiff = (float)Math.max(ChronoUnit.WEEKS.between(startOfWeek, targetDate), 1);
        var progressLeft = goal.getTarget() - currentAtStartOfWeek;
        goalProgress.setWeeklyTarget(progressLeft / weeksDiff);
        return goalProgress;
    }

    private GoalController.GoalProgress evaluateWorkoutsWeekly(Goal goal, GoalController.GoalProgress goalProgress) {
        var now = Instant.now().atZone(DateUtils.TZ_SWE.toZoneId());
        var startOfWeek = now.with(ChronoField.DAY_OF_WEEK, 1);
        var current = workoutRepository.countByUserAndDateGreaterThanEqualAndDateLessThanEqual(goal.getUserProfile().getUser(), Date.from(startOfWeek.toInstant()), Date.from(now.toInstant()));
        goalProgress.setCurrentValue(current);
        goalProgress.setWeeklyTarget(goal.getTarget());
        return goalProgress;
    }

    private void closeFinished(UserProfile profile) {
        List<Goal> ongoing = repository.findByUserProfile(profile).stream().filter(goal -> !goal.isComplete()).collect(Collectors.toList());
        Date now = Date.from(Instant.now());
        List<Goal> completed = ongoing.stream().filter(goal -> goal.getEndDate().before(now)).peek(goal -> goal.setComplete(true)).collect(Collectors.toList());

        // TODO: Notify

        repository.saveAll(completed);
    }
}
