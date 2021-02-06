package com.ersa.tracker;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class ApplicationTests extends TestBase {

    static {
        System.setProperty("CLIENT_ORIGIN", "http://localhost:3000");
    }

    @Test
    @DisplayName("Context loads properly")
    void contextLoads() {
    }
}
