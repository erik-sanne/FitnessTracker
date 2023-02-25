package com.ersa.tracker.models.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;

@Entity
public class Notice {

    @Id
    @GeneratedValue
    private long id;

    @ManyToOne
    @JsonIgnore
    private UserProfile belongsTo;

    @OneToOne
    @JsonIgnore
    private Post source;

    @JsonProperty(value = "postId")
    private Long permissionLevel() {
        return source.getId();
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Post getSource() {
        return source;
    }

    public void setSource(Post source) {
        this.source = source;
    }

    public UserProfile getBelongsTo() {
        return belongsTo;
    }

    public void setBelongsTo(UserProfile belongsTo) {
        this.belongsTo = belongsTo;
    }

}
