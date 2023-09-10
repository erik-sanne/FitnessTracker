package com.ersa.tracker.services.general.season;

import com.ersa.tracker.dto.SeasonDto;
import com.ersa.tracker.models.user.UserProfile;

public interface SeasonService {
    SeasonDto getCurrentSeason(UserProfile profile);
    void addScore(UserProfile profile, long score);
    void preComputeScores();
    void manageWeeks();
}
