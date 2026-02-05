package com.lms.auth.api;

import com.lms.auth.application.AuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "Endpoints for token management and session verification")
public class AuthController {

  private static final Logger log = LoggerFactory.getLogger(AuthController.class);

  private final AuthenticationService authenticationService;

  public AuthController(AuthenticationService authenticationService) {
    this.authenticationService = authenticationService;
  }

  @PostMapping("/token")
  @Operation(summary = "Generate access token", description = "Authenticates user and returns access and refresh tokens")
  public ResponseEntity<TokenResponse> token(
      @RequestParam(value = "grant_type", required = false) String grantTypeParam,
      @RequestParam(value = "username", required = false) String usernameParam,
      @RequestParam(value = "password", required = false) String passwordParam,
      @RequestParam(value = "refresh_token", required = false) String refreshTokenParam) {

    String grantType = grantTypeParam;
    String username = usernameParam;
    String password = passwordParam;
    String refreshToken = refreshTokenParam;

    if (grantType == null) {
      return ResponseEntity.badRequest().build();
    }

    // Handle password grant (login)
    if ("password".equals(grantType)) {
      if (username == null || password == null) {
        return ResponseEntity.badRequest().build();
      }
      log.info("Login request for username: {}", username);

      AuthenticationService.AuthenticationResult result = authenticationService.authenticate(username, password);

      TokenResponse response = new TokenResponse(
          result.accessToken(),
          result.expiresIn(),
          result.refreshToken());

      return ResponseEntity.ok(response);
    }

    // Handle refresh_token grant
    if ("refresh_token".equals(grantType)) {
      if (refreshToken == null) {
        return ResponseEntity.badRequest().build();
      }
      log.info("Token refresh request");

      AuthenticationService.AuthenticationResult result = authenticationService.refreshAccessToken(refreshToken);

      TokenResponse response = new TokenResponse(
          result.accessToken(),
          result.expiresIn(),
          result.refreshToken());

      return ResponseEntity.ok(response);
    }

    return ResponseEntity.badRequest().build();
  }

  @PostMapping("/login")
  public ResponseEntity<TokenResponse> login(@Valid @RequestBody LoginRequest request) {
    log.info("Login request for email: {}", request.email());

    AuthenticationService.AuthenticationResult result = authenticationService.authenticate(request.email(),
        request.password());

    TokenResponse response = new TokenResponse(
        result.accessToken(),
        result.expiresIn(),
        result.refreshToken());

    return ResponseEntity.ok(response);
  }

  @PostMapping("/logout")
  public ResponseEntity<Void> logout(
      @RequestHeader(value = "Authorization", required = false) String authHeader,
      @RequestBody(required = false) LogoutRequest request) {

    log.info("Logout request");

    String accessToken = null;
    if (authHeader != null && authHeader.startsWith("Bearer ")) {
      accessToken = authHeader.substring(7);
    }

    String refreshToken = null;
    if (request != null && request.refresh_token() != null) {
      refreshToken = request.refresh_token();
    }

    authenticationService.logout(accessToken, refreshToken);

    return ResponseEntity.noContent().build();
  }

  @GetMapping("/me")
  public ResponseEntity<IntrospectResponse> introspect(
      @RequestHeader(value = "Authorization", required = false) String authHeader) {

    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    String accessToken = authHeader.substring(7);

    AuthenticationService.IntrospectionResult result = authenticationService.introspectToken(accessToken);

    if (!result.active()) {
      IntrospectResponse response = new IntrospectResponse(
          false, null, null, 0, 0, null);
      return ResponseEntity.ok(response);
    }

    Set<String> roles = new HashSet<>();
    Object rolesObj = result.claims().get("roles");
    if (rolesObj instanceof Collection<?>) {
      for (Object role : (Collection<?>) rolesObj) {
        if (role != null) {
          roles.add(role.toString());
        }
      }
    } else if (rolesObj != null) {
      roles.add(rolesObj.toString());
    }

    IntrospectResponse response = new IntrospectResponse(
        true,
        result.claims().getSubject(),
        roles,
        result.claims().getExpiration().toInstant().getEpochSecond(),
        result.claims().getIssuedAt().toInstant().getEpochSecond(),
        result.claims().get("email", String.class));

    return ResponseEntity.ok(response);
  }
}
