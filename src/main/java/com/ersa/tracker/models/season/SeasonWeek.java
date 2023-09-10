package com.ersa.tracker.models.season;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
public class SeasonWeek {
    @Id
    @GeneratedValue
    @JsonIgnore
    long id;

    @ManyToOne
    Season season;

    int weekNumber;

    @OneToMany(mappedBy = "seasonWeek")
    List<UserWeek> userWeeks;

    int averageScore = 0;
    int bestScore = 0;
}
