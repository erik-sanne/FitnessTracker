package com.ersa.tracker.dto;

import com.ersa.tracker.models.user.Post;
import com.ersa.tracker.services.user.PostService;
import com.ersa.tracker.utils.DateUtils;

import java.util.List;
import java.util.stream.Collectors;

public class PostDto {
    final long postId;
    final long authorId;
    final int likes;
    final String date;
    final String authorName;
    final String title;
    final String message;
    final List<PostDto> replies;

    public PostDto(Post post) {
        postId = post.getId();
        authorId = post.getAuthor().getUser().getId();
        authorName = post.getAuthor().getDisplayName();
        date = DateUtils.FORMAT_yyyyMMddHHmm.format(post.getDate());
        title = post.getTitle();
        message = post.getMessage().replaceAll(PostService.DISPLAY_NAME, authorName);
        replies = post.getReplies().stream().map(PostDto::new).collect(Collectors.toList());
        likes = post.getHasLiked().size();
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

    public int getLikes() {
        return likes;
    }
}
