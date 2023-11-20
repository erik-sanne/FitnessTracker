package com.ersa.tracker.services.general;

import org.springframework.context.ApplicationEvent;

import java.time.Clock;

public class NewWorkoutEvent extends ApplicationEvent {

    public NewWorkoutEvent(Object source) {
        super(source);
    }

    public NewWorkoutEvent(Object source, Clock clock) {
        super(source, clock);
    }

}