package com.ersa.tracker.controllers;

import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.models.user.FriendRequest;
import com.ersa.tracker.models.user.UserProfile;
import com.ersa.tracker.security.exceptions.ResourceNotFoundException;
import com.ersa.tracker.services.authentication.AccountService;
import com.ersa.tracker.services.general.achivements.AchievementService;
import com.ersa.tracker.services.user.FriendRequestManager;
import com.ersa.tracker.services.user.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.Principal;
import java.util.Collection;

@RestController
public class UserController {

    private ProfileService profileService;
    private AccountService accountService;
    private FriendRequestManager friendsService;
    private AchievementService achievementService;

    @Autowired
    public UserController(final ProfileService profileService,
                          final AccountService accountService,
                          final FriendRequestManager friendsService,
                          final AchievementService achievementService) {
        this.profileService = profileService;
        this.accountService = accountService;
        this.friendsService = friendsService;
        this.achievementService = achievementService;
    }

    @GetMapping("/users/profile")
    public UserProfile getMyProfile(final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        return profileService.getProfile(currentUser);
    }

    @PostMapping("/users/saveProfile")
    public UserProfile saveProfile(@RequestBody final ProfileEdit profileEdit,
                            final Principal principal) throws IOException {
        User currentUser = accountService.getUserByPrincipal(principal);
        profileService.saveProfile(profileEdit.getDisplayName(), profileEdit.getProfilePicture(), currentUser);
        currentUser = accountService.getUserByPrincipal(principal);
        return profileService.getProfile(currentUser);
    }

    @PostMapping("/users/friendRequest")
    public ResponseEntity<?> sendFriendRequest(@RequestBody final String email, final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        try {
            friendsService.sendFriendRequest(email, currentUser);
            return ResponseEntity.ok("Friend request sent");
        } catch (IllegalArgumentException | ResourceNotFoundException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/users/getFriendRequests")
    public Collection<FriendRequest> incomingFriendRequests(final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        return friendsService.getFriendRequests(currentUser);
    }

    @PostMapping("/users/acceptFriend/{requestId}")
    public void acceptFriend(@PathVariable final long requestId, final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        friendsService.acceptFriendRequest(requestId, currentUser);
    }

    @PostMapping("/users/denyFriend/{requestId}")
    public void denyFriend(@PathVariable final long requestId, final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        friendsService.deleteFriendRequest(requestId, currentUser);
    }

    @PostMapping("/users/setTitle")
    public void incomingFriendRequests(@RequestBody final String title, final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        achievementService.setActive(currentUser, title);
    }

    public static class ProfileEdit {
        private String displayName;
        private String profilePicture;

        ProfileEdit() {

        }

        public String getDisplayName() {
            return displayName;
        }

        public void setDisplayName(final String displayName) {
            this.displayName = displayName;
        }

        public String getProfilePicture() {
            return profilePicture;
        }

        public void setProfilePicture(final String profilePicture) {
            this.profilePicture = profilePicture;
        }

    }
}
