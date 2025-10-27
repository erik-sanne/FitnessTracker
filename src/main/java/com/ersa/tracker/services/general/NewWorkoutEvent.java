package com.ersa.tracker.services.general;

import org.springframework.context.ApplicationEvent;

import java.time.Clock;

public class NewWorkoutEvent extends ApplicationEvent {

    private Long userId;

    public NewWorkoutEvent(Object source, Long userId) {
        super(source);
        this.userId = userId;
    }

    public NewWorkoutEvent(Object source, Clock clock) {
        super(source, clock);
    }

    public Long getUserId() {
        return userId;
    }
}