package com.ersa.tracker.models;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import java.util.Set;

@Entity(name = "target")
public final class Target {

    @Id
    private String name;

    @ManyToMany
    @JoinTable(name = "targets_wtypes")
    private Set<WType> wtype;

    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name;
    }

    public Set<WType> getWtypes() {
        return wtype;
    }

    public void setWtypes(final Set<WType> groups) {
        this.wtype = groups;
    }

}
