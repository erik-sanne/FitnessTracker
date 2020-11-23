package com.ersa.tracker.models;

import javax.persistence.*;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

@Entity(name = "workoutset")
public class WorkoutSet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    int weight;

    @Min(1)
    int reps;

    @ManyToOne
    @JoinColumn(name = "workout_id")
    private Workout workout;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getExercise() {
        return exercise;
    }

    public void setExercise(String exercise) {
        this.exercise = exercise;
    }

    public int getWeight() {
        return weight;
    }

    public void setWeight(int weight) {
        this.weight = weight;
    }

    public int getReps() {
        return reps;
    }

    public void setReps(int reps) {
        this.reps = reps;
    }

    public Workout getWorkout() {
        return workout;
    }

    public void setWorkout(Workout workout) {
        this.workout = workout;
    }
}
