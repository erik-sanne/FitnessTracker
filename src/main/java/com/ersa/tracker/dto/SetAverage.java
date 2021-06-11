package com.ersa.tracker.dto;

import java.util.Date;

public class SetAverage {

    private Date date;
    private float reps;
    private float weight;
    private float combined;

    public Date getDate() {
        return date;
    }

    public void setDate(final Date date) {
        this.date = date;
    }

    public float getReps() {
        return reps;
    }

    public void setReps(final float reps) {
        this.reps = reps;
    }

    public float getWeight() {
        return weight;
    }

    public void setWeight(final float weight) {
        this.weight = weight;
    }

    public float getCombined() {
        return combined;
    }

    public void setCombined(float combined) {
        this.combined = combined;
    }

    public SetAverage(final Date date, final float reps, final float weight, final float combined) {
        this.date = date;
        this.reps = reps;
        this.weight = weight;
        this.combined = combined;
    }
}
