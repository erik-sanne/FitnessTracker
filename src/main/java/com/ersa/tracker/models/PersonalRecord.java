package com.ersa.tracker.models;

import com.ersa.tracker.models.authentication.User;
import jakarta.persistence.*;

import java.util.Date;

@Entity
public final class PersonalRecord {

    @Id
    @GeneratedValue
    private long id;

    @ManyToOne(fetch = FetchType.EAGER)
    private Exercise exercise;
    private Float weight;
    private Date date;

    @ManyToOne
    private User user;

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
