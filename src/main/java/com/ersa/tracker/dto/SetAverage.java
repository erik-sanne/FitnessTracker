package com.ersa.tracker.dto;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class SetAverage {

    private Date date;
    private float reps;
    private float weight;
    private float combined;
    private List<Set> sets = new ArrayList<>();

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

    public List<Set> getSets() {
        return sets;
    }

    public void setSets(List<Set> sets) {
        this.sets = sets;
    }

    public SetAverage(final Date date, final float reps, final float weight, final float combined, final List<Set> sets) {
        this.date = date;
        this.reps = reps;
        this.weight = weight;
        this.combined = combined;
        this.sets = sets;
    }

    public static class Set {
        private long id;
        private int reps;
        private float weight;

        public Set(long id, int reps, float weight) {
            this.id = id;
            this.reps = reps;
            this.weight = weight;
        }

        public long getId() {
            return id;
        }

        public void setId(long id) {
            this.id = id;
        }

        public int getReps() {
            return reps;
        }

        public void setReps(int reps) {
            this.reps = reps;
        }

        public float getWeight() {
            return weight;
        }

        public void setWeight(float weight) {
            this.weight = weight;
        }
    }
}
