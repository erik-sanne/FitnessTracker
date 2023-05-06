package com.ersa.tracker.services.general.missions;

import com.ersa.tracker.dto.MissionDto;
import com.ersa.tracker.models.Mission;
import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.models.user.UserProfile;
import com.ersa.tracker.repositories.MissionRepository;
import com.ersa.tracker.repositories.UserProfileRepository;
import com.ersa.tracker.utils.DateUtils;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@AllArgsConstructor
@Log4j2
@Service
public class TemplateResolver {

    final static int NUMBER_OF_MISSIONS = 3;

    private UserProfileRepository userProfileRepository;
    private MissionRepository missionRepository;
    private List<MissionTemplate> allMissionTemplates;


    public List<MissionDto> getActive(User user) {
        if (removeObsolete(user)) {
            generateMissions(user);
        }
        List<Mission> active = missionRepository.findByUser(user);

        List<MissionDto> dtos = new ArrayList<>();
        for (Mission mission : active) {
            MissionTemplate template = getTemplate(mission);
            if (template == null) {
                log.warn("Template for {} not found", mission.getMissionId());
                continue;
            }


            long lastProgress = mission.getProgress();
            mission.setProgress(template.evaluateProgress(mission));

            // Update score if goal achieved
            if (lastProgress < mission.getGoal() &&  mission.getProgress() >= mission.getGoal()) {
                UserProfile profile  = user.getUserProfile();
                profile.setScore(profile.getScore() + template.getReward());
                userProfileRepository.save(profile);
            }

            dtos.add(new MissionDto(
                    template.getName(mission),
                    template.getDescription(mission),
                    template.getReward(),
                    mission.getProgress(),
                    mission.getGoal(),
                    mission.getProgress() >= mission.getGoal()
            ));
        }

        return dtos;
    }

    MissionTemplate getTemplate(Mission mission) {
        return allMissionTemplates.stream().filter(template -> mission.getMissionId().equalsIgnoreCase(template.getIdentifier())).findAny().orElse(null);
    }

    boolean removeObsolete(User user) {
        List<Mission> missions = missionRepository.findByUser(user);
        int currentWeek = DateUtils.getCurrentWeek();
        List<Mission> obsolete = missions.stream().filter(mission -> mission.getWeek() != currentWeek).toList();
        missionRepository.deleteAll(obsolete);
        return missions.isEmpty() || obsolete.size() > 0;
    }

    void generateMissions(User user) {
        List<MissionTemplate> selectedMissionTemplates = new ArrayList<>();

        List<MissionTemplate> selection = new ArrayList<>(allMissionTemplates);
        Collections.shuffle(selection);
        for (int i = 0; i < TemplateResolver.NUMBER_OF_MISSIONS; i++) {
            if (selection.size() < i) {
                log.error("Trying to get more missions than exists");
            } else {
                selectedMissionTemplates.add(selection.get(i));
            }
        }

        List<Mission> newWeeklyMissions = new ArrayList<>();
        for (MissionTemplate template : selectedMissionTemplates) {
            Mission mission = template.generateMission(user);
            if (mission != null)
                newWeeklyMissions.add(mission);
        }
        missionRepository.saveAll(newWeeklyMissions);
    }
}
