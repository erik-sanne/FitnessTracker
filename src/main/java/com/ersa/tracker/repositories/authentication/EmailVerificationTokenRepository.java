package com.ersa.tracker.repositories.authentication;

import com.ersa.tracker.models.authentication.EmailVerificationToken;
import org.springframework.data.repository.CrudRepository;

public interface EmailVerificationTokenRepository extends CrudRepository<EmailVerificationToken, Long> {
    EmailVerificationToken findByToken(String token);
}
