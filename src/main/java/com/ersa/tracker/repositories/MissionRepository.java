package com.ersa.tracker.repositories;

import com.ersa.tracker.models.Mission;
import com.ersa.tracker.models.authentication.User;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface MissionRepository extends CrudRepository<Mission, Long> {
    Mission findMissionByMissionId(String id);
    List<Mission> findByUser(User user);
}
