package com.lms.auth.application;

import com.lms.auth.config.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Set;
import java.util.UUID;

@Service
public class JwtService {

  private static final Logger log = LoggerFactory.getLogger(JwtService.class);
  private final JwtProperties jwtProperties;
  private final SecretKey secretKey;

  public JwtService(JwtProperties jwtProperties) {
    this.jwtProperties = jwtProperties;
    this.secretKey = Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8));
  }

  public String generateAccessToken(UUID userId, String email, Set<String> roles) {
    Instant now = Instant.now();
    Instant expiry = now.plusSeconds(jwtProperties.getAccessTokenExpiryMinutes() * 60L);
    String jti = UUID.randomUUID().toString();

    return Jwts.builder()
        .subject(userId.toString())
        .claim("email", email)
        .claim("roles", roles)
        .claim("jti", jti)
        .issuer(jwtProperties.getIssuer())
        .issuedAt(Date.from(now))
        .expiration(Date.from(expiry))
        .signWith(secretKey)
        .compact();
  }

  public Claims validateAndParseToken(String token) throws JwtException {
    return Jwts.parser()
        .verifyWith(secretKey)
        .build()
        .parseSignedClaims(token)
        .getPayload();
  }

  public Claims parseTokenWithoutValidation(String token) {
    try {
      // Parse without signature verification to get jti and exp for blacklist
      String[] parts = token.split("\\.");
      if (parts.length < 2) {
        throw new IllegalArgumentException("Invalid JWT token format");
      }

      // This is risky but needed for logout to extract jti from potentially expired
      // tokens
      // We only use this for extracting metadata, not for authentication
      return Jwts.parser()
          .unsecured()
          .build()
          .parseUnsecuredClaims(parts[0] + "." + parts[1] + ".")
          .getPayload();
    } catch (Exception e) {
      log.warn("Failed to parse JWT token without validation", e);
      throw new JwtException("Invalid token format");
    }
  }

  public long getAccessTokenExpirySeconds() {
    return jwtProperties.getAccessTokenExpiryMinutes() * 60L;
  }
}
