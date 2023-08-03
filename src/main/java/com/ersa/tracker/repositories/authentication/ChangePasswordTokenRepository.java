package com.ersa.tracker.repositories.authentication;

import com.ersa.tracker.models.authentication.ChangePasswordToken;
import com.ersa.tracker.models.authentication.EmailVerificationToken;
import org.springframework.data.repository.CrudRepository;

public interface ChangePasswordTokenRepository extends CrudRepository<ChangePasswordToken, Long> {
    ChangePasswordToken findByToken(String token);
}
