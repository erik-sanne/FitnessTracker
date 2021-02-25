package com.ersa.tracker.services.implementations;

import com.ersa.tracker.models.Exercise;
import com.ersa.tracker.models.PersonalRecord;
import com.ersa.tracker.models.Workout;
import com.ersa.tracker.models.WorkoutSet;
import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.models.user.UserProfile;
import com.ersa.tracker.repositories.ExerciseRepository;
import com.ersa.tracker.repositories.PersonalRecordRepository;
import com.ersa.tracker.repositories.UserProfileRepository;
import com.ersa.tracker.repositories.WorkoutRepository;
import com.ersa.tracker.services.PRService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Log4j2
@Service
public final class PersonalRecordService implements PRService {

    private UserProfileRepository profileRepository;
    private PersonalRecordRepository recordRepository;
    private ExerciseRepository exerciseRepository;
    private WorkoutRepository workoutRepository;

    @Autowired
    private PersonalRecordService(final UserProfileRepository userProfileRepository,
                                  final PersonalRecordRepository personalRecordRepository,
                                  final ExerciseRepository exerciseRepository,
                                  final WorkoutRepository workoutRepository) {
        this.profileRepository = userProfileRepository;
        this.recordRepository = personalRecordRepository;
        this.exerciseRepository = exerciseRepository;
        this.workoutRepository = workoutRepository;
    }

    @Override
    public List<PersonalRecord> getRecords(final User user) {
        return null;
    }

    public void updatePersonalRecords(final UserProfile profile, final Workout workout) {
        //if (profile.getPersonalRecords() == null || profile.getPersonalRecords().isEmpty()) {
        //log.info("Personal Records not set, initializing...");
        log.info("Computing personal records");
        initPersonalRecord(profile);
        //return;
        //}

        // updateRecords(profile, workout);
    }

    private void updateRecords(final UserProfile profile, final Workout workout) {
        List<PersonalRecord> prs = profile.getPersonalRecords();
        for (WorkoutSet set : workout.getSets()) {
            PersonalRecord record = getRecord(prs, set.getExercise());
            if (record == null) {
                log.info("PR record created for {}", set.getExercise());
                record = createNew(set.getExercise());
                prs.add(record);
            }
            if (set.getWeight() > record.getWeight()) {
                prs.remove(record);
                PersonalRecord persistedRecord = updateRecord(record, set.getWeight(), workout.getDate());
                prs.add(persistedRecord);
            }
        }
        profile.setPersonalRecords(prs);
        profileRepository.save(profile);
    }

    private void initPersonalRecord(final UserProfile profile) {
        profile.setPersonalRecords(new ArrayList<>());
        profileRepository.save(profile);

        List<Workout> previousWorkouts = workoutRepository.findAllByUser(profile.getUser());
        for (Workout wout : previousWorkouts) {
            updateRecords(profile, wout);
        }
    }

    private PersonalRecord getRecord(final List<PersonalRecord> records, final String exercise) {
        for (PersonalRecord record : records) {
            if (record.getExercise().getName().equals(exercise))
                return record;
        }
        return null;
    }

    private PersonalRecord createNew(final String exerciseName) {
        Exercise exercise = exerciseRepository.findByName(exerciseName);

        PersonalRecord record = new PersonalRecord();
        record.setDate(new Date());
        record.setExercise(exercise);
        record.setWeight(0f);
        return record;
    }

    private PersonalRecord updateRecord(final PersonalRecord record, final Float newWeight, final Date newDate) {
        record.setWeight(newWeight);
        record.setDate(newDate);
        log.info("PR updated for {}", record.getExercise().getName());
        return recordRepository.save(record);
    }
}
