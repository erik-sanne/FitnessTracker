package com.ersa.tracker.services.user;

import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.models.user.Post;
import org.springframework.stereotype.Service;

import java.util.Date;


@Service
public interface PostService {
    Post createPost(User user, Date date, String title, String message);
    Post createPost(User user, Date date, String title, String message, boolean manual);
    Post createPost(User user, String title, String message);
}
