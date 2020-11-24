package com.ersa.tracker.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

public final class WorkoutSummary {

    @JsonProperty("workout_id")
    private long workoutId;
    private Date date;
    private String description;

    public long getWorkoutId() {
        return workoutId;
    }

    public void setWorkoutId(final long workoutId) {
        this.workoutId = workoutId;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(final Date date) {
        this.date = date;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(final String description) {
        this.description = description;
    }


}
