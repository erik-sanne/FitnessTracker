package com.ersa.tracker.dto;

import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.models.user.Post;
import com.ersa.tracker.models.user.UserProfile;
import com.ersa.tracker.services.user.PostService;
import com.ersa.tracker.utils.DateUtils;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public class PostDto {
    final long postId;
    final long authorId;
    final List<LikedBy> likes;
    final boolean isAutoPosted;
    final boolean isEdited;
    final String date;
    final String authorName;
    final String title;
    final String message;
    final Wall toUser;
    final List<PostDto> replies;

    public PostDto(Post post) {
        postId = post.getId();
        authorId = post.getAuthor().getUser().getId();
        authorName = post.getAuthor().getDisplayName();
        date = DateUtils.FORMAT_yyyyMMddHHmm.format(post.getDate());
        title = post.getTitle();
        message = post.getMessage().replaceAll(PostService.DISPLAY_NAME, authorName);
        replies = post.getReplies().stream().map(PostDto::new).collect(Collectors.toList());
        likes = post.getHasLiked().stream().map(User::getUserProfile).map(LikedBy::new).collect(Collectors.toList());
        isAutoPosted = post.isAutoCreated();
        isEdited = post.isEdited();
        toUser = post.getOnWall() == null || post.getOnWall().getUser().getId() == authorId ? null : new Wall(post.getOnWall());
    }

    public long getPostId() {
        return postId;
    }

    public long getAuthorId() {
        return authorId;
    }

    public String getAuthorName() {
        return authorName;
    }

    public String getTitle() {
        return title;
    }

    public String getMessage() {
        return message;
    }

    public String getDate() {
        return date;
    }

    public List<PostDto> getReplies() {
        return replies;
    }

    public List<LikedBy> getLikes() {
        return likes;
    }

    public boolean isAutoPosted() {
        return isAutoPosted;
    }

    public boolean isEdited() {
        return isEdited;
    }

    public Wall getToUser() {
        return toUser;
    }

    static class Wall {
        private long id;
        private String name;
        private String picture;

        private Wall(UserProfile up) {
            id = up.getUser().getId();
            name = up.getDisplayName();
            picture = Optional.ofNullable(up.getProfilePicture()).map(String::new).orElse(null);
        }

        public long getId() {
            return id;
        }

        public String getName() {
            return name;
        }

        public String getPicture() {
            return picture;
        }
    }

    static class LikedBy {
        private String name;
        private String picture;

        public LikedBy(UserProfile up) {
            name = up.getDisplayName();
            picture = Optional.ofNullable(up.getProfilePicture()).map(String::new).orElse(null);
        }

        public String getName() {
            return name;
        }

        public String getPicture() {
            return picture;
        }
    }
}
