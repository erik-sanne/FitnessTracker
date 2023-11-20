package com.ersa.tracker.services.general;

import com.ersa.tracker.repositories.TargetRepository;
import com.ersa.tracker.repositories.WTypeRepository;
import com.ersa.tracker.repositories.authentication.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WorkoutServiceConfiguration {

    @Bean
    public APIService apiService(WorkoutService workoutService, ExerciseService exerciseService, TargetRepository targetRepository, WTypeRepository wTypeRepository, UserRepository userRepository) {
        return new CachedWorkoutStatsService(new WorkoutStatsService(workoutService, exerciseService, targetRepository, wTypeRepository), userRepository);
    }
}
