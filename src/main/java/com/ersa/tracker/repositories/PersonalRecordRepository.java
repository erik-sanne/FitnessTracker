package com.ersa.tracker.repositories;

import com.ersa.tracker.models.PersonalRecord;
import org.springframework.data.repository.CrudRepository;

public interface PersonalRecordRepository extends CrudRepository<PersonalRecord, Long> {
}
