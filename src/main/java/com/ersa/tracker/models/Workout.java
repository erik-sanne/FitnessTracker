package com.ersa.tracker.models;

import com.ersa.tracker.models.authentication.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.format.annotation.DateTimeFormat;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.validation.constraints.NotNull;
import java.util.Collection;
import java.util.Date;

@Entity(name = "workouts")
public final class Workout {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @NotNull
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date date;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "workout", cascade = CascadeType.ALL)
    private Collection<WorkoutSet> sets;

    public long getId() {
        return id;
    }

    public void setId(final long id) {
        this.id = id;
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

    public Collection<WorkoutSet> getSets() {
        return sets;
    }

    public void setSets(final Collection<WorkoutSet> sets) {
        this.sets = sets;
    }
}
