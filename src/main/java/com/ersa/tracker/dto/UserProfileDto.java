package com.ersa.tracker.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

import java.util.List;

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
        private final Integer friends;
    }
}