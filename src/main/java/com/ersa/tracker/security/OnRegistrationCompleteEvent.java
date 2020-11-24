package com.ersa.tracker.security;

import com.ersa.tracker.models.authentication.User;
import org.springframework.context.ApplicationEvent;

public final class OnRegistrationCompleteEvent extends ApplicationEvent {
    private User user;
    private String url;

    public OnRegistrationCompleteEvent(final User user, final String url) {
        super(user);
        this.user = user;
        this.url = url;
    }

    public User getUser() {
        return user;
    }

    public void setUser(final User user) {
        this.user = user;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(final String url) {
        this.url = url;
    }
}
