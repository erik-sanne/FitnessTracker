package com.ersa.tracker.security.exceptions;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(final String msg)  {
        super(msg);
    }

    public ResourceNotFoundException() {
        super("Resource not found");
    }
}
