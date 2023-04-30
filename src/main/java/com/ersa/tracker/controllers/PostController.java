package com.ersa.tracker.controllers;

import com.ersa.tracker.dto.PostDto;
import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.models.user.Post;
import com.ersa.tracker.models.user.UserProfile;
import com.ersa.tracker.services.authentication.AccountService;
import com.ersa.tracker.services.user.PostService;
import jdk.jshell.spi.ExecutionControl;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.*;
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

    public List<PostDto> getWall(final Principal principal, final UserProfile userWall) {
        User currentUser = accountService.getUserByPrincipal(principal);
        List<Post> posts = userWall.getFriends().stream().flatMap(f -> f.getPosts().stream()).collect(Collectors.toList());
        posts = posts.stream().filter(post -> post.getOnWall() == userWall).collect(Collectors.toList());;
        posts.addAll(userWall.getPosts());
        posts = posts.stream().filter(post -> post.getOnWall() == null || post.getOnWall() == userWall).collect(Collectors.toList());;
        posts = posts.stream().filter(p -> p.getReplyTo() == null).sorted(Comparator.comparing(Post::getDate)).collect(Collectors.toList());;
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

    @GetMapping("/posts/wall/{userId}")
    public List<PostDto> getNewsFeedInterval(@PathVariable long userId, final Principal principal, @RequestParam(name = "from") Integer from, @RequestParam(name = "to") Integer to) throws ExecutionControl.NotImplementedException {
        User currentUser = accountService.getUserByPrincipal(principal);
        if (currentUser.getId() == userId) {
            return getWall(principal, currentUser.getUserProfile());
        }
        Optional<UserProfile> friendsWall = currentUser.getUserProfile().getFriends().stream().filter(friend -> friend.getUser().getId() == userId).findAny();

        if (friendsWall.isEmpty()) {
            log.info("User {} viewed wall of user {} but no posts were returned as they are not friends", currentUser.getId(), userId);
            return Collections.emptyList();
        }

        return getWall(principal, friendsWall.get());
    }

    @PostMapping("/posts/post/{userId}")
    public void postPostOnWall(@PathVariable long userId, @RequestBody final String message, final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        if (currentUser.getId() == userId) {
            postService.createPost(currentUser, currentUser.getUserProfile(), new Date(), "", message, true);
            return;
        }

        //Validate friend
        Optional<UserProfile> friend = currentUser.getUserProfile().getFriends().stream().filter(f -> f.getUser().getId() == userId).findAny();
        if (friend.isEmpty()) {
            log.warn("User {} can not post on user {}'s wall, as they are not friends", currentUser.getId(), userId);
            return; //200 ok for now
        }

        postService.createPost(currentUser, friend.get(), new Date(), "", message, true);
    }
    /**
     * use post on wall instead
     * @param message
     * @param principal
     */
    @PostMapping("/posts/post")
    @Deprecated
    public void postPost(@RequestBody final String message, final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        postService.createPost(currentUser, null, new Date(), "", message, true);
    }

    @DeleteMapping("/posts/delete/{id}")
    public void deletePost(@PathVariable long id, final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        postService.deletePost(currentUser, id);
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

    @PostMapping("/posts/edit/{postId}")
    public void editPost(@PathVariable final long postId, @RequestBody final String message, final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        postService.editPost(postId, message, currentUser);
    }
}
