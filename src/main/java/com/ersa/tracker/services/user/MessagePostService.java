package com.ersa.tracker.services.user;

import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.models.user.Notice;
import com.ersa.tracker.models.user.Post;
import com.ersa.tracker.models.user.UserProfile;
import com.ersa.tracker.repositories.NoticeRepository;
import com.ersa.tracker.repositories.PostRepository;
import com.ersa.tracker.security.exceptions.ResourceNotFoundException;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
@Log4j2
public class MessagePostService implements PostService {

    final PostRepository postRepository;
    final NoticeRepository noticeRepository;

    @Autowired
    public MessagePostService(PostRepository postRepository, NoticeRepository noticeRepository) {
        this.postRepository = postRepository;
        this.noticeRepository = noticeRepository;
    }

    @Override
    public Post createPost(User user, Date date, String title, String message) {
        return createPost(user, null, date, title, message, false);
    }

    public Post createPost(User user, String title, String message) {
        return createPost(user, null, new Date(), title, message, false);
    }

    @Override
    public boolean deletePost(User user, long id) {
        Optional<Post> resource = postRepository.findById(id);
        if (resource.isEmpty()) {
            log.warn("User {} tried to remove post {} but it did not exist", user.getId(), id);
            throw new ResourceNotFoundException("Post does not exist");
        }

        Post post = resource.get();

        if (!post.getAuthor().getUser().equals(user)) {
            log.error("User {} tried to remove post {} posted by {}", user.getId(), id, post.getAuthor().getUser().getId());
            return false;
        }

        List<Post> replies = post.getReplies();

        replies.forEach(postRepository::delete);
        postRepository.delete(post);
        return true;
    }

    @Override
    public boolean editPost(long id, String message, User user) {
        Optional<Post> resource = postRepository.findById(id);
        if (resource.isEmpty()){
            log.warn("User {} tried to edit post {} but it did not exist", user.getId(), id);
            throw new ResourceNotFoundException("Post does not exist");
        }

        Post post = resource.get();

        if (!post.getAuthor().getUser().equals(user)) {
            log.error("User {} tried to remove post {} posted by {}", user.getId(), id, post.getAuthor().getUser().getId());
            return false;
        }

        post.setEdited(true);
        post.setMessage(message);
        postRepository.save(post);
        return true;
    }

    @Override
    public Post createPost(User user, UserProfile toUser, Date date, String title, String message, boolean manual) {
        Post post = new Post();
        post.setDate(new Date());
        post.setAuthor(user.getUserProfile());
        post.setTitle(title);
        post.setMessage(message);
        post.setAutoCreated(!manual);
        post.setOnWall(toUser != null ? toUser : user.getUserProfile());
        return postRepository.save(post);
    }

    @Override
    public Post replyToPost(long id, User user, String title, String message) {
        Optional<Post> op = postRepository.findById(id);
        if (op.isEmpty()) {
            log.error("Replying to non-existing post. Aborting");
            return null;
        }

        Post originalPost = op.get();

        Post post = new Post();
        post.setDate(new Date());
        post.setAuthor(user.getUserProfile());
        post.setTitle(title);
        post.setMessage(message);
        post.setAutoCreated(false);
        post.setReplyTo(originalPost);

        Post newPost = postRepository.save(post);

        if (!originalPost.getAuthor().equals(user.getUserProfile())) {
            UserProfile originalPoster = originalPost.getAuthor();
            createNotice(post, originalPoster);
        }

        return newPost;
    }

    private void createNotice(Post source, UserProfile toUser) {
        Notice notice = new Notice();
        notice.setBelongsTo(toUser);
        notice.setSource(source);
        noticeRepository.save(notice);
    }

    @Override
    public void toggleLike(long id, User user) {
        Optional<Post> post = postRepository.findById(id);
        if (post.isEmpty()) {
            log.warn("post no longer exists");
            return;
        }
        Post p = post.get();
        boolean hasliked = p.getHasLiked().contains(user);
        List<User> likedPost;
        if (hasliked) {
            likedPost = p.getHasLiked().stream().filter(usr -> !usr.equals(user)).collect(Collectors.toList());
        } else {
            likedPost = p.getHasLiked();
            likedPost.add(user);
            if (!p.getAuthor().equals(user.getUserProfile()))
                createNotice(p, p.getAuthor());
        }
        p.setHasLiked(likedPost);
        postRepository.save(p);
    }

    @Override
    public void clearNotices(User user) {
        List<Notice> notices = user.getUserProfile().getNotices();
        for (Notice notice : notices) {
            noticeRepository.delete(notice);
        }
    }

}
