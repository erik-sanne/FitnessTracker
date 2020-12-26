package com.ersa.tracker.models.user;

import com.ersa.tracker.models.authentication.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.List;

@Entity
public class UserProfile {

    @Id
    private long id;

    @MapsId
    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    private User user;

    @Transient
    @JsonProperty( value = "userId" )
    private long userId() { return user.getId(); }

    @NotNull
    @Length(min = 4, max = 16)
    private String displayName;

    @Lob
    @JsonIgnore
    private byte[] profilePicture = null;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "friends")
    private List<UserProfile> friends;

    @Transient
    @JsonProperty( value = "profilePicture" )
    private String profileBase64() {
        return profilePicture == null ? null : new String(profilePicture);
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public List<UserProfile> getFriends() {
        return friends;
    }

    public void setFriends(List<UserProfile> friends) {
        this.friends = friends;
    }

    public byte[] getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(byte[] profilePicture) {
        this.profilePicture = profilePicture;
    }
}
