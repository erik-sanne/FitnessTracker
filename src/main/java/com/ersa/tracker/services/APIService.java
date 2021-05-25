package com.ersa.tracker.services;

import com.ersa.tracker.dto.PredictedORM;
import com.ersa.tracker.dto.SetAverage;
import com.ersa.tracker.dto.Week;
import com.ersa.tracker.dto.WorkoutSummary;
import com.ersa.tracker.models.authentication.User;

import java.util.Date;
import java.util.List;
import java.util.Map;

public interface APIService {
    Iterable<Week> getWorkoutsPerWeek(User user);
    Map<String, Float> getWorkoutDistribution(User user);
    Map<String, Float> getWorkoutDistribution(User user, int range);
    Map<String, Float> getWorkoutDistribution(User user, Date start, Date end);
    PredictedORM getPredictedORM(User user, String exercise);
    List<WorkoutSummary> getWorkoutSummaries(User user);
    List<SetAverage> getSetAverages(User user, String exercise);
}
