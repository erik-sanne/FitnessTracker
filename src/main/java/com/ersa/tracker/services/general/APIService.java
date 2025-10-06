package com.ersa.tracker.services.general;

import com.ersa.tracker.dto.PredictedORM;
import com.ersa.tracker.dto.SetAverage;
import com.ersa.tracker.dto.Week;
import com.ersa.tracker.dto.WorkoutSummary;
import com.ersa.tracker.models.authentication.User;
import org.hibernate.annotations.Comment;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;
import java.util.Map;

public interface APIService {
    List<Week> getWorkoutsPerWeek(User user);
    Map<String, List<Number>> getBodyPartDistributionOverTime(User user);
    Map<String, Float> getWorkoutDistribution(User user);
    Map<String, Float> getWorkoutDistribution(User user, int range);
    Map<String, Float> getWorkoutDistribution(User user, Date start, Date end);
    PredictedORM getPredictedORM(User user, String exercise);
    List<WorkoutSummary> getWorkoutSummaries(User user);
    List<WorkoutSummary> getWorkoutSummaries(User user, int from, int to);
    List<WorkoutSummary> getWorkoutSummaries(User user, boolean groupPPL, int from, int to);
    List<SetAverage> getSetAverages(User user, String exercise);
}
