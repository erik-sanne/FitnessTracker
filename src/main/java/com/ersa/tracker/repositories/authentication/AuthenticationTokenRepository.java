package com.ersa.tracker.repositories.authentication;

import com.ersa.tracker.models.authentication.UserToken;
import org.springframework.data.repository.CrudRepository;

public interface AuthenticationTokenRepository extends CrudRepository<UserToken, Long> {
}
