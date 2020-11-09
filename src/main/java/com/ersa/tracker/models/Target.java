package com.ersa.tracker.models;

import javax.persistence.*;
import java.util.Set;

@Entity(name = "target")
public class Target {

    @Id
    private String name;

    @ManyToMany
    @JoinTable(name = "targets_wtypes")
    private Set<WType> wtype;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<WType> getWtypes() {
        return wtype;
    }

    public void setWtypes(Set<WType> groups) {
        this.wtype = groups;
    }

}
