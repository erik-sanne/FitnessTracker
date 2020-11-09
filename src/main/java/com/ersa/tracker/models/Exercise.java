package com.ersa.tracker.models;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import java.util.Set;

@Entity
public class Exercise {
    @Id
    private String name;

    @ManyToMany
    private Set<Target> primaryTargets;
    @ManyToMany
    private Set<Target> secondaryTargets;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Target> getPrimaryTargets() {
        return primaryTargets;
    }

    public void setPrimaryTargets(Set<Target> primaryTargets) {
        this.primaryTargets = primaryTargets;
    }

    public Set<Target> getSecondaryTargets() {
        return secondaryTargets;
    }

    public void setSecondaryTargets(Set<Target> secondaryTargets) {
        this.secondaryTargets = secondaryTargets;
    }
}
