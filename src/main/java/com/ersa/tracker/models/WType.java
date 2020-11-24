package com.ersa.tracker.models;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity(name = "wtype")
public final class WType {

    @Id
    private String name;

    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name;
    }
}
