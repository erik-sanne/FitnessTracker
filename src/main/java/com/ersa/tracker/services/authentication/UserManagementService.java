package com.ersa.tracker.services.authentication;

import com.ersa.tracker.models.authentication.ChangePasswordToken;
import com.ersa.tracker.models.authentication.EmailVerificationToken;
import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.models.authentication.UserToken;
import com.ersa.tracker.repositories.authentication.AuthenticationTokenRepository;
import com.ersa.tracker.repositories.authentication.ChangePasswordTokenRepository;
import com.ersa.tracker.repositories.authentication.EmailVerificationTokenRepository;
import com.ersa.tracker.repositories.authentication.UserRepository;
import com.ersa.tracker.security.exceptions.EmailAlreadyRegisteredException;
import com.ersa.tracker.security.exceptions.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;
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

import java.security.Principal;
import java.util.*;

@Service
@Log4j2
public class UserManagementService implements AccountService, AuthenticationService, EmailVerificationService {

    private static final int SESSION_TIMEOUT_MINUTES = 60 * 24 * 3;
    private static final int VERIFY_EMAIL_MINUTES = 60 * 24 * 3;
    public static final int CHANGE_PASSWORD_MINUTES = 10;

    private final UserRepository userRepository;
    private final AuthenticationTokenRepository authenticationTokenRepository;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final ChangePasswordTokenRepository changePasswordTokenRepository;
    private final PasswordEncoder pwEncoder;

    @Autowired
    public UserManagementService(final UserRepository userRepository,
                                 final AuthenticationTokenRepository authenticationTokenRepository,
                                 final EmailVerificationTokenRepository emailVerificationTokenRepository,
                                 ChangePasswordTokenRepository changePasswordTokenRepository, final PasswordEncoder pwEncoder) {
        this.userRepository = userRepository;
        this.authenticationTokenRepository = authenticationTokenRepository;
        this.emailVerificationTokenRepository = emailVerificationTokenRepository;
        this.changePasswordTokenRepository = changePasswordTokenRepository;
        this.pwEncoder = pwEncoder;
    }


    public User register(final String email, final String password) throws EmailAlreadyRegisteredException {
        if (userRepository.findByEmail(email) != null) {
            log.warn("Unsuccessful user registration for email {}. Email already registered", email);
            throw new EmailAlreadyRegisteredException("An account is already registered with this email");
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(pwEncoder.encode(password));
        user.setPermissionLevel(User.Permissions.BASIC);
        userRepository.save(user);
        log.info("User [{}/{}] successfully created!", user.getId(), user.getEmail());
        return user;
    }

    @Override
    public boolean doesUserExist(String email) {
        return userRepository.findByEmail(email) != null;
    }

    public void authenticate(final String email, final String password) throws AuthenticationException {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            log.warn("Failed authentication attempt. User with email {} not found.", email);
            throw new UsernameNotFoundException("Wrong username or password");
        }

        if (!pwEncoder.matches(password, user.getPassword())) {
            log.warn("Failed authentication attempt for user id {}. Password mismatch.", user.getId());
            throw new BadCredentialsException("Wrong username or password");
        }

        if (!user.isVerified()) {
            log.warn("Failed authentication attempt for user id {}. User not verified.", user.getId());
            throw new DisabledException("Account has not been verified");
        }
    }

