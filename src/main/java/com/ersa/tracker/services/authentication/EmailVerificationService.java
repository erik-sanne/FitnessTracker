package com.ersa.tracker.services.authentication;

import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.security.exceptions.ResourceNotFoundException;
import org.springframework.security.core.AuthenticationException;

public interface EmailVerificationService {
    void createEmailVerificationToken(User user, String token);
    void verifyEmail(String tokenString) throws AuthenticationException, ResourceNotFoundException;
}
