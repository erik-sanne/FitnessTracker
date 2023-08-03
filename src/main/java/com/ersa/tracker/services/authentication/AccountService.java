package com.ersa.tracker.services.authentication;

import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.security.exceptions.EmailAlreadyRegisteredException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.security.Principal;

public interface AccountService {
    User register(String email, String password) throws EmailAlreadyRegisteredException;
    boolean doesUserExist(String email);
    void authenticate(String email, String password) throws AuthenticationException;
    void changePassword(Principal principal, String newPassword);
    void validateTokenAndChangePassword(String token, String newPassword);
    User getUserByPrincipal(Principal principal) throws UsernameNotFoundException;
}