    @Override
    public void changePassword(Principal principal, String newPassword) {
        User user = getUserByPrincipal(principal);
        user.setPassword(pwEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    public void validateTokenAndChangePassword(String token, String newPassword) {
        ChangePasswordToken cpToken = changePasswordTokenRepository.findByToken(token);
        if (cpToken == null) {
            log.warn("Failed to change password, no token found in database: {}.", token);
            return; // No exceptions, log only
        }

        if (new Date().after(cpToken.getExpiryDate())) {
            log.warn("Failed to change password, token has expired: {}.", token);
            return;
        }

        User user = cpToken.getUser();
        user.setPassword(pwEncoder.encode(newPassword));
        userRepository.save(user);

        changePasswordTokenRepository.delete(cpToken);

        signoutAndRemoveSessionToken(user);
    }

    @Override
    public User getUserByPrincipal(final Principal principal) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(principal.getName());
        if (user == null) {
            log.warn("Could not retrieve user for associated principal {}. ", principal.getName());
            throw new UsernameNotFoundException("Could not find user linked to credentials");
        }

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
    public String createAuthenticationToken(final String username,
                                            final String password) throws AuthenticationException {
        authenticate(username, password);

        User user = userRepository.findByEmail(username);

        final String token = UUID.randomUUID().toString();
        final String tokenHash = pwEncoder.encode(token);
        final String tokenString = String.format("%s:%s", username, token);

        final Date expires = getExpiry(SESSION_TIMEOUT_MINUTES);

        UserToken sessionToken = new UserToken();
        sessionToken.setToken(tokenHash);
        sessionToken.setExpiration(expires);
        authenticationTokenRepository.save(sessionToken);

        user.setToken(sessionToken);
        user.setLastLogin(new Date());
        userRepository.save(user);

        log.info("Authentication token created for user {}.", user.getId());
        return tokenString;
    }

    @Override
    public void refreshSession(User user) {
        UserToken userToken = user.getToken();
        userToken.setExpiration(getExpiry(SESSION_TIMEOUT_MINUTES));
        userRepository.save(user);
        log.info("User {} refreshed session", user.getId());
    }

    public void createEmailVerificationToken(final User user, final String email, final String token) {
        EmailVerificationToken emailVerificationToken = new EmailVerificationToken();
        final Date expires = getExpiry(VERIFY_EMAIL_MINUTES);
        emailVerificationToken.setUser(user);
        emailVerificationToken.setEmail(email);
        emailVerificationToken.setToken(token);
        emailVerificationToken.setExpiryDate(expires);
        log.info("Creating email verification token for user {} : id: {}, token: {}",
                emailVerificationToken.getUser().getId(),
                emailVerificationToken.getId(),
                emailVerificationToken.getToken());
        emailVerificationTokenRepository.save(emailVerificationToken);
        log.info("Email verification token created for user {}.", user.getId());
    }

    @Override
    public void createForgotPasswordToken(String email, String token) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            log.error("Forgot password invoked on non registered email");
            throw new ResourceNotFoundException("User does not exist");
        }

        ChangePasswordToken changePasswordToken = new ChangePasswordToken();
        final Date expires = getExpiry(CHANGE_PASSWORD_MINUTES);
        changePasswordToken.setUser(user);
        changePasswordToken.setToken(token);
        changePasswordToken.setExpiryDate(expires);
        changePasswordTokenRepository.save(changePasswordToken);
        log.info("Creating token for changing password for user {}, tokenID: {} token: {}", user, changePasswordToken.getId(), token);
    }

    public void verifyEmail(final String tokenString) throws AuthenticationException, ResourceNotFoundException {
        EmailVerificationToken token = emailVerificationTokenRepository.findByToken(tokenString);
        if (token == null) {
            log.warn("Failed attempt to verify account, no token found in database: {}.", tokenString);
            throw new ResourceNotFoundException("Bad token");
        }

        if (new Date().after(token.getExpiryDate())) {
            log.warn("Failed attempt to verify account, expired token: {}.", tokenString);
            // CredentialsExpiredException inherits from AccountStatusException,
            // and an email token is not an account....
            throw new CredentialsExpiredException("Verification token expired");
        }
        User user = token.getUser();
        user.setVerified(true);

        if (token.getEmail() != null && user.getEmail().equals(token.getEmail())) {
            // For email change
            user.setEmail(token.getEmail());
        }

        userRepository.save(user);
        emailVerificationTokenRepository.delete(token);

        log.info("User {} has verified their email. Will perform force logout in case of email changed", user.getId());
        signoutAndRemoveSessionToken(user);
    }

    private void signoutAndRemoveSessionToken(User user) {
        UserToken token = user.getToken();
        if (token != null) {
            user.setToken(null);
            userRepository.save(user);
            authenticationTokenRepository.delete(token);
        }
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(final String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email);

        Collection<GrantedAuthority> permissions = Arrays.asList(new SimpleGrantedAuthority(user.getPermissionLevel()));

        UserToken token = user.getToken();

        final String tokenString = token.getToken();

        boolean credentialsNonExpired = true;

        if (new Date().after(token.getExpiration())) {
            log.info("Expired authentication token submitted by user: {}", user.getId());
            user.setToken(null);
            userRepository.save(user);
            authenticationTokenRepository.delete(token);

            credentialsNonExpired = false;
        }

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                tokenString,
                user.isVerified(),
                true,
                credentialsNonExpired,
                true,
                permissions
        );
    }

    private Date getExpiry(final int minuets) {
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.MINUTE, minuets);
        return new Date(cal.getTime().getTime());
    }
}
