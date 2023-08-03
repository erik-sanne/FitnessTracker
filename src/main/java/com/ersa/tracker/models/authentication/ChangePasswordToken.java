package com.ersa.tracker.models.authentication;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Entity
public class ChangePasswordToken {
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Id
    private long id;

    @OneToOne(targetEntity = User.class)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    private String token;

    @NotNull
    private Date expiryDate;
}
