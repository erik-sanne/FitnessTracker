package com.ersa.tracker.models;

public class Pong {

    private String message;
    private int value;

    public Pong(String msg, int val) {
        this.message = msg;
        this.value = val;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }
}
