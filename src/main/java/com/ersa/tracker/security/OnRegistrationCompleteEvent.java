package com.ersa.tracker.security;

import com.ersa.tracker.models.authentication.User;
import org.springframework.context.ApplicationEvent;

public class OnRegistrationCompleteEvent extends ApplicationEvent {
    private User user;
    private String url;

    public OnRegistrationCompleteEvent(User user, String url) {
        super(user);
        this.user = user;
        this.url = url;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
