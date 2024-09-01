package com.ersa.tracker.models.user;

import com.ersa.tracker.models.Achievement;
import com.ersa.tracker.models.authentication.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Entity
public class UserProfile {

    @Id
    private long id;

    @MapsId
    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    private User user;

    @Transient
    @JsonProperty(value = "userId")
    private long userId() {
        return user.getId();
    }

    @SuppressWarnings("checkstyle:MagicNumber")
    @NotNull
    @Length(min = 4, max = 16)
    private String displayName;

    @OneToOne
    @JsonIgnore
    private Achievement title;

    @Lob
    @Column(length=4000000) //Approximately 4mb
    @JsonIgnore
    private byte[] profilePicture = null;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "friends")
    @JsonIgnore
    private List<UserProfile> friends;

    @Transient
    @JsonProperty(value = "friendsCount")
    private int friendsCount;


    @OneToMany(fetch = FetchType.LAZY, mappedBy = "author", cascade = CascadeType.ALL)
    @JsonIgnore
    @OrderBy("date")
    private List<Post> posts;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "belongsTo")
    private List<Notice> notices;

    @Transient
    @JsonProperty(value = "friends")
    private List<UserProfile> friends() {
        return friends != null ? friends.stream().peek(up -> {
            up.friendsCount = up.friends.size();
            up.friends = Collections.emptyList();
        }).collect(Collectors.toList()) : Collections.emptyList();
    }

    private long score;

    @Transient
    @JsonProperty(value = "permissionLevel")
    private String permissionLevel() {
        return user.getPermissionLevel();
    }

    @Transient
    @JsonProperty(value = "profilePicture")
    private String profileBase64() {
        return profilePicture == null ? null : new String(profilePicture);
    }

    @Transient
    @JsonProperty(value = "title")
    private String achievementName() {
        return title == null ? null : title.getName();
    }

    public User getUser() {
        return user;
    }

    public void setUser(final User user) {
        this.user = user;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(final String displayName) {
        this.displayName = displayName;
    }

    public Achievement getTitle() {
        return title;
    }

    public void setTitle(Achievement title) {
        this.title = title;
    }

    public List<UserProfile> getFriends() {
        return friends;
    }

    public void setFriends(final List<UserProfile> friends) {
        this.friends = friends;
    }

    public byte[] getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(final byte[] profilePicture) {
        this.profilePicture = profilePicture;
    }

    public List<Post> getPosts() {
        return posts;
    }

    public void setPosts(List<Post> news) {
        this.posts = news;
    }

    public List<Notice> getNotices() {
        return notices;
    }

    public void setNotices(List<Notice> notices) {
        this.notices = notices;
    }

    public long getScore() {
        return score;
    }

    public void setScore(long score) {
        this.score = score;
    }

}
