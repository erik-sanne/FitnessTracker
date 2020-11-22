package com.ersa.tracker.services;

import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.security.exceptions.EmailAlreadyRegisteredException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.security.Principal;

public interface AccountService {
    User register(String email, String password) throws EmailAlreadyRegisteredException;
    void authenticate(String username, String password) throws AuthenticationException;
    User getUserByPrincipal(Principal principal) throws UsernameNotFoundException;
}
