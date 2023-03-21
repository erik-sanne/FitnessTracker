package com.ersa.tracker.models;

import com.ersa.tracker.models.authentication.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public final class Mission {
    @Id
    @GeneratedValue
    @JsonIgnore
    private long id;
    private String missionId;

    private long week;
    @ManyToOne
    private User user;

    private long progress;
    private long goal;

    //uniques
    private String anyString;
    private float anyDecimal;
    private int anyNumber;
    private long anyLong;


    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getMissionId() {
        return missionId;
    }

    public void setMissionId(String name) {
        this.missionId = name;
    }

    public long getWeek() {
        return week;
    }

    public void setWeek(long week) {
        this.week = week;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public long getProgress() {
        return progress;
    }

    public void setProgress(long progess) {
        this.progress = progess;
    }

    public long getGoal() {
        return goal;
    }

    public void setGoal(long goal) {
        this.goal = goal;
    }

    public String getAnyString() {
        return anyString;
    }

    public void setAnyString(String exercise) {
        this.anyString = exercise;
    }

    public float getAnyDecimal() {
        return anyDecimal;
    }

    public void setAnyDecimal(float weight) {
        this.anyDecimal = weight;
    }

    public int getAnyNumber() {
        return anyNumber;
    }

    public void setAnyNumber(int anyNumber) {
        this.anyNumber = anyNumber;
    }

    public long getAnyLong() {
        return anyLong;
    }

    public void setAnyLong(long anyLong) {
        this.anyLong = anyLong;
    }

}
