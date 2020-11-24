package com.ersa.tracker.models.authentication;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;


@Entity(name = "users")
public final class User {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private long id;

    @Email(regexp = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", message = "Not a valid email")
    private String email;

    @NotNull
    private String password;

    private boolean verified = false;

    @NotNull
    private String permissionLevel = Permissions.BASIC;

    @OneToOne
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

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(final boolean verified) {
        this.verified = verified;
    }

    public static final class Permissions {
        public static final String BASIC = "BASIC";
        public static final String ADMIN = "ADMIN";
    }
}


