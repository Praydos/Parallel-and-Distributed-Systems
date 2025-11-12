package org.example.jwtmanuellement.jwt;

public enum JWTResult {
    VALID,
    INVALID_SIGNATURE,
    EXPIRED,
    MALFORMED
}