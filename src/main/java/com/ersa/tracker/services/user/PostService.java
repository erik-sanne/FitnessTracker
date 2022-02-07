package com.ersa.tracker.services.user;

import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.models.user.Post;
import org.springframework.stereotype.Service;

import java.util.Date;


@Service
public interface PostService {

    static final String DISPLAY_NAME = "#DISPLAY_NAME#";

    Post createPost(User user, Date date, String title, String message);
    Post createPost(User user, Date date, String title, String message, boolean manual);
    Post createPost(User user, String title, String message);
    Post replyToPost(long id, User user, String title, String message);
    void toggleLike(long id, User user);
}
