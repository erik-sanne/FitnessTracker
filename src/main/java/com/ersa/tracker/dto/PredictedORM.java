package com.ersa.tracker.dto;

public class PredictedORM {

    private String exercise;
    private float weight;

    public float getWeight() {
        return weight;
    }

    public void setWeight(final float weight) {
        this.weight = weight;
    }

    public String getExercise() {
        return exercise;
    }

    public void setExercise(final String exercise) {
        this.exercise = exercise;
    }

    public PredictedORM(final String exercise, final float weight) {
        this.exercise = exercise;
        this.weight = weight;
    }
}
