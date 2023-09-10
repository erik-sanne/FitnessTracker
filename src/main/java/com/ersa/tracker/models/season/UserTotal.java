package com.ersa.tracker.models.season;

import com.ersa.tracker.models.user.UserProfile;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class UserTotal {
    @Id
    @GeneratedValue
    @JsonIgnore
    long id;

    @OneToOne
    UserProfile userProfile;

    @ManyToOne
    Season season;

    long score;
}
