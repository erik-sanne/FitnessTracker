package com.ersa.tracker.models;

import com.ersa.tracker.models.authentication.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Collection;
import java.util.Date;

@Entity(name = "workouts")
public class Workout {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @NotNull
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date date;

    @OneToMany(fetch=FetchType.LAZY, mappedBy = "workout", cascade=CascadeType.PERSIST)
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
