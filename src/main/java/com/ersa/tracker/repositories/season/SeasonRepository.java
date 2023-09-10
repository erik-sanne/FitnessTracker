package com.ersa.tracker.repositories.season;


import com.ersa.tracker.models.season.Season;
import org.springframework.data.repository.CrudRepository;

public interface SeasonRepository extends CrudRepository<Season, Long> {
    Season findBySeasonNumber(int seasonNumber);
}
