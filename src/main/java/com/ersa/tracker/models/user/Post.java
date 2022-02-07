package com.ersa.tracker.models.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;

@Entity
public class Post {

    @Id
    @GeneratedValue
    private long id;

    @ManyToOne
    private Post replyTo = null;

    @OneToMany(mappedBy = "replyTo")
    List<Post> replies;

    @NotNull
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date date;

    @NotNull
    private String message;

    @NotNull
    private String title;

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
}
