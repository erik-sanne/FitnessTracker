package com.ersa.tracker.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

@Entity(name = "workoutset")
public class WorkoutSet {
    @Id
    @GeneratedValue
    private long id;

    @NotNull
    @OneToOne
    private Exercise exercise;

    int weight;

    @Min(1)
    int reps;
}
