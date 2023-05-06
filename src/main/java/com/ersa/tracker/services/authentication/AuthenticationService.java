package com.ersa.tracker.services.authentication;

import com.ersa.tracker.models.authentication.User;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface AuthenticationService extends UserDetailsService {
    String createAuthenticationToken(String username, String password) throws AuthenticationException;
    void refreshSession(User user);
}
