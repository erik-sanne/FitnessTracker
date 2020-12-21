package com.ersa.tracker.controllers;

import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.models.user.UserProfile;
import com.ersa.tracker.services.authentication.AccountService;
import com.ersa.tracker.services.user.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.Principal;

@RestController
public class UserController {

    private ProfileService profileService;
    private AccountService accountService;

    @Autowired
    public UserController(final ProfileService profileService,
                          final AccountService accountService){
        this.profileService = profileService;
        this.accountService = accountService;
    }

    @GetMapping("/users/profile")
    public UserProfile getMyProfile(final Principal principal) {
        User currentUser = accountService.getUserByPrincipal(principal);
        return profileService.getProfile(currentUser);
    }

    @PostMapping("/users/saveProfile")
    public UserProfile saveProfile(@RequestBody final ProfileEdit profileEdit,
                            final Principal principal ) throws IOException {
        User currentUser = accountService.getUserByPrincipal(principal);
        profileService.saveProfile(profileEdit.getDisplayName(), profileEdit.getProfilePicture(), currentUser);
        currentUser = accountService.getUserByPrincipal(principal);
        return profileService.getProfile(currentUser);
    }

    public static class ProfileEdit
    {
        private String displayName;
        private String profilePicture;

        ProfileEdit() {

        }

        public String getDisplayName() {
            return displayName;
        }

        public void setDisplayName(String displayName) {
            this.displayName = displayName;
        }

        public String getProfilePicture() {
            return profilePicture;
        }

        public void setProfilePicture(String profilePicture) {
            this.profilePicture = profilePicture;
        }

    }
}
