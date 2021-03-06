package com.ersa.tracker.repositories;

import com.ersa.tracker.models.PersonalRecord;
import com.ersa.tracker.models.authentication.User;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface PersonalRecordRepository extends CrudRepository<PersonalRecord, Long> {
    List<PersonalRecord> findAllByUser(User user);
    void deleteAllByUser(User user);
}
