package com.ersa.tracker.models.season;

import com.ersa.tracker.models.user.UserProfile;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
public class Season {
    @Id
    @GeneratedValue
    @JsonIgnore
    long id;

    int seasonNumber;

    Date startDate;
    Date endDate;

    @OneToMany(mappedBy = "season")
    List<SeasonWeek> weeks = new ArrayList<>();

    @OneToMany(mappedBy = "season")
    List<UserTotal> userTotals = new ArrayList<>();

    @OneToOne
    UserProfile winner = null;
}
