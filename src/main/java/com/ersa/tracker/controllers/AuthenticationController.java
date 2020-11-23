package com.ersa.tracker.controllers;

import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.security.exceptions.EmailAlreadyRegisteredException;
import com.ersa.tracker.security.OnRegistrationCompleteEvent;
import com.ersa.tracker.security.exceptions.ResourceNotFoundException;
import com.ersa.tracker.services.authentication.AccountService;
import com.ersa.tracker.services.authentication.AuthenticationService;
import com.ersa.tracker.services.authentication.EmailVerificationService;
import org.hibernate.validator.constraints.Length;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailSendException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import java.util.Base64;

@RestController
public class AuthenticationController {

    private EmailVerificationService emaiLService;
    private AccountService accountService;
    private AuthenticationService tokenService;

    private ApplicationEventPublisher eventPublisher;

    @Autowired
    public AuthenticationController(EmailVerificationService emaiLService,
                                    AccountService accountService,
                                    AuthenticationService tokenService,
                                    ApplicationEventPublisher eventPublisher){
        this.emaiLService = emaiLService;
        this.accountService = accountService;
        this.tokenService = tokenService;
        this.eventPublisher = eventPublisher;
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateHeaders() {
        return ResponseEntity.ok("You are authenticated");
    }

    @GetMapping("/confirmEmail/{token}")
    public ResponseEntity<?> confirmEmail(@PathVariable String token) {
        try {
            emaiLService.verifyEmail(token);
            return ResponseEntity.ok("Verified");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @PutMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody SignupRequest signupRequest, BindingResult binding, HttpServletRequest request) {
        if (binding.hasErrors()) {
            String reason = binding.getFieldError().getDefaultMessage();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(reason);
        }

        try {
            User newUser = accountService.register(signupRequest.getUsername(), signupRequest.getPassword());
            final String appUrl = request.getContextPath();
            eventPublisher.publishEvent(new OnRegistrationCompleteEvent(newUser, appUrl));
        } catch (EmailAlreadyRegisteredException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (MailSendException e) {
            // TODO: Verify that this clause is still relevant
            return ResponseEntity.accepted().body("User created");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unknown error occurred");
        }

        return ResponseEntity.accepted().body("A verification email has been sent!");
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody TokenRequest tokenRequest) {
        try {
            final String token = tokenService.createAuthenticationToken(tokenRequest.getUsername(), tokenRequest.getPassword());
            final String encoded_token = Base64.getEncoder().encodeToString(token.getBytes());

            TokenResponse tr = new TokenResponse();
            tr.setToken(encoded_token);

            return ResponseEntity.ok(tr);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    private static class SignupRequest {

        @NotNull
        @Email(regexp = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", message = "Not a valid email")
        private String username;

        @Length(min = 8, max = 32, message = "Password must be 8-32 characters")
        @Pattern(regexp = "^(?=.*[0-9]).*$", message = "Password must contain a digit")
        @Pattern(regexp = "^(?=.*[a-z]).*$", message = "Password must contain a lower case letter")
        @Pattern(regexp = "^(?=.*[A-Z]).*$", message = "Password must contain an upper case letter")
        @Pattern(regexp = "^(?=\\S+$).*$", message = "Password must not contain whitespaces")
        private String password;

        public SignupRequest() {

        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    private static class TokenRequest {
        @NotNull
        private String username;
        @NotNull
        private String password;

        public TokenRequest() {

        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    private static class TokenResponse {
        private String token;

        public TokenResponse(){

        }

        public String getToken() {
            return token;
        }
        public void setToken(String token) {
            this.token = token;
        }
    }
}
