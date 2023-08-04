package com.ersa.tracker.repositories;

import com.ersa.tracker.models.PersistedLogEvent;
import org.springframework.data.repository.CrudRepository;

public interface PersistantLogRepository extends CrudRepository<PersistedLogEvent, Long> {}
