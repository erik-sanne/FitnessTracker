package com.ersa.tracker.repositories.season;


import com.ersa.tracker.models.season.Season;
import com.ersa.tracker.models.season.UserTotal;
import com.ersa.tracker.models.user.UserProfile;
import org.springframework.data.repository.CrudRepository;

public interface SeasonUserTotalRepository extends CrudRepository<UserTotal, Long> {
    UserTotal findBySeasonAndUserProfile(Season season, UserProfile profile);
}
