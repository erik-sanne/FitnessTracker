package com.ersa.tracker.dto;

import java.util.Date;

public class Achievement {
    private String name;
    private String description;
    private String type;
    private Date date;

    public Achievement(String name, String description, String type, Date date) {
        this.name = name;
        this.description = description;
        this.type = type;
        this.date = date;
    }

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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}
