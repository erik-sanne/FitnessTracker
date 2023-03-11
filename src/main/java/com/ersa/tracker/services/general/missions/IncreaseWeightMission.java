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

@AllArgsConstructor
@Component
public class IncreaseWeightMission implements MissionTemplate {
    WorkoutRepository workoutRepository;

    @Override
    public String getIdentifier() {
        return "increase_weight";
    }

    @Override
    public String getName(Mission mission) {
        return String.format("Max out %s", FormatUtils.exerciseName(mission.getAnyString()));
    }

    @Override
    public String getDescription(Mission mission) {
        if (mission.getAnyDecimal() == 0)
            return String.format("Perform a set of %s", FormatUtils.exerciseName(mission.getAnyString()));
        return String.format("Perform a set of %s on at least %s kg", FormatUtils.exerciseName(mission.getAnyString()), mission.getAnyDecimal());
    }

    @Override
    public long getReward() {
        return 120;
    }

    @Override
    public int evaluateProgress(Mission mission) {
        String exercise = mission.getAnyString();
        List<Workout> workouts = workoutRepository.findAllByUser(mission.getUser());
        workouts = workouts.stream().filter(workout -> DateUtils.getWeekForDate(workout.getDate()) == DateUtils.getCurrentWeek()).toList();
        List<WorkoutSet> setsWithExercise = workouts.stream().flatMap(workout -> workout.getSets().stream()).filter(set -> set.getExercise() == exercise).toList();

        return setsWithExercise.stream().filter(set -> set.getWeight() >= mission.getAnyDecimal()).toList().size();
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
        if (sets.size() <= 0)
            return null;

        String exercise = sets.get(0).getExercise();

        WorkoutSet heaviestSet = sets.stream().filter(set -> set.getExercise().equalsIgnoreCase(exercise)).
                reduce((best, set) -> {
                    if (set.getWeight() > best.getWeight()) {
                        return set;
                    } else
                        return best;
                }).get();

        Mission mission = new Mission();
        mission.setUser(user);
        mission.setMissionId(getIdentifier());
        mission.setWeek(DateUtils.getCurrentWeek());
        mission.setGoal(1);
        mission.setAnyString(exercise);
        mission.setAnyDecimal(heaviestSet.getWeight());
        return mission;
    }
}
