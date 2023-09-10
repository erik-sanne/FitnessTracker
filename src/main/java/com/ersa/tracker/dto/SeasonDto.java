package com.ersa.tracker.dto;

import com.ersa.tracker.models.user.UserProfile;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SeasonDto {

    private List<LeaderBoardEntry> leaderboard;
    private LeaderBoardEntry myScore;
    private List<WeekEntry> history;


    @RequiredArgsConstructor
    @Getter
    @Setter
    public static class WeekEntry {
        final private int weekNumber;
        final private int avgScore;
        final private int bestScore;
        final private int myScore;
    }

    @RequiredArgsConstructor
    @Getter
    @Setter
    public static class LeaderBoardEntry {
        final private UserProfile user;
        final private int totalScore;
        final private int position;
    }
}
