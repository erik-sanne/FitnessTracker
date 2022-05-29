package com.ersa.tracker.repositories;

import com.ersa.tracker.models.user.Notice;
import org.springframework.data.repository.CrudRepository;

public interface NoticeRepository extends CrudRepository<Notice, Long> {
}
