package com.ersa.tracker.repositories.authentication;


import com.ersa.tracker.models.authentication.User;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Long> {
    User findByEmail(String email);
}
