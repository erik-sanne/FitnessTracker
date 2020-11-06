package com.ersa.tracker.controllers;

import com.ersa.tracker.services.UserManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;

import javax.validation.constraints.NotNull;

@RestController
public class AuthenticationController {
    UserManagementService userManager;

    @Autowired
    public AuthenticationController(UserManagementService userManager){
        this.userManager = userManager;
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateHeaders() {
        return ResponseEntity.ok("You are authenticated");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody TokenRequest request) {
        //TODO: Perform validation, change param
        userManager.register(request.getUsername(), request.getPassword());
        return ResponseEntity.ok("ok");
    }

    @PostMapping("/authenticate")
    public ResponseEntity<TokenResponse> createAuthenticationToken(@RequestBody TokenRequest tokenRequest) {
        if (userManager.authenticate(tokenRequest.getUsername(), tokenRequest.getPassword())) {
            final String token = userManager.createToken(tokenRequest.getUsername(), tokenRequest.getPassword());
            TokenResponse tr = new TokenResponse();
            tr.setToken(token);
            return ResponseEntity.ok(tr);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
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
