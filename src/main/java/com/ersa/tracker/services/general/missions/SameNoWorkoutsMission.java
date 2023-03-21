package com.ersa.tracker.services.general.missions;

import com.ersa.tracker.dto.Week;
import com.ersa.tracker.dto.WorkoutSummary;
import com.ersa.tracker.models.Mission;
import com.ersa.tracker.models.Workout;
import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.repositories.WorkoutRepository;
import com.ersa.tracker.services.general.APIFunctions;
import com.ersa.tracker.services.general.APIService;
import com.ersa.tracker.utils.DateUtils;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Iterator;
import java.util.List;
import java.util.stream.Stream;

@AllArgsConstructor
@Component
public class SameNoWorkoutsMission implements MissionTemplate {
    WorkoutRepository workoutRepository;
    APIService apiService;

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

    final static int WEEKS_TO_AVG = 3;

    @Override
    public Mission generateMission(User user) {
        Iterator<Week> weeks = apiService.getWorkoutsPerWeek(user).iterator();
        float sum = 0;
        for (int i = 0; i < WEEKS_TO_AVG; i++) {
            Week week = weeks.next();
            sum += week.getTotalWorkouts();
        }
        int noOfWorkouts = Math.max(Math.round(sum / WEEKS_TO_AVG), 1);

        Mission mission = new Mission();
        mission.setUser(user);
        mission.setMissionId(getIdentifier());
        mission.setWeek(DateUtils.getCurrentWeek());
        mission.setGoal(noOfWorkouts);
        return mission;
    }
}
