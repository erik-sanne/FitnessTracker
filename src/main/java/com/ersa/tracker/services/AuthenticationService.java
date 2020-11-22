package com.ersa.tracker.services;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface AuthenticationService extends UserDetailsService {
    String createAuthenticationToken(String username, String password) throws AuthenticationException;
}
