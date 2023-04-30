package com.ersa.tracker.models.user;

import com.ersa.tracker.models.authentication.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

@Entity
public class Post {

    @Id
    @GeneratedValue
    private long id;

    @ManyToOne
    private UserProfile onWall = null;

    @ManyToOne
    private Post replyTo = null;

    @OneToMany(mappedBy = "replyTo")
    List<Post> replies;

    @ManyToMany
    private List<User> hasLiked;

    @NotNull
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date date;

    @NotNull
    private String message;

    @NotNull
    private String title;

    private boolean edited = false;

    @ManyToOne
    @JsonIgnore
    private UserProfile author;

    @JsonProperty("userId")
    private long getUserId() {
        return author.getUser().getId();
    }

    private boolean autoCreated;

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public boolean isAutoCreated() {
        return autoCreated;
    }

    public void setAutoCreated(boolean autoCreated) {
        this.autoCreated = autoCreated;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public UserProfile getAuthor() {
        return author;
    }

    public void setAuthor(UserProfile author) {
        this.author = author;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public UserProfile getOnWall() {
        return onWall;
    }

    public void setOnWall(UserProfile onWall) {
        this.onWall = onWall;
    }

    public Post getReplyTo() {
        return replyTo;
    }

    public void setReplyTo(Post replyTo) {
        this.replyTo = replyTo;
    }

    public List<Post> getReplies() {
        return replies;
    }

    public void setReplies(List<Post> replies) {
        this.replies = replies;
    }

    public long getId() {
        return id;
    }

    public List<User> getHasLiked() {
        return hasLiked;
    }

    public void setHasLiked(List<User> hasLiked) {
        this.hasLiked = hasLiked;
    }

    public boolean isEdited() {
        return edited;
    }

    public void setEdited(boolean edited) {
        this.edited = edited;
    }

}
