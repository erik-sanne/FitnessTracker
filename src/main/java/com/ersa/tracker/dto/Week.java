package com.ersa.tracker.dto;

public class Week {

    private int weekNumber;
    private int year;
    private int totalWorkouts;

    public Week(int year, int weekNumber, int totalWorkouts) {
        this.year = year;
        this.weekNumber = weekNumber;
        this.totalWorkouts = totalWorkouts;
    }

    public int getWeekNumber() {
        return weekNumber;
    }

    public void setWeekNumber(int weekNumber) {
        this.weekNumber = weekNumber;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public int getTotalWorkouts() {
        return totalWorkouts;
    }

    public void setTotalWorkouts(int totalWorkouts) {
        this.totalWorkouts = totalWorkouts;
    }

    @Override
    public boolean equals(Object other) {
        if (other == null)
            return false;
        if (!(other instanceof Week))
            return false;
        Week o = (Week)other;
        return weekNumber == o.weekNumber && year == o.year;
    }
}
