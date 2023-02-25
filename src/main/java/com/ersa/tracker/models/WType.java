package com.ersa.tracker.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

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
