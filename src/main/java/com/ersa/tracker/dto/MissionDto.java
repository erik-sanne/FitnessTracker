package com.ersa.tracker.dto;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class MissionDto {
    private String name;
    private String description;
    private long reward;
    private long progress;
    private long goal;
    private boolean completed;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public long getReward() {
        return reward;
    }

    public void setReward(long reward) {
        this.reward = reward;
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

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
}
