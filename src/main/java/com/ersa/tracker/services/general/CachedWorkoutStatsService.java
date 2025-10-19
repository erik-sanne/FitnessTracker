package com.ersa.tracker.services.general;

import com.ersa.tracker.dto.PredictedORM;
import com.ersa.tracker.dto.SetAverage;
import com.ersa.tracker.dto.Week;
import com.ersa.tracker.dto.WorkoutSummary;
import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.repositories.authentication.UserRepository;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.LoadingCache;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Slf4j
public class CachedWorkoutStatsService implements APIService, ApplicationListener<NewWorkoutEvent> {

    private final APIService delegatee;
    private final UserRepository userRepository;
    private final LoadingCache<Long, List<Week>> workoutsPerWeekCache;
    private final LoadingCache<Long, Map<String, List<Number>>> bodyPartDistributionOverTimeCache;
    private final LoadingCache<WorkoutDistributionKey, Map<String, Float>> workoutDistributionCache;
    private final LoadingCache<SetAvgKey, List<SetAverage>> progressionCache;
    private final LoadingCache<SummariesKey, List<WorkoutSummary>> summariesCache;

    public CachedWorkoutStatsService(APIService delegatee, UserRepository userRepository) {
        this.delegatee = delegatee;
        this.userRepository = userRepository;

        workoutsPerWeekCache = Caffeine.newBuilder()
                .expireAfterWrite(24, TimeUnit.HOURS)
                .maximumSize(1000)
                .build((id) -> delegatee.getWorkoutsPerWeek(asUser(id)));
        bodyPartDistributionOverTimeCache = Caffeine.newBuilder()
                .expireAfterWrite(24, TimeUnit.HOURS)
                .maximumSize(1000)
                .build((id) -> delegatee.getBodyPartDistributionOverTime(asUser(id)));
        workoutDistributionCache = Caffeine.newBuilder()
                .expireAfterWrite(24, TimeUnit.HOURS)
                .maximumSize(1000)
                .build((key) -> {
                    if (key.start == null && key.end == null)
                        return delegatee.getWorkoutDistribution(asUser(key.userId));
                    else
                        return delegatee.getWorkoutDistribution(asUser(key.userId), key.start, key.end);
                });
        progressionCache = Caffeine.newBuilder()
                .expireAfterWrite(24, TimeUnit.HOURS)
                .maximumSize(1000)
                .build((key) -> delegatee.getSetAverages(asUser(key.userId), key.exercise));
        summariesCache = Caffeine.newBuilder()
                .expireAfterWrite(24, TimeUnit.HOURS)
                .maximumSize(1000)
                .build((key) -> delegatee.getWorkoutSummaries(asUser(key.userId), key.groupPP, 0, Integer.MAX_VALUE));
    }

    @Override
    public void onApplicationEvent(@NotNull NewWorkoutEvent event) {
        log.info("Received event to evict all workout caches");
        workoutsPerWeekCache.invalidateAll();
        bodyPartDistributionOverTimeCache.invalidateAll();
        workoutDistributionCache.invalidateAll();
        progressionCache.invalidateAll();
        summariesCache.invalidateAll();
    }

    private static class SetAvgKey {
        private final long userId;
        private final String exercise;

        private SetAvgKey(long userId, String exercise) {
            this.userId = userId;
            this.exercise = exercise;
        }
    }

    private static class WorkoutDistributionKey {
        private final long userId;
        private final Date start;
        private final Date end;

        public WorkoutDistributionKey(long userId, Date start, Date end) {
            this.userId = userId;
            this.start = start;
            this.end = end;
        }
    }

    private static record SummariesKey(long userId, boolean groupPP) {}

    private User asUser(Long id) {
        return userRepository.findById(id).orElseThrow();
    }

    @Override
    public List<Week> getWorkoutsPerWeek(User user) {
        return workoutsPerWeekCache.get(user.getId());
    }

    @Override
    public Map<String, List<Number>> getBodyPartDistributionOverTime(User user) {
        return bodyPartDistributionOverTimeCache.get(user.getId());
    }

    @Override
    public Map<String, Float> getWorkoutDistribution(User user) {
        return workoutDistributionCache.get(new WorkoutDistributionKey(user.getId(), null, null));
    }

    @Override
    public Map<String, Float> getWorkoutDistribution(User user, int range) {
        return delegatee.getWorkoutDistribution(user, range);
    }

    @Override
    public Map<String, Float> getWorkoutDistribution(User user, Date start, Date end) {
        return workoutDistributionCache.get(new WorkoutDistributionKey(user.getId(), start, end));
    }

    @Override
    public PredictedORM getPredictedORM(User user, String exercise) {
        //TODO: Cache
        return delegatee.getPredictedORM(user, exercise);
    }

    @Override
    public List<WorkoutSummary> getWorkoutSummaries(User user) {
        //TODO: Cache
        return delegatee.getWorkoutSummaries(user);
    }

    @Override
    public List<WorkoutSummary> getWorkoutSummaries(User user, int from, int to) {
        //TODO: Cache
        return delegatee.getWorkoutSummaries(user, from, to);
    }

    @Override
    public List<WorkoutSummary> getWorkoutSummaries(User user, boolean groupPPL, int from, int to) {
        if (from == 0 && to == Integer.MAX_VALUE) {
            return summariesCache.get(new SummariesKey(user.getId(), groupPPL));
        }

        return delegatee.getWorkoutSummaries(user, groupPPL, from, to);
    }

    @Override
    public List<SetAverage> getSetAverages(User user, String exercise) {
        return progressionCache.get(new SetAvgKey(user.getId(), exercise));
    }
}
