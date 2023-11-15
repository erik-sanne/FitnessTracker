package com.ersa.tracker.services.general.season;

import com.ersa.tracker.dto.SeasonDto;
import com.ersa.tracker.models.season.Season;
import com.ersa.tracker.models.season.SeasonWeek;
import com.ersa.tracker.models.season.UserTotal;
import com.ersa.tracker.models.season.UserWeek;
import com.ersa.tracker.models.user.UserProfile;
import com.ersa.tracker.repositories.season.SeasonRepository;
import com.ersa.tracker.repositories.season.SeasonUserTotalRepository;
import com.ersa.tracker.repositories.season.SeasonUserWeekRepository;
import com.ersa.tracker.repositories.season.SeasonWeekRepository;
import com.ersa.tracker.utils.DateUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

@Service
@RequiredArgsConstructor
@Log4j2
public class SeasonManager implements SeasonService {
    private final SeasonRepository seasonRepository;
    private final SeasonUserTotalRepository userTotalRepository;
    private final SeasonUserWeekRepository userWeekRepository;
    private final SeasonWeekRepository weekRepository;

    @Override
    public SeasonDto getCurrentSeason(UserProfile profile) {
        Season season = getCurrentSeasonDB();
        if (season == null)
            return null;

        manageWeeks();

        SeasonDto seasonDto = new SeasonDto();

        List<UserTotal> totals = season.getUserTotals().stream()
                .sorted(Comparator.comparingLong(UserTotal::getScore))
                .collect(Collectors.toList());
        Collections.reverse(totals);

        // Leaderboard
        List<SeasonDto.LeaderBoardEntry> leaderboard = new ArrayList<>();
        for (int i = 0; i < Math.min(3, totals.size()); i++) {
            UserTotal total = totals.get(i);
            leaderboard.add(new SeasonDto.LeaderBoardEntry(
                    total.getUserProfile(),
                    (int)total.getScore(),
                    i + 1));
        }

        // My score
        UserTotal myTotal = totals.stream().filter(total -> total.getUserProfile().equals(profile)).findFirst().orElse(null);
        SeasonDto.LeaderBoardEntry myEntry;
        if (myTotal != null) {
            int position = totals.indexOf(myTotal);
            myEntry = new SeasonDto.LeaderBoardEntry(profile, (int)myTotal.getScore(), position + 1);
        } else {
            myEntry = new SeasonDto.LeaderBoardEntry(profile, 0, totals.size() + 1);
        }

        // History
        List<SeasonDto.WeekEntry> history = new ArrayList<>();
        List<SeasonWeek> weeks = season.getWeeks();
        for (int i = 0; i < weeks.size(); i++) {
            SeasonWeek week = weeks.get(i);
            UserWeek myWeek = userWeekRepository.findBySeasonWeekAndUserProfile(week, profile);
            int avgScore = week.getAverageScore();
            int bestScore = week.getBestScore();
            int myScore = myWeek == null ? 0 : (int)myWeek.getScore();

            if (week.getAverageScore() == 0 || week.getBestScore() == 0) {
                int sum = 0;
                for (UserWeek userWeek : week.getUserWeeks()) {
                    sum += userWeek.getScore();
                    if (userWeek.getScore() > bestScore) {
                        bestScore = (int)userWeek.getScore();
                    }
                }
                avgScore = sum == 0 ? 0 : sum / week.getUserWeeks().size();
            }

            SeasonDto.WeekEntry entry = new SeasonDto.WeekEntry(
                    week.getWeekNumber(),
                    avgScore,
                    bestScore,
                    myScore
            );
            history.add(entry);
        }

        seasonDto.setLeaderboard(leaderboard);
        seasonDto.setMyScore(myEntry);
        seasonDto.setHistory(history);
        return seasonDto;
    }

    @Override
    @Transactional
    public void addScore(UserProfile profile, long score) {
        Season season = getCurrentSeasonDB();
        if (season == null)
            return;

        SeasonWeek seasonWeek = getCurrentWeek(season);
        UserWeek myWeek = userWeekRepository.findBySeasonWeekAndUserProfile(seasonWeek, profile);
        if (myWeek == null) {
            myWeek = new UserWeek();
            myWeek.setSeasonWeek(seasonWeek);
            myWeek.setUserProfile(profile);
            myWeek.setScore(0);
        }

        myWeek.setScore(myWeek.getScore() + score);
        userWeekRepository.save(myWeek);

        UserTotal myTotal = userTotalRepository.findBySeasonAndUserProfile(season, profile);
        if (myTotal == null) {
            myTotal = new UserTotal();
            myTotal.setSeason(season);
            myTotal.setUserProfile(profile);
            myTotal.setScore(0);
        }
        myTotal.setScore(myTotal.getScore() + score);
        userTotalRepository.save(myTotal);
    }

    private SeasonWeek getCurrentWeek(Season season) {
        manageWeeks();
        return season.getWeeks().get(season.getWeeks().size()-1);
    }

    @Override
    @Transactional
    public void preComputeScores() {
        Season season = getCurrentSeasonDB();
        if (season == null)
            return;

        List<SeasonWeek> weeks = season.getWeeks();
        for (int i = 0; i < weeks.size(); i++) {
            SeasonWeek week = weeks.get(i);
            int avgScore = week.getAverageScore();
            int bestScore = week.getBestScore();

            boolean isCurrentWeek = week.getWeekNumber() == DateUtils.getCurrentWeek();

            if (!isCurrentWeek) {
                int sum = 0;
                for (UserWeek userWeek : week.getUserWeeks()) {
                    sum += userWeek.getScore();
                    if (userWeek.getScore() > bestScore) {
                        bestScore = (int)userWeek.getScore();
                    }
                }
                avgScore = sum == 0 ? 0 : sum / week.getUserWeeks().size();
            }
            week.setAverageScore(avgScore);
            week.setBestScore(bestScore);
            weekRepository.save(week);
            log.info("Updated scores for season {} week {}", week.getSeason().getId(), week.getWeekNumber());
        }
    }


    @Transactional
    public void manageWeeks() {
        Season season = getCurrentSeasonDB();
        if (season == null)
            return;

        int currentWeek = DateUtils.getCurrentWeek();

        if (season.getWeeks().isEmpty()) {
            createWeek(season);
        } else {
            int lastIndex = season.getWeeks().size() - 1;
            SeasonWeek lastSavedWeek = season.getWeeks().get(lastIndex);

            if (lastSavedWeek.getWeekNumber() != currentWeek) {
                createWeek(season);
            }
        }
    }

    private void createWeek(Season season) {
        SeasonWeek week = new SeasonWeek();
        week.setSeason(season);
        week.setUserWeeks(new ArrayList<>());
        week.setWeekNumber(DateUtils.getCurrentWeek());
        week = weekRepository.save(week);

        List<SeasonWeek> weeks = season.getWeeks();
        weeks.add(week);
        season.setWeeks(weeks);
        seasonRepository.save(season);
        log.info("Created week {} for season {}", week.getWeekNumber(), week.getSeason().getId());
    }

    private Season getCurrentSeasonDB() {
        Date now = new Date();
        Stream<Season> seasons = StreamSupport.stream(seasonRepository.findAll().spliterator(), false);
        Optional<Season> current = seasons.filter(season ->
                now.after(season.getStartDate()) &&
                now.before(season.getEndDate()))
                .findFirst();
        return current.orElse(null);
    }
}
