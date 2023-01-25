package com.ersa.tracker.services.general.achivements;

import com.ersa.tracker.models.Workout;
import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.repositories.WorkoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;

@Service
public class ActiveOver1YearAchievement extends AchievementProviderBase {

    @Autowired
    WorkoutRepository workoutRepository;

    @Override
    public String getName() {
        return "Experienced Lifter";
    }

    @Override
    public String getDescription() {
        return "Has been using tracker for over a year";
    }

    @Override
    public String getType() {
        return Type.MISC.toString();
    }

    @Override
    public boolean evaluate(User user) {
        LocalDateTime dateTime = LocalDateTime.now();
        ZonedDateTime newDateTime = dateTime.minusYears(1).atZone(ZoneId.systemDefault());
        Date aYearAgo = Date.from(newDateTime.toInstant());


        List<Workout> workouts = workoutRepository.findAllByUser(user);
        return workouts.stream().anyMatch(w -> w.getDate().before(aYearAgo));
    }
}
