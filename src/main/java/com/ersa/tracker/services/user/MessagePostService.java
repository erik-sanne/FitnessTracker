package com.ersa.tracker.services.user;

import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.models.user.Post;
import com.ersa.tracker.repositories.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

import java.util.Date;


@Service
public class MessagePostService implements PostService {

    final PostRepository postRepository;

    @Autowired
    public MessagePostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @Override
    public Post createPost(User user, Date date, String title, String message) {
        return createPost(user, date, title, message,false);
    }

    public Post createPost(User user, String title, String message) {
        return createPost(user, new Date(), title, message,false);
    }

    @Override
    public Post createPost(User user, Date date, String title, String message, boolean manual) {
        Post post = new Post();
        post.setDate(new Date());
        post.setAuthor(user.getUserProfile());
        post.setTitle(title);
        post.setMessage(message);
        post.setAutoCreated(!manual);
        return postRepository.save(post);
    }
}
