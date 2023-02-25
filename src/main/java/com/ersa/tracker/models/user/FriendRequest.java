package com.ersa.tracker.models.user;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;

@Entity
public class FriendRequest {

    @Id
    @GeneratedValue
    private long id;

    @OneToOne
    private UserProfile from;

    @OneToOne
    private UserProfile to;

    public long getId() {
        return id;
    }

    public void setId(final long id) {
        this.id = id;
    }

    public UserProfile getFrom() {
        return from;
    }

    public void setFrom(final UserProfile from) {
        this.from = from;
    }

    public UserProfile getTo() {
        return to;
    }

    public void setTo(final UserProfile to) {
        this.to = to;
    }
}
