package com.ersa.tracker.controllers;

import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.models.user.Post;
import com.ersa.tracker.services.authentication.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class PostController {

    final AccountService accountService;

    @Autowired
    public PostController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping("/posts/feed")
    public List<Post> getNewsFeed(final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        List<Post> posts = currentUser.getUserProfile().getFriends().stream().flatMap(f -> f.getNews().stream()).collect(Collectors.toList());
        posts.sort(Comparator.comparing(Post::getDate));
        Collections.reverse(posts);
        return posts;
    }
}
