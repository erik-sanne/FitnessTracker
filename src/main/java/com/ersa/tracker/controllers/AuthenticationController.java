package com.ersa.tracker.controllers;

import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.security.SendEmailEvent;
import com.ersa.tracker.security.exceptions.EmailAlreadyRegisteredException;
import com.ersa.tracker.security.exceptions.ResourceNotFoundException;
import com.ersa.tracker.services.authentication.AccountService;
import com.ersa.tracker.services.authentication.AuthenticationService;
import com.ersa.tracker.services.authentication.EmailVerificationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;
import org.apache.logging.log4j.util.Strings;
import org.hibernate.validator.constraints.Length;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Base64;

@RestController
@Log4j2
public class AuthenticationController {

    private final EmailVerificationService emailService;
    private final AccountService accountService;
    private final AuthenticationService tokenService;

    private ApplicationEventPublisher eventPublisher;

    @Autowired
    public AuthenticationController(final EmailVerificationService emailService,
                                    final AccountService accountService,
                                    final AuthenticationService tokenService,
                                    final ApplicationEventPublisher eventPublisher) {
        this.emailService = emailService;
        this.accountService = accountService;
        this.tokenService = tokenService;
        this.eventPublisher = eventPublisher;
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateHeaders(Principal principal) {
        User user = accountService.getUserByPrincipal(principal);
        tokenService.refreshSession(user);
        return ResponseEntity.ok("You are authenticated");
    }

    @PostMapping("/confirmEmail/{token}")
    public ResponseEntity<?> confirmEmail(@PathVariable final String token) {
        try {
            emailService.verifyEmail(token);
            return ResponseEntity.ok("Verified");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @PostMapping("/change-email")
    public ResponseEntity<?> changeEmail(@Valid @RequestBody final EmailDto email,
                                            final Principal principal,
                                            final HttpServletRequest request) {
        if (accountService.doesUserExist(email.getEmail())) {
            return ResponseEntity.badRequest().body("An account is already registered with this email address");
        }
        User user = accountService.getUserByPrincipal(principal);
        eventPublisher.publishEvent(new SendEmailEvent(SendEmailEvent.EventType.RequestEmailChange, user, email.getEmail(), request.getServerName()));
        log.info("User {} changed email", user.getId());
        return ResponseEntity.ok("A verification email has been sent!");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody final EmailDto emailDto, HttpServletRequest request) {
        eventPublisher.publishEvent(new SendEmailEvent(SendEmailEvent.EventType.ForgotPassword, null, emailDto.getEmail(), request.getServerName()));
        return ResponseEntity.ok("Password reset email sent!");
    }

    @PostMapping("/change-password") //Permit all, both for change- and forgot-password
    public ResponseEntity<?> changePassword(@Valid @RequestBody final ChangePasswordDto passwordDto,
                                            final Principal principal) {

        if (Strings.isBlank(passwordDto.oldPassword) && Strings.isBlank(passwordDto.token)) {
            log.error("Neither password, nor token, was supplied for change password!");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        if (Strings.isNotBlank(passwordDto.token)) {
            accountService.validateTokenAndChangePassword(passwordDto.token, passwordDto.newPassword);
            return ResponseEntity.ok("Password changed");
        }

        try {
            User user = accountService.getUserByPrincipal(principal);
            accountService.authenticate(user.getEmail(), passwordDto.oldPassword);
            accountService.changePassword(principal, passwordDto.newPassword);
            log.info("User {} changed password", user.getId());
            return ResponseEntity.ok("Password changed");
        } catch (AuthenticationException e) {
            // This should respond with 400 rather than 401 as user in fact is authenticated at this point
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Bad password");
        }
    }

    @PutMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody final SignupRequest signupRequest,
                                      final BindingResult binding,
                                      final HttpServletRequest request) {
        if (binding.hasErrors()) {
            String reason = binding.getFieldError().getDefaultMessage();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(reason);
        }

        try {
            User newUser = accountService.register(signupRequest.getUsername(), signupRequest.getPassword());
            final String appUrl = request.getServerName();
            eventPublisher.publishEvent(new SendEmailEvent(SendEmailEvent.EventType.RegistrationComplete, newUser, newUser.getEmail(), appUrl));
        } catch (EmailAlreadyRegisteredException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unknown error occurred");
        }

        return ResponseEntity.accepted().body("A verification email has been sent!");
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody final TokenRequest tokenRequest) {
        try {
            final String token = tokenService
                    .createAuthenticationToken(tokenRequest.getUsername(), tokenRequest.getPassword());
            final String encodedToken = Base64.getEncoder().encodeToString(token.getBytes());

            TokenResponse tr = new TokenResponse();
            tr.setToken(encodedToken);

            return ResponseEntity.ok(tr);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @Getter
    @Setter
    private static class EmailDto {
        @NotNull
        @Email(regexp = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", message = "Not a valid email")
        private String email;
    }

    @Getter
    @Setter
    private static class ChangePasswordDto {
        @SuppressWarnings("checkstyle:MagicNumber")
        @Length(min = 8, max = 32, message = "Password must be 8-32 characters")
        @Pattern(regexp = "^(?=.*[0-9]).*$", message = "Password must contain a digit")
        @Pattern(regexp = "^(?=.*[a-z]).*$", message = "Password must contain a lower case letter")
        @Pattern(regexp = "^(?=.*[A-Z]).*$", message = "Password must contain an upper case letter")
        @Pattern(regexp = "^(?=\\S+$).*$", message = "Password must not contain whitespaces")
        private String newPassword;
        private String oldPassword;
        private String token; //If password not supplied
    }

    private static class SignupRequest {

        @NotNull
        @Email(regexp = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", message = "Not a valid email")
        private String username;

        @SuppressWarnings("checkstyle:MagicNumber")
        @Length(min = 8, max = 32, message = "Password must be 8-32 characters")
        @Pattern(regexp = "^(?=.*[0-9]).*$", message = "Password must contain a digit")
        @Pattern(regexp = "^(?=.*[a-z]).*$", message = "Password must contain a lower case letter")
        @Pattern(regexp = "^(?=.*[A-Z]).*$", message = "Password must contain an upper case letter")
        @Pattern(regexp = "^(?=\\S+$).*$", message = "Password must not contain whitespaces")
        private String password;

        SignupRequest() {

        }

        public String getUsername() {
            return username;
        }

        public void setUsername(final String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(final String password) {
            this.password = password;
        }
    }

    private static class TokenRequest {
        @NotNull
        private String username;
        @NotNull
        private String password;

        TokenRequest() {

        }

        public String getUsername() {
            return username;
        }

        public void setUsername(final String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(final String password) {
            this.password = password;
        }
    }

    private static class TokenResponse {
        private String token;

        TokenResponse() {

        }

        public String getToken() {
            return token;
        }
        public void setToken(final String token) {
            this.token = token;
        }
    }
}
