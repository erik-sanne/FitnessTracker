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
public class ActiveOver5YearAchievement extends AchievementProviderBase {

    @Autowired
    WorkoutRepository workoutRepository;

    @Override
    public String getName() {
        return "Archaíos Gymnós Ándras";
    }

    @Override
    public String getDescription() {
        return "Only the ancient greeks can remember your days as a novice lifter. You where there when the first 'gymnasiums' were established. You where there when the olympics were founded. You were there... 5 years ago.";
    }

    @Override
    public String getType() {
        return Type.MISC.toString();
    }

    @Override
    public boolean evaluate(User user) {
        LocalDateTime dateTime = LocalDateTime.now();
        ZonedDateTime newDateTime = dateTime.minusYears(5).atZone(ZoneId.systemDefault());
        Date aYearAgo = Date.from(newDateTime.toInstant());


        List<Workout> workouts = workoutRepository.findAllByUser(user);
        return workouts.stream().anyMatch(w -> w.getDate().before(aYearAgo));
    }
}
