package com.ersa.tracker.security;

public class EmailAlreadyRegisteredException extends RuntimeException {
    public EmailAlreadyRegisteredException(String msg) {
        super(msg);
    }

    public EmailAlreadyRegisteredException() {
        super();
    }
}
