package com.ersa.tracker.dto;

import java.util.Objects;

public final class Week {

    private int weekNumber;
    private int year;
    private int totalWorkouts;

    public Week(final int year, final int weekNumber, final int totalWorkouts) {
        this.year = year;
        this.weekNumber = weekNumber;
        this.totalWorkouts = totalWorkouts;
    }

    public int getWeekNumber() {
        return weekNumber;
    }

    public void setWeekNumber(final int weekNumber) {
        this.weekNumber = weekNumber;
    }

    public int getYear() {
        return year;
    }

    public void setYear(final int year) {
        this.year = year;
    }

    public int getTotalWorkouts() {
        return totalWorkouts;
    }

    public void setTotalWorkouts(final int totalWorkouts) {
        this.totalWorkouts = totalWorkouts;
    }

    @Override
    public boolean equals(final Object other) {
        if (other == null)
            return false;
        if (!(other instanceof Week))
            return false;
        Week o = (Week) other;
        return weekNumber == o.weekNumber && year == o.year;
    }

    @Override
    public int hashCode() {
        return Objects.hash(weekNumber, year, totalWorkouts);
    }
}
