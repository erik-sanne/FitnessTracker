package com.ersa.tracker.repositories;

import com.ersa.tracker.models.UserToken;
import org.springframework.data.repository.CrudRepository;

public interface TokenRepository extends CrudRepository<UserToken, Long> {
}
