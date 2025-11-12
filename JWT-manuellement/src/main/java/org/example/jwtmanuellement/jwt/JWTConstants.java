package org.example.jwtmanuellement.jwt;

public class JWTConstants {
    public static final String HMAC_HEADER = "{\"alg\":\"HS256\",\"typ\":\"JWT\"}";
    public static final String RSA_HEADER = "{\"alg\":\"RS256\",\"typ\":\"JWT\"}";
    public static final String HMAC_SECRET = "my-super-secret-hmac-key-12345";
    public static final int TOKEN_EXPIRATION_SECONDS = 300;
}