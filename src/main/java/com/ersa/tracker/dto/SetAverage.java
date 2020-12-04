package com.ersa.tracker.dto;

import java.util.Date;

public class SetAverage {

    private Date date;
    private float reps;
    private float weight;

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public float getReps() {
        return reps;
    }

    public void setReps(float reps) {
        this.reps = reps;
    }

    public float getWeight() {
        return weight;
    }

    public void setWeight(float weight) {
        this.weight = weight;
    }

    public SetAverage(Date date, float reps, float weight){
        this.date = date;
        this.reps = reps;
        this.weight = weight;
    }
}
