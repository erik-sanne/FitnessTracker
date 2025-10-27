package com.ersa.tracker.controllers.models;

import com.ersa.tracker.models.Achievement;
import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.models.user.Notice;
import com.ersa.tracker.models.user.Post;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
public class UserProfileDto {
    private final long userId;
    private final String displayName;
    private final String title;
    private final String profilePicture; //Base64 encoded
    private final String permissionLevel;
    private final long score;
    private final List<FriendDto> friends;
    private final List<NoticeDto> notices;


    @Transient
    @JsonProperty(value = "friendsCount")
    private int getFriendsCount() {
        return friends.size();
    }

    @Data
    @Builder
    public static class NoticeDto {
        private final Long postId;
    }

    @Data
    @Builder
    public static class FriendDto {
        private final long userId;
        private final String displayName;
        private final String title;
        private final String profilePicture; //Base64 encoded
        private final String permissionLevel;
    }
}