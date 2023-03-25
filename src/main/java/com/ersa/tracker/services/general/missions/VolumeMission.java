package com.ersa.tracker.services.general.missions;

import com.ersa.tracker.models.Mission;
import com.ersa.tracker.models.Workout;
import com.ersa.tracker.models.WorkoutSet;
import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.repositories.WorkoutRepository;
import com.ersa.tracker.utils.DateUtils;
import com.ersa.tracker.utils.FormatUtils;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Stream;

@AllArgsConstructor
@Component
public class VolumeMission implements MissionTemplate {
    WorkoutRepository workoutRepository;

    @Override
    public String getIdentifier() {
        return "total_volume";
    }

    @Override
    public String getName(Mission mission) {
        return String.format("Grind out %s", FormatUtils.exerciseName(mission.getAnyString()));
    }

    @Override
    public String getDescription(Mission mission) {
        return String.format("Perform a total volume of %skg on %s", mission.getGoal(), FormatUtils.exerciseName(mission.getAnyString()));
    }

    @Override
    public long getReward() {
        return 180;
    }

    @Override
    public int evaluateProgress(Mission mission) {
        String exercise = mission.getAnyString();
        List<Workout> workouts = workoutRepository.findAllByUser(mission.getUser());
        workouts = workouts.stream().filter(workout -> DateUtils.getWeekForDate(workout.getDate()) == DateUtils.getCurrentWeek()).toList();
        Stream<WorkoutSet> setsWithExercise = workouts.stream().flatMap(workout -> workout.getSets().stream())
                .filter(set -> set.getExercise().equalsIgnoreCase(exercise));

        return (int)setsWithExercise.mapToDouble(set -> set.getWeight() * set.getReps()).sum();
    }

    @Override
    public Mission generateMission(User user) {
        List<Workout> workouts = workoutRepository.findAllByUser(user);
        if (workouts.size() < 1) {
            return null;
        }
        List<Workout> lastWorkouts = workouts.subList(workouts.size() - Math.min(workouts.size(), 4), workouts.size() - 1);
        Collections.shuffle(lastWorkouts);
        if (workouts.size() <= 0)
            return null;

        Workout workout = lastWorkouts.get(0);

        List<WorkoutSet> sets = new ArrayList<>(workout.getSets().stream().toList());
        Collections.shuffle(sets);
        if (sets.size() <= 0 ) {
            return null;
        }
        String exercise = sets.get(0).getExercise();

        double summedWeight = sets.stream().filter(set -> set.getExercise().equalsIgnoreCase(exercise))
                .mapToDouble(set -> set.getWeight() * set.getReps()).sum();
        summedWeight = summedWeight * 1.2;

        Mission mission = new Mission();
        mission.setUser(user);
        mission.setMissionId(getIdentifier());
        mission.setWeek(DateUtils.getCurrentWeek());
        mission.setGoal((int)summedWeight);
        mission.setAnyString(exercise);
        return mission;
    }
}
