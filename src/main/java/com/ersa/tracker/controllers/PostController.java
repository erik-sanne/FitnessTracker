package com.ersa.tracker.controllers;

import com.ersa.tracker.dto.PostDto;
import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.models.user.Post;
import com.ersa.tracker.models.user.UserProfile;
import com.ersa.tracker.services.authentication.AccountService;
import com.ersa.tracker.services.user.PostService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@Log4j2
public class PostController {

    final AccountService accountService;
    final PostService postService;

    @Autowired
    public PostController(AccountService accountService, PostService postService) {
        this.accountService = accountService;
        this.postService = postService;
    }

    public List<PostDto> getNewsFeed(final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        List<Post> posts = currentUser.getUserProfile().getFriends().stream().flatMap(f -> f.getPosts().stream()).collect(Collectors.toList());
        posts.addAll(currentUser.getUserProfile().getPosts());
        posts = posts.stream().filter(p -> p.getReplyTo() == null).sorted(Comparator.comparing(Post::getDate)).collect(Collectors.toList());
        Collections.reverse(posts);
        try {
            postService.clearNotices(currentUser);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return posts.stream().map(PostDto::new).collect(Collectors.toList());
    }

    @GetMapping("/posts/feed")
    public List<PostDto> getNewsFeedInterval(final Principal principal, @RequestParam(name = "from") Integer from, @RequestParam(name = "to") Integer to) {
        List<PostDto> feed = getNewsFeed(principal);
        return feed.subList(from, Math.min(to, feed.size()));
    }

    @PostMapping("/posts/post")
    public void postPost(@RequestBody final String message, final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        postService.createPost(currentUser, new Date(), "", message, true);
    }

    @PostMapping("/posts/reply/{replyTo}")
    public void postPost(@PathVariable final long replyTo, @RequestBody final String message, final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        postService.replyToPost(replyTo, currentUser, "", message);
    }

    @PostMapping("/posts/like/{postId}")
    public void postPost(@PathVariable final long postId, final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        postService.toggleLike(postId, currentUser);
    }
}
