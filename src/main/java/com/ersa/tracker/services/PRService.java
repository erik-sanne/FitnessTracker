package com.ersa.tracker.services;

import com.ersa.tracker.models.PersonalRecord;
import com.ersa.tracker.models.Workout;
import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.models.user.UserProfile;

import java.util.List;

public interface PRService {
    List<PersonalRecord> getRecords(User user);
    void updatePersonalRecords(UserProfile profile, Workout workout);
}
