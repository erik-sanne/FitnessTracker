package com.ersa.tracker.services;

import com.ersa.tracker.dto.Week;
import com.ersa.tracker.models.authentication.User;

import java.util.Map;

public interface APIService {
    Iterable<Week> getWorkoutsPerWeek(User user);
    Map<String, Float> getSetPerBodypart(User user);
}
