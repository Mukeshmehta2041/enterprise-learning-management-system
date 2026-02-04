package com.lms.auth.application;

import com.lms.auth.domain.RefreshTokenData;
import com.lms.auth.domain.UserCredentials;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;
import java.util.Set;

@Service
public class AuthenticationService {

  private static final Logger log = LoggerFactory.getLogger(AuthenticationService.class);

  private final UserServiceClient userServiceClient;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final RefreshTokenService refreshTokenService;
  private final TokenBlacklistService tokenBlacklistService;

  public AuthenticationService(UserServiceClient userServiceClient,
      PasswordEncoder passwordEncoder,
      JwtService jwtService,
      RefreshTokenService refreshTokenService,
      TokenBlacklistService tokenBlacklistService) {
    this.userServiceClient = userServiceClient;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
    this.refreshTokenService = refreshTokenService;
    this.tokenBlacklistService = tokenBlacklistService;
  }

  public AuthenticationResult authenticate(String email, String password) {
    // Fetch user credentials from User Service
    UserCredentials credentials = userServiceClient.getUserByEmail(email);

    if (credentials == null) {
      log.warn("Authentication failed: user not found for email: {}", email);
      throw new InvalidCredentialsException("Invalid credentials");
    }

    String passwordHash = credentials.getPasswordHash();
    if (passwordHash == null || passwordHash.isBlank()) {
      log.warn("Authentication failed: no password hash for email: {}", email);
      throw new InvalidCredentialsException("Invalid credentials");
    }

    // Verify password
    if (!passwordEncoder.matches(password, passwordHash)) {
      log.warn("Authentication failed: invalid password for email: {}", email);
      throw new InvalidCredentialsException("Invalid credentials");
    }

    // Check user status
    if (!"ACTIVE".equals(credentials.getStatus())) {
      log.warn("Authentication failed: user is not active: {}", email);
      throw new InvalidCredentialsException("User account is not active");
    }

    // Generate tokens (use empty set if roles null)
    Set<String> roles = credentials.getRoles() != null ? credentials.getRoles() : Set.of();
    String accessToken = jwtService.generateAccessToken(
        credentials.getUserId(),
        credentials.getEmail(),
        roles);

    String refreshToken = refreshTokenService.createRefreshToken(
        credentials.getUserId(),
        credentials.getEmail());

    log.info("User authenticated successfully: {}", email);

    return new AuthenticationResult(
        accessToken,
        refreshToken,
        jwtService.getAccessTokenExpirySeconds());
  }

  public AuthenticationResult refreshAccessToken(String refreshTokenId) {
    // Validate refresh token
    RefreshTokenData tokenData = refreshTokenService.getRefreshToken(refreshTokenId);

    if (tokenData == null) {
      log.warn("Refresh token not found or expired: {}", refreshTokenId);
      throw new InvalidTokenException("Invalid or expired refresh token");
    }

    // Check if token is expired
    if (tokenData.getExpiresAt().isBefore(Instant.now())) {
      log.warn("Refresh token expired: {}", refreshTokenId);
      refreshTokenService.revokeRefreshToken(refreshTokenId);
      throw new InvalidTokenException("Refresh token expired");
    }

    // Fetch latest user data to get current roles
    UserCredentials credentials = userServiceClient.getUserByEmail(tokenData.getEmail());

    if (credentials == null || !"ACTIVE".equals(credentials.getStatus())) {
      log.warn("User not found or inactive during token refresh: {}", tokenData.getEmail());
      throw new InvalidTokenException("User account is not active");
    }

    Set<String> rolesForRefresh = credentials.getRoles() != null ? credentials.getRoles() : Set.of();
    // Generate new access token
    String accessToken = jwtService.generateAccessToken(
        credentials.getUserId(),
        credentials.getEmail(),
        rolesForRefresh);

    // Rotate refresh token (delete old, create new)
    String newRefreshToken = refreshTokenService.rotateRefreshToken(
        refreshTokenId,
        credentials.getUserId(),
        credentials.getEmail());

    log.info("Access token refreshed for user: {}", credentials.getEmail());

    return new AuthenticationResult(
        accessToken,
        newRefreshToken,
        jwtService.getAccessTokenExpirySeconds());
  }

  public void logout(String accessToken, String refreshTokenId) {
    // Blacklist access token if provided
    if (accessToken != null && !accessToken.isBlank()) {
      try {
        Claims claims = jwtService.parseTokenWithoutValidation(accessToken);
        String jti = claims.get("jti", String.class);
        Date expiration = claims.getExpiration();

        if (jti != null && expiration != null) {
          tokenBlacklistService.blacklistToken(jti, expiration.toInstant());
          log.debug("Access token blacklisted: {}", jti);
        }
      } catch (Exception e) {
        log.warn("Failed to blacklist access token during logout", e);
      }
    }

    // Revoke refresh token if provided
    if (refreshTokenId != null && !refreshTokenId.isBlank()) {
      refreshTokenService.revokeRefreshToken(refreshTokenId);
      log.debug("Refresh token revoked: {}", refreshTokenId);
    }

    log.info("User logged out successfully");
  }

  public IntrospectionResult introspectToken(String accessToken) {
    try {
      Claims claims = jwtService.validateAndParseToken(accessToken);
      String jti = claims.get("jti", String.class);

      // Check if token is blacklisted
      if (jti != null && tokenBlacklistService.isBlacklisted(jti)) {
        log.debug("Token is blacklisted: {}", jti);
        return new IntrospectionResult(false, null);
      }

      return new IntrospectionResult(true, claims);
    } catch (JwtException e) {
      log.debug("Token validation failed: {}", e.getMessage());
      return new IntrospectionResult(false, null);
    }
  }

  public record AuthenticationResult(String accessToken, String refreshToken, long expiresIn) {
  }

  public record IntrospectionResult(boolean active, Claims claims) {
  }

  public static class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException(String message) {
      super(message);
    }
  }

  public static class InvalidTokenException extends RuntimeException {
    public InvalidTokenException(String message) {
      super(message);
    }
  }
}
