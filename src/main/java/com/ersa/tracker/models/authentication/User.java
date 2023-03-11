package com.ersa.tracker.models.authentication;

import com.ersa.tracker.models.user.UserProfile;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import org.jetbrains.annotations.NotNull;


@Entity(name = "users")
public final class User {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private long id;

    @Email(regexp = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", message = "Not a valid email")
    @JsonIgnore
    private String email;

    @NotNull
    @JsonIgnore
    private String password;

    @JsonIgnore
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private UserProfile userProfile;

    @JsonIgnore
    private boolean verified = false;

    @NotNull
    @JsonIgnore
    private String permissionLevel = Permissions.BASIC;

    @OneToOne
    @JsonIgnore
    private UserToken token;

    public UserToken getToken() {
        return token;
    }

    public void setToken(final UserToken token) {
        this.token = token;
    }

    public String getPermissionLevel() {
        return permissionLevel;
    }

    public void setPermissionLevel(final String permissionLevel) {
        this.permissionLevel = permissionLevel;
    }

    public long getId() {
        return id;
    }

    public void setId(final long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(final String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(final String password) {
        this.password = password;
    }

    public UserProfile getUserProfile() {
        return userProfile;
    }

    public void setUserProfile(final UserProfile userProfile) {
        this.userProfile = userProfile;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(final boolean verified) {
        this.verified = verified;
    }

    public static final class Permissions {
        public static final String BASIC = "BASIC";
        public static final String MODERATOR = "MOD";
        public static final String ADMIN = "ADMIN";
    }
}


