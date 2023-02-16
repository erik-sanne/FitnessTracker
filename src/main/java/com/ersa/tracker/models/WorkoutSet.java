package com.ersa.tracker.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.Min;

@Entity(name = "workoutset")
public final class WorkoutSet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonIgnore
    private long id;

    /*
        Originally @OneToOne with Exercise
        However this caused issues when submitting new workouts,
        as it tried to create new (?) Exercises instead of
        referencing to the database. Too many hours has now been
        spent on this, so I have decided to change it to a plain
        String for now. :-(
     */
    @Column(name = "exercise_name")
    private String exercise;

    private float weight;

    @Min(1)
    private int reps;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "workout_id")
    private Workout workout;

    public long getId() {
        return id;
    }

    public void setId(final long id) {
        this.id = id;
    }

    public String getExercise() {
        return exercise;
    }

    public void setExercise(final String exercise) {
        this.exercise = exercise;
    }

    public float getWeight() {
        return weight;
    }

    public void setWeight(final float weight) {
        this.weight = weight;
    }

    public int getReps() {
        return reps;
    }

    public void setReps(final int reps) {
        this.reps = reps;
    }

    public Workout getWorkout() {
        return workout;
    }

    public void setWorkout(final Workout workout) {
        this.workout = workout;
    }
}
