package com.ersa.tracker.security.configurations;

import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.services.authentication.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebSecurity
@Log4j2
public class SecurityConfiguration {

    @Autowired
    public SecurityConfiguration(final AuthenticationService authenticationService, final AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(authenticationService);
    }

    @Bean
    protected SecurityFilterChain filterChain(final HttpSecurity http) throws Exception {
        http.cors(Customizer.withDefaults());
        http.headers(h -> h.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin));
        http.csrf(AbstractHttpConfigurer::disable);
        http.sessionManagement(conf -> conf.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        http.httpBasic(Customizer.withDefaults());

        http.exceptionHandling(conf ->
                conf.authenticationEntryPoint(new CommenceUnauthorized())
        );

        http.authorizeHttpRequests(conf -> conf
                .requestMatchers("/authenticate").permitAll()
                .requestMatchers("/confirmEmail/**").permitAll()
                .requestMatchers("/forgot-password").permitAll()
                .requestMatchers("/change-password").permitAll()
                .requestMatchers("/register").permitAll()
                .requestMatchers("/actuator/**").hasAnyAuthority(User.Permissions.ADMIN, User.Permissions.MODERATOR)
                .anyRequest().authenticated());

        http.logout(conf -> conf.logoutUrl("/logout")
                .permitAll());
        return http.build();
    }

    @Value("${CLIENT_ORIGIN}")
    private String allowedOrigin;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        final CorsConfiguration configuration = new CorsConfiguration();
        log.info("Initializing cors policy for origin {}", allowedOrigin);
        configuration.setAllowedOrigins(Collections.singletonList(allowedOrigin));
        configuration.setAllowedMethods(Arrays.asList("HEAD", "GET", "POST", "PUT", "DELETE", "PATCH"));
        configuration.setAllowCredentials(true);
        // Needed. Otherwise will fail with 403 Invalid CORS request
        configuration.setAllowedHeaders(Arrays.asList(
                "Authorization",
                "Cache-Control",
                "Content-Type",
                "Origin",
                "Accept",
                "X-Requested-With"));
        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    private static class CommenceUnauthorized implements AuthenticationEntryPoint {
        @Override
        public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        }
    }
}
