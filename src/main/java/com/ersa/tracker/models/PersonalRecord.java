package com.ersa.tracker.models;

import com.ersa.tracker.models.authentication.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;
import java.util.Date;

@Entity
public final class PersonalRecord {

    @Id
    @GeneratedValue
    @JsonIgnore
    private long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonIgnore
    private Exercise exercise;
    private Float weight;
    private Date date;

    @JsonIgnore
    @ManyToOne
    private User user;

    @Transient
    @JsonProperty(value = "exercise")
    private String exercise() {
        return exercise.getName();
    }

    public Exercise getExercise() {
        return exercise;
    }

    public void setExercise(final Exercise exercise) {
        this.exercise = exercise;
    }

    public Float getWeight() {
        return weight;
    }

    public void setWeight(final Float weight) {
        this.weight = weight;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(final Date date) {
        this.date = date;
    }

    public User getUser() {
        return user;
    }

    public void setUser(final User user) {
        this.user = user;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || this.getClass() != o.getClass()){
            return false;
        }

        PersonalRecord other = (PersonalRecord)o;
        return this.getWeight().equals(other.getWeight()) && this.getExercise().equals(other.getExercise()) && this.getUser() == other.getUser();
    }
}
