package com.ersa.tracker.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.util.Date;

@Entity
public class UserToken {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private int id;
    private String token;
    private Date expires;

    public int getId() {
        return id;
    }

    public void setId(int ID) {
        this.id = ID;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Date getExpiration() {
        return expires;
    }

    public void setExpiration(Date date) {
        this.expires = date;
    }
}
