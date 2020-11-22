package com.ersa.tracker.services;

import com.ersa.tracker.models.authentication.EmailVerificationToken;
import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.models.authentication.UserToken;
import com.ersa.tracker.repositories.authentication.AuthenticationTokenRepository;
import com.ersa.tracker.repositories.authentication.EmailVerificationTokenRepository;
import com.ersa.tracker.repositories.authentication.UserRepository;
import com.ersa.tracker.security.exceptions.EmailAlreadyRegisteredException;
import com.ersa.tracker.security.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.CredentialsExpiredException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.security.Principal;
import java.util.*;

@Service
public class UserManagementService implements AccountService, AuthenticationService, EmailVerificationService {

    private final int ONE_DAY_IN_MINUTES = 60 * 24;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AuthenticationTokenRepository authenticationTokenRepository;
    @Autowired
    private EmailVerificationTokenRepository emailVerificationTokenRepository;
    @Autowired
    private PasswordEncoder pwEncoder;

    public User register(String email, String password) throws EmailAlreadyRegisteredException {
        if (userRepository.findByEmail(email) != null)
            throw new EmailAlreadyRegisteredException("An account is already registered with this email");

        User user = new User();
        user.setEmail(email);
        user.setPassword(pwEncoder.encode(password));
        user.setPermissionLevel(User.Permissions.BASIC);
        userRepository.save(user);
        return user;
    }

    public void authenticate(String username, String password) throws AuthenticationException {
        User user = userRepository.findByEmail(username);
        if (user == null)
            throw new UsernameNotFoundException("Wrong username or password");

        if (!pwEncoder.matches(password, user.getPassword()))
            throw new BadCredentialsException("Wrong username or password");

        if (!user.isVerified())
            throw new DisabledException("Account has not been verified");
    }

    @Override
    public User getUserByPrincipal(Principal principal) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(principal.getName());
        if (user == null)
            throw new UsernameNotFoundException("Could not find user linked to credentials");
        return user;
    }

    /**
     * Generates a "session" token that can be used by client as credentials.
     * @param username
     * @param password
     * @return A token string
     * @throws AuthenticationException if authentication would fail
     */
    @Transactional
    public String createAuthenticationToken(String username, String password) throws AuthenticationException {
        authenticate(username, password);

        User user = userRepository.findByEmail(username);

        final String token = UUID.randomUUID().toString();
        final String token_hash = pwEncoder.encode(token);
        final String tokenString = String.format("%s:%s", username, token);

        final Date expires = getExpiry(ONE_DAY_IN_MINUTES);

        UserToken sessionToken = new UserToken();
        sessionToken.setToken(token_hash);
        sessionToken.setExpiration(expires);
        authenticationTokenRepository.save(sessionToken);

        user.setToken(sessionToken);
        userRepository.save(user);

        return tokenString;
    }

    public void createEmailVerificationToken(User user, final String token){
        EmailVerificationToken emailVerificationToken = new EmailVerificationToken();
        final Date expires = getExpiry(ONE_DAY_IN_MINUTES);
        emailVerificationToken.setUser(user);
        emailVerificationToken.setToken(token);
        emailVerificationToken.setExpiryDate(expires);
        emailVerificationTokenRepository.save(emailVerificationToken);
    }

    public void verifyEmail(final String tokenString) throws AuthenticationException, ResourceNotFoundException {
        EmailVerificationToken token = emailVerificationTokenRepository.findByToken(tokenString);
        if (token == null)
            throw new ResourceNotFoundException("Bad token, perhaps it has expired");

        if (new Date().after(token.getExpiryDate()))
            // CredentialsExpiredEception inherits from AccountStatusException, and an email token is not an account....
            throw new CredentialsExpiredException("Verification token expired");

        User user = token.getUser();
        user.setVerified(true);
        userRepository.save(user);

        emailVerificationTokenRepository.delete(token);
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email);

        Collection<GrantedAuthority> permissions = Arrays.asList(new SimpleGrantedAuthority(user.getPermissionLevel()));

        UserToken token = user.getToken();

        final String tokenString = token.getToken();

        boolean credentialsNonExpired = true;

        if (new Date().after(token.getExpiration())) {
            user.setToken(null);
            userRepository.save(user);
            authenticationTokenRepository.delete(token);

            credentialsNonExpired = false;
        }

        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                tokenString,
                user.isVerified(),
                true,
                credentialsNonExpired,
                true,
                permissions
        );

        return userDetails;
    }

    private Date getExpiry(int minuets) {
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.MINUTE, minuets);
        return new Date(cal.getTime().getTime());
    }
}
