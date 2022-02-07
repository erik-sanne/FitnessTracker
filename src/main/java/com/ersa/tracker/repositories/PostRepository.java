package com.ersa.tracker.repositories;

import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.models.user.Post;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface PostRepository extends CrudRepository<Post, Long> {
    List<Post> findAllByAuthorUser(User user);
}
