package com.ersa.tracker.repositories.season;

import com.ersa.tracker.models.season.SeasonWeek;
import com.ersa.tracker.models.season.UserWeek;
import com.ersa.tracker.models.user.UserProfile;
import org.springframework.data.repository.CrudRepository;

public interface SeasonWeekRepository extends CrudRepository<SeasonWeek, Long> {
}
