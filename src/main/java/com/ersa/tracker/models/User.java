package com.ersa.tracker.models;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Entity(name = "users")
public class User {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private long id;

    @Email(regexp = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")
    private String email;

    @NotNull
    @NotEmpty
    private String password;

    @NotNull
    private String permissionLevel = Permissions.BASIC;

    @OneToOne
    private UserToken token;

    public UserToken getToken() {
        return token;
    }

    public void setToken(UserToken token) {
        this.token = token;
    }

    public String getPermissionLevel() {
        return permissionLevel;
    }

    public void setPermissionLevel(String permissionLevel) {
        this.permissionLevel = permissionLevel;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public static class Permissions {
        public static final String BASIC = "ADMIN";
        public static final String ADMIN = "BASIC";
    }
}


