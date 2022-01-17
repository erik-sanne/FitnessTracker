package com.ersa.tracker.services.general;

import com.ersa.tracker.models.Exercise;
import com.ersa.tracker.models.PersonalRecord;
import com.ersa.tracker.models.Workout;
import com.ersa.tracker.models.WorkoutSet;
import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.repositories.ExerciseRepository;
import com.ersa.tracker.repositories.PersonalRecordRepository;
import com.ersa.tracker.repositories.WorkoutRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Log4j2
@Service
public class PersonalRecordService implements PRService {

    private PersonalRecordRepository recordRepository;
    private ExerciseRepository exerciseRepository;
    private WorkoutRepository workoutRepository;

    @Autowired
    public PersonalRecordService(final PersonalRecordRepository personalRecordRepository,
                                  final ExerciseRepository exerciseRepository,
                                  final WorkoutRepository workoutRepository) {
        this.recordRepository = personalRecordRepository;
        this.exerciseRepository = exerciseRepository;
        this.workoutRepository = workoutRepository;
    }

    @Override
    public List<PersonalRecord> getRecords(final User user) {
        return recordRepository.findAllByUser(user);
    }

    @Override
    public List<PersonalRecord> getRecordsObfuscated(User user) {
        List<PersonalRecord> personalRecords = recordRepository.findAllByUser(user);
        float max = personalRecords.stream().map(PersonalRecord::getWeight).reduce(0f, Math::max);
        return personalRecords.stream().map( record -> {
            record.setWeight(record.getWeight() / max);
            return record;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void updatePersonalRecords(final User user) {
        log.info("Computing personal records");
        recordRepository.deleteAllByUser(user);

        List<PersonalRecord> records = new ArrayList<>();
        List<Workout> workouts = workoutRepository.findAllByUser(user);

        List<WorkoutSet> allSets = workouts.stream().flatMap(w -> w.getSets().stream())
                .collect(Collectors.toList());

        for (WorkoutSet set : allSets) {
            boolean exists = false;
            for (PersonalRecord record : records) {
                if (record.getExercise().getName().equals(set.getExercise())) {
                    exists = true;
                    if (set.getWeight() > record.getWeight()) {
                        record.setDate(set.getWorkout().getDate());
                        record.setWeight(set.getWeight());
                    }
                }
            }
            if (!exists) {
                PersonalRecord pr = new PersonalRecord();
                Exercise exercise = exerciseRepository.findByName(set.getExercise());
                pr.setExercise(exercise);
                pr.setWeight(set.getWeight());
                pr.setDate(set.getWorkout().getDate());
                pr.setUser(user);
                records.add(pr);
            }
        }

        recordRepository.saveAll(records);
    }
}
