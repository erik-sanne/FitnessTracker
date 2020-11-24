package com.ersa.tracker;

import com.ersa.tracker.services.authentication.AccountService;
import com.ersa.tracker.services.authentication.AuthenticationService;
import com.ersa.tracker.services.authentication.EmailVerificationService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@AutoConfigureMockMvc
public class ControllerLayerTests {
    static {
        System.setProperty("CLIENT_ORIGIN", "http://localhost:3000");
    }

    private static final int DAY_IN_MS = 1000 * 60 * 60 * 24;
    @Autowired
    private TestRestTemplate template;

    @Autowired
    private MockMvc mockMvc;

    private static final String MOCK_UN = "testing";
    private static final String MOCK_PW = "testing";
    private static final String MOCK_TOKEN_STR = UUID.randomUUID().toString();
    private static final String MOCK_TOKEN_HASH = new BCryptPasswordEncoder().encode(MOCK_TOKEN_STR);
    private static final String MOCK_TOKEN = String.format("%s:%s", MOCK_UN, MOCK_TOKEN_STR);
    private static final String TOKEN_RESPONSE = Base64.getEncoder().encodeToString(MOCK_TOKEN.getBytes());
    private static final String MOCK_AUTH_HEADER = "Basic " + TOKEN_RESPONSE;

    @MockBean
    private AuthenticationService authenticationService;
    @MockBean
    private AccountService accountService;
    @MockBean
    private EmailVerificationService emailVerificationService;

    @PostConstruct
    public void setUp() {

        Mockito.when(authenticationService.createAuthenticationToken(MOCK_UN, MOCK_PW)).thenReturn(MOCK_TOKEN);
        Mockito.when(authenticationService.loadUserByUsername(MOCK_UN)).thenReturn(
                new User(
                        MOCK_UN,
                        MOCK_TOKEN_HASH,
                        new ArrayList<>()
                ));
    }

    @Test
    public void testVerifyInvalidToken() throws Exception {
        final String expiredTokenMock = "<<trash>>";
        this.mockMvc.perform(get("/validate")
                .header("Authorization", expiredTokenMock).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void testAuthenticationWithValidCredentials() throws Exception {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("username", MOCK_UN);
        requestBody.put("password", MOCK_PW);

        this.mockMvc.perform(
                post("/authenticate").content(asJson(requestBody)).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()).andExpect(content().string(containsString(TOKEN_RESPONSE)));
    }

    @Test
    public void testVerifyValidToken() throws Exception {
        this.mockMvc.perform(get("/validate")
                .header("Authorization", MOCK_AUTH_HEADER).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    private static String asJson(final Object object) throws JsonProcessingException {
        return new ObjectMapper().writeValueAsString(object);
    }
}
