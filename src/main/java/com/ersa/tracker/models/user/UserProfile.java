package com.ersa.tracker.models.user;

import com.ersa.tracker.models.Achievement;
import com.ersa.tracker.models.authentication.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.validator.constraints.Length;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
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
    @JsonIgnore
    private byte[] profilePicture = null;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "friends")
    @JsonIgnore
    private List<UserProfile> friends;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "author", cascade = CascadeType.ALL)
    @JsonIgnore
    @OrderBy("date")
    private List<Post> posts;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "belongsTo")
    private List<Notice> notices;

    @Transient
    @JsonProperty(value = "friends")
    private List<UserProfile> friends() {
        return friends.stream().peek(up -> up.friends = Collections.emptyList()).collect(Collectors.toList());
    }


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
}
