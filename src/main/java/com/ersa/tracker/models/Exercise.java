package com.ersa.tracker.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import java.util.Set;

@Entity
public final class Exercise {
    @Id
    private String name;

    @ManyToMany
    private Set<Target> primaryTargets;
    @ManyToMany
    private Set<Target> secondaryTargets;

    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name;
    }

    public Set<Target> getPrimaryTargets() {
        return primaryTargets;
    }

    public void setPrimaryTargets(final Set<Target> primaryTargets) {
        this.primaryTargets = primaryTargets;
    }

    public Set<Target> getSecondaryTargets() {
        return secondaryTargets;
    }

    public void setSecondaryTargets(final Set<Target> secondaryTargets) {
        this.secondaryTargets = secondaryTargets;
    }
}
