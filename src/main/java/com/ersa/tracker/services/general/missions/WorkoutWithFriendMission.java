package com.ersa.tracker.services.general.missions;

import com.ersa.tracker.dto.Week;
import com.ersa.tracker.dto.WorkoutSummary;
import com.ersa.tracker.models.Mission;
import com.ersa.tracker.models.Workout;
import com.ersa.tracker.models.WorkoutSet;
import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.models.user.UserProfile;
import com.ersa.tracker.repositories.WorkoutRepository;
import com.ersa.tracker.repositories.authentication.UserRepository;
import com.ersa.tracker.services.general.APIService;
import com.ersa.tracker.services.user.ProfileService;
import com.ersa.tracker.services.user.UserProfileService;
import com.ersa.tracker.utils.DateUtils;
import com.ersa.tracker.utils.FormatUtils;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Component
public class WorkoutWithFriendMission implements MissionTemplate {
    WorkoutRepository workoutRepository;
    APIService apiService;
    ProfileService profileService;


    @Override
    public String getIdentifier() {
        return "workout_with_friend";
    }

    @Override
    public String getName(Mission mission) {
        String name = profileService.getProfile(mission.getAnyLong()).getDisplayName();
        return String.format("Work out with %s", name);
    }

    @Override
    public String getDescription(Mission mission) {
        String name = profileService.getProfile(mission.getAnyLong()).getDisplayName();
        return String.format("Any day this week, perform the same split day as %s", name);
    }

    @Override
    public long getReward() {
        return 50;
    }

    @Override
    public int evaluateProgress(Mission mission) {
        User friend = profileService.getFriend(mission.getUser(), mission.getAnyLong());

        List<WorkoutSummary> friendWorkouts = apiService.getWorkoutSummaries(friend).stream().filter(workout -> DateUtils.getWeekForDate(workout.getDate()) == mission.getWeek()).toList();
        List<WorkoutSummary> myWorkouts = apiService.getWorkoutSummaries(mission.getUser()).stream().filter(workout -> DateUtils.getWeekForDate(workout.getDate()) == mission.getWeek()).toList();

        return (int)myWorkouts.stream().filter(mine ->
                friendWorkouts.stream().anyMatch(friends ->
                        friends.getDate().equals(mine.getDate()) &&
                                friends.getDescription().equalsIgnoreCase(mine.getDescription())
                )).count();
    }

    @Override
    public Mission generateMission(User user) {
        List<UserProfile> friends = user.getUserProfile().getFriends();

        friends = friends.stream().filter(friend -> {
            int workouts = apiService.getWorkoutsPerWeek(friend.getUser()).subList(0,3).stream().mapToInt(Week::getTotalWorkouts).sum();
            return workouts > 3;
        }).collect(Collectors.toCollection(ArrayList::new));

        if (friends.isEmpty())
            return null;

        Collections.shuffle(friends);
        UserProfile friend = friends.get(0);

        Mission mission = new Mission();
        mission.setUser(user);
        mission.setMissionId(getIdentifier());
        mission.setWeek(DateUtils.getCurrentWeek());
        mission.setGoal(1);
        mission.setAnyLong(friend.getUser().getId());
        return mission;
    }
}
