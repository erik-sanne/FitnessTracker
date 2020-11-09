package com.ersa.tracker.models;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity(name = "wtype")
public class WType {

    @Id
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
