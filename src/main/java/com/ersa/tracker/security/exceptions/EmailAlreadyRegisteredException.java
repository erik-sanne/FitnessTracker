package com.ersa.tracker.security.exceptions;

public class EmailAlreadyRegisteredException extends RuntimeException {
    public EmailAlreadyRegisteredException(final String msg) {
        super(msg);
    }

    public EmailAlreadyRegisteredException() {
        super();
    }
}
