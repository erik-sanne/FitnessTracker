package com.ersa.tracker.services.general;

import com.ersa.tracker.models.PersonalRecord;
import com.ersa.tracker.models.authentication.User;
import org.springframework.scheduling.annotation.Async;

import javax.transaction.Transactional;
import java.util.List;

public interface PRService {
    List<PersonalRecord> getRecords(User user);
    List<PersonalRecord> getRecordsObfuscated(User user);

    @Transactional
    @Async
    void updatePersonalRecords(User user);
}
