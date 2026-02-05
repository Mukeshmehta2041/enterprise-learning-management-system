package com.lms.auth;

import com.lms.auth.api.AuthController;
import com.lms.auth.application.AuthenticationService;
import com.lms.auth.api.TokenResponse;
import io.restassured.module.mockmvc.RestAssuredMockMvc;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
public abstract class ContractTestBase {

  @Autowired
  private WebApplicationContext context;

  @MockBean
  private AuthenticationService authenticationService;

  @BeforeEach
  public void setup() {
    RestAssuredMockMvc.webAppContextSetup(context);

    AuthenticationService.AuthenticationResult authResult = new AuthenticationService.AuthenticationResult(
        "some-access-token",
        "some-refresh-token",
        900L);

    when(authenticationService.authenticate("user", "pass"))
        .thenReturn(authResult);
  }
}
