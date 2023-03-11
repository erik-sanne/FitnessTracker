package com.ersa.tracker.services.general.missions;

import com.ersa.tracker.models.Mission;
import com.ersa.tracker.models.Workout;
import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.repositories.WorkoutRepository;
import com.ersa.tracker.utils.DateUtils;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@AllArgsConstructor
@Component
public class SameNoWorkoutsMission implements MissionTemplate {
    WorkoutRepository workoutRepository;

    @Override
    public String getIdentifier() {
        return "number_of_workouts";
    }

    @Override
    public String getName(Mission mission) {
        if (mission.getGoal() < 3)
            return "Hit the gym";

        return "Stick to the program";
    }

    @Override
    public String getDescription(Mission mission) {
        return String.format("Perform a total of %s workouts this week", mission.getGoal());
    }

    @Override
    public long getReward() {
        return 70;
    }

    @Override
    public int evaluateProgress(Mission mission) {
        List<Workout> workouts = workoutRepository.findAllByUser(mission.getUser());

        long thisWeek = mission.getWeek();
        List<Workout> workoutsThisWeek = workouts.stream().filter(workout -> DateUtils.getWeekForDate(workout.getDate()) == thisWeek).toList();
        return workoutsThisWeek.size();
    }

    @Override
    public Mission generateMission(User user) {
        List<Workout> workouts = workoutRepository.findAllByUser(user);

        int lastWeek = DateUtils.getCurrentWeek() - 1;
        List<Workout> workoutsLastWeek = workouts.stream().filter(workout -> DateUtils.getWeekForDate(workout.getDate()) == lastWeek).toList();
        int noOfWorkouts = Math.max(workoutsLastWeek.size(), 1);

        Mission mission = new Mission();
        mission.setUser(user);
        mission.setMissionId(getIdentifier());
        mission.setWeek(DateUtils.getCurrentWeek());
        mission.setGoal(noOfWorkouts);
        return mission;
    }
}
