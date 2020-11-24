package com.ersa.tracker.models.authentication;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.util.Date;

@Entity
public final class UserToken {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private int id;
    private String token;
    private Date expires;

    public int getId() {
        return id;
    }

    public void setId(final int id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(final String token) {
        this.token = token;
    }

    public Date getExpiration() {
        return expires;
    }

    public void setExpiration(final Date date) {
        this.expires = date;
    }
}
