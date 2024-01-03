package com.ersa.tracker.services.general.goal;

import com.ersa.tracker.controllers.GoalController;
import com.ersa.tracker.models.user.Goal;
import com.ersa.tracker.models.user.UserProfile;
import com.ersa.tracker.repositories.GoalRepository;
import com.ersa.tracker.repositories.WorkoutRepository;
import com.ersa.tracker.utils.DateUtils;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.util.Strings;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkoutGoalService implements GoalService {

    private final GoalRepository repository;
    private final WorkoutRepository workoutRepository;

    @Override
    public void createGoal(GoalController.CreateGoal goalDto, UserProfile userProfile) {
        Goal goal = new Goal();
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
    public List<GoalController.GoalProgress> getProgress(UserProfile profile) {
        closeFinished(profile);
        List<Goal> ongoing = repository.findByUserProfile(profile).stream().filter(goal -> !goal.isComplete()).toList();
        return ongoing.stream().map(this::evaluateProgress).toList();
    }

    private GoalController.GoalProgress evaluateProgress(Goal goal) {
        var target = goal.getTarget();

        GoalController.GoalProgress goalProgress = new GoalController.GoalProgress();
        goalProgress.setStartDate(DateUtils.FORMAT_yyyyMMdd.format(goal.getStartDate()));
        goalProgress.setEndDate(DateUtils.FORMAT_yyyyMMdd.format(goal.getEndDate()));
        goalProgress.setTargetValue(target);
        goalProgress.setName(goal.getName());

        var current = workoutRepository.countByUserAndDateGreaterThanEqualAndDateLessThanEqual(goal.getUserProfile().getUser(), goal.getStartDate(), goal.getEndDate());
        goalProgress.setCurrentValue(current);

        var now = Instant.now().atZone(DateUtils.TZ_SWE.toZoneId());
        var targetDate = goal.getEndDate().toInstant().atZone(DateUtils.TZ_SWE.toZoneId());
        var weeksDiff = (float)ChronoUnit.WEEKS.between(now, targetDate);
        var progressLeft = target - current;
        goalProgress.setWeeklyTarget(progressLeft / weeksDiff);
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
