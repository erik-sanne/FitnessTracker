package com.ersa.tracker;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.TestInfo;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.DEFINED_PORT;

@SpringBootTest(webEnvironment = DEFINED_PORT)
@DirtiesContext
@AutoConfigureMockMvc
public abstract class TestBase {
    static {
        System.setProperty("CLIENT_ORIGIN", "http://localhost:3000");
    }

    @BeforeEach
    void setUp(final TestInfo testInfo) {
        System.out.println("----------------------------------");
        System.out.printf("RUNNING TEST: %s%n", testInfo.getDisplayName());
    }

    @AfterEach
    void finish() {
        System.out.println("----------------------------------");
    }
}
