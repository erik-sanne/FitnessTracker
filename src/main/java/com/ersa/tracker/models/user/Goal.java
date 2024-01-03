package com.ersa.tracker.models.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

/**
 * Could extend to more types of goals, i.e weight goal for exercise etc. For now only fixed set of workouts.
 */

@Entity
@Getter
@Setter
public class Goal {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @ManyToOne
    @JsonIgnore
    private UserProfile userProfile;

    private String name;

    @NotNull
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date startDate;

    @NotNull
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date endDate;

    @NotNull
    private float target;

    @NotNull
    private final Type type = Type.WORKOUTS;

    boolean complete = false;

    enum Type {
        WORKOUTS,
    }
}
