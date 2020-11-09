package com.ersa.tracker.models;

import javax.persistence.*;
import java.util.Collection;
import java.util.Date;

@Entity
public class Workout {

    @GeneratedValue
    @Id
    private long id;
    private Date date;

    @ManyToOne
    private User user;

    @OneToMany
    private Collection<WorkoutSet> sets;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Collection<WorkoutSet> getSets() {
        return sets;
    }

    public void setSets(Collection<WorkoutSet> sets) {
        this.sets = sets;
    }
}
