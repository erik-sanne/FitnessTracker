package com.ersa.tracker.services.general;

import com.ersa.tracker.models.PersonalRecord;
import com.ersa.tracker.models.WorkoutSet;
import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.repositories.ExerciseRepository;
import com.ersa.tracker.repositories.PersonalRecordRepository;
import com.ersa.tracker.repositories.WorkoutRepository;
import com.ersa.tracker.services.user.PostService;
import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Log4j2
@Service
public class PersonalRecordService implements PRService {

    private PersonalRecordRepository recordRepository;
    private ExerciseRepository exerciseRepository;
    private WorkoutRepository workoutRepository;
    private PostService postService;

    @Autowired
    public PersonalRecordService(final PersonalRecordRepository personalRecordRepository,
                                 final ExerciseRepository exerciseRepository,
                                 final WorkoutRepository workoutRepository,
                                 final PostService postService) {
        this.recordRepository = personalRecordRepository;
        this.exerciseRepository = exerciseRepository;
        this.workoutRepository = workoutRepository;
        this.postService = postService;
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
    @Async
    public void updatePersonalRecords(final User user) {
        log.info("Computing personal records");
        List<PersonalRecord> previousRecords = recordRepository.findAllByUser(user);

        Stream<WorkoutSet> sets = workoutRepository.findAllByUser(user).stream().flatMap(w -> w.getSets().stream());

        Map<String, PersonalRecord> records = new HashMap<>();

        sets.forEach(set -> {
            String key = set.getExercise();
            if (!records.containsKey(key)) {
                PersonalRecord pr = new PersonalRecord();
                pr.setUser(user);
                pr.setWeight(set.getWeight());
                pr.setExercise(exerciseRepository.findByName(key));
                pr.setDate(set.getWorkout().getDate());

                records.put(key, pr);
                return;
            }

            if (set.getWeight() > records.get(key).getWeight()) {
                records.get(key).setWeight(set.getWeight());
                records.get(key).setDate(set.getWorkout().getDate());
            }
        });

        records.values().forEach(pr -> {
            if (previousRecords.stream().anyMatch(oldPr ->
                pr.getUser() == oldPr.getUser() &&
                        pr.getExercise().getName().equalsIgnoreCase(oldPr.getExercise().getName()) &&
                        pr.getWeight() > oldPr.getWeight() &&
                        pr.getDate() != oldPr.getDate()
            )) {
                postService.createPost(user,
                        pr.getDate(),
                        "New Personal Record",
                        String.format("%s performed a new personal best in %s",
                                PostService.DISPLAY_NAME,
                                pr.getExercise().getName().replace("_", " ")));
            }
        });

        recordRepository.deleteAllByUser(user);
        recordRepository.saveAll(records.values());
    }
}
