package com.ersa.tracker.security;

import com.ersa.tracker.models.authentication.User;
import org.springframework.context.ApplicationEvent;

public final class SendEmailEvent extends ApplicationEvent {
    private EventType eventType;

    private String email;
    private User user;
    private String url;

    public SendEmailEvent(final EventType eventType, final User user, final String email, final String url) {
        super(eventType);
        this.user = user;
        this.url = url;
        this.email = email;
        this.eventType = eventType;
    }

    public EventType getEventType() {
        return eventType;
    }

    public void setEventType(EventType eventType) {
        this.eventType = eventType;
    }

    public User getUser() {
        return user;
    }

    public void setUser(final User user) {
        this.user = user;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(final String url) {
        this.url = url;
    }

    public enum EventType {
        RegistrationComplete, RequestEmailChange, ForgotPassword;


        @Override
        public String toString() {
            return switch (this) {
                case RegistrationComplete -> "EventType[Registration Complete]";
                case RequestEmailChange -> "EventType[Email Change]";
                case ForgotPassword -> "EventType[Forgot Password]";
            };
        }
    }
}
