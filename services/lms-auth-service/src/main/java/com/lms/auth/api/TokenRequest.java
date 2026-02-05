package com.lms.auth.api;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

/**
 * Generic token request that supports both password and refresh_token grants.
 * Can be used with both form-encoded and JSON requests.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record TokenRequest(
    @NotBlank(message = "Grant type is required") @JsonProperty("grant_type") String grant_type,

    @JsonProperty("username") @JsonAlias("email") String username,

    @JsonProperty("password") String password,

    @JsonProperty("refresh_token") String refresh_token) {
}
