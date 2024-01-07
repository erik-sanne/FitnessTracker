package com.ersa.tracker.services.general.achivements;

import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.models.season.Season;
import com.ersa.tracker.repositories.AchievementRepository;
import com.ersa.tracker.repositories.season.SeasonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class SeasonOneAchievement extends AchievementProviderBase {
    private final SeasonRepository seasonRepository;

    @Override
    public String getName() {
        return "Season One Champion";
    }

    @Override
    public String getDescription() {
        return "Awarded for being ranked at the top of the leaderboard for season one";
    }

    @Override
    public String getType() {
        return Type.SEASONS_AND_EVENTS.toString();
    }

    @Override
    public boolean evaluate(User user) {
        Season seasonOne = seasonRepository.findBySeasonNumber(1);
        if (seasonOne == null)
            return false;
        return user.getUserProfile().equals(seasonOne.getWinner());
    }
}
