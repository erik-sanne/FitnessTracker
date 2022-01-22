package com.ersa.tracker.dto;

import java.util.Date;
import java.util.Map;

public class StatsDto {
    private int workouts;
    private int sets;
    private Map<String, Integer> setTypes;
    private Date firstWorkout;

    public int getWorkouts() {
        return workouts;
    }

    public void setWorkouts(int workouts) {
        this.workouts = workouts;
    }

    public int getSets() {
        return sets;
    }

    public void setSets(int sets) {
        this.sets = sets;
    }

    public Map<String, Integer> getSetTypes() {
        return setTypes;
    }

    public void setSetTypes(Map<String, Integer> setTypes) {
        this.setTypes = setTypes;
    }

    public Date getFirstWorkout() {
        return firstWorkout;
    }

    public void setFirstWorkout(Date firstWorkout) {
        this.firstWorkout = firstWorkout;
    }
}
