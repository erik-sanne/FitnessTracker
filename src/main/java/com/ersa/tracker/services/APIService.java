package com.ersa.tracker.services;

import com.ersa.tracker.dto.Week;
import com.ersa.tracker.dto.WorkoutSummary;
import com.ersa.tracker.models.authentication.User;

import java.util.List;
import java.util.Map;

public interface APIService {
    Iterable<Week> getWorkoutsPerWeek(User user);
    Map<String, Float> getSetPerBodypart(User user);
    List<WorkoutSummary> getWorkoutSummaries(User user);
}
