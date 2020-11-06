package com.ersa.tracker.services;

import com.ersa.tracker.models.User;
import com.ersa.tracker.models.UserToken;
import com.ersa.tracker.repositories.TokenRepository;
import com.ersa.tracker.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;

@Service
public class UserManagementService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TokenRepository tokenRepository;
    @Autowired
    private PasswordEncoder pwEncoder;

    public void register(String username, String password) {
        User user = new User();

        user.setEmail(username);
        user.setPassword(pwEncoder.encode(password));
        user.setPermissionLevel(User.Permissions.BASIC);
        userRepository.save(user);
    }

    public boolean authenticate(String username, String password) {
        User user = userRepository.findByEmail(username);
        return pwEncoder.matches(password, user.getPassword());
    }

    @Transactional
    public String createToken(String username, String password) {
        User user = userRepository.findByEmail(username);

        final String token = pwEncoder.encode(user.getPassword());
        final String token_hash = pwEncoder.encode(token);
        final String tokenString = String.format("%s:%s", username, token);

        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DATE, 1);
        final Date expires = cal.getTime();

        UserToken sessionToken = new UserToken();
        sessionToken.setToken(token_hash);
        sessionToken.setExpiration(expires);
        tokenRepository.save(sessionToken);

        user.setToken(sessionToken);

        userRepository.save(user);

        return tokenString;
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email);

        Collection<GrantedAuthority> permissions = Arrays.asList(new SimpleGrantedAuthority(user.getPermissionLevel()));

        UserToken token = user.getToken();

        final String tokenString = token.getToken();

        if (new Date().after(token.getExpiration())) {
            user.setToken(null);
            userRepository.save(user);
            tokenRepository.delete(token);

            UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                    user.getEmail(),
                    null,
                    true,
                    true,
                    false,
                    true,
                    permissions
            );

            return userDetails;
        }

        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                tokenString,
                permissions
        );

        return userDetails;
    }
}
