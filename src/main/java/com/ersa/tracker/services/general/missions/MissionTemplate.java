package com.ersa.tracker.services.general.missions;

import com.ersa.tracker.models.Mission;
import com.ersa.tracker.models.authentication.User;
import org.springframework.stereotype.Component;

@Component
public interface MissionTemplate {

    String getIdentifier();
    String getName(Mission mission);
    String getDescription(Mission mission);
    long getReward();

    int evaluateProgress(Mission mission);
    Mission generateMission(User user);
}
