package org.example.jwtmanuellement.jwt;



import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.security.PublicKey;
import java.time.Instant;

public class JWTValidator {

    private static final ObjectMapper mapper = new ObjectMapper();

    public static JWTResult validateToken(String token, PublicKey publicKey) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                return JWTResult.MALFORMED;
            }

            // Decode header and payload
            String headerJson = Base64URL.decodeToString(parts[0]);
            String payloadJson = Base64URL.decodeToString(parts[1]);

            // Parse header to check algorithm
            JsonNode header = mapper.readTree(headerJson);
            String alg = header.get("alg").asText();

            // Verify signature based on algorithm
            boolean signatureValid;
            if ("HS256".equals(alg)) {
                signatureValid = JWTGenerator.verifyHMACToken(token);
            } else if ("RS256".equals(alg)) {
                signatureValid = JWTGenerator.verifyRSAToken(token, publicKey);
            } else {
                return JWTResult.MALFORMED;
            }

            if (!signatureValid) {
                return JWTResult.INVALID_SIGNATURE;
            }

            // Check expiration
            JsonNode payload = mapper.readTree(payloadJson);
            long exp = payload.get("exp").asLong();
            if (Instant.now().getEpochSecond() > exp) {
                return JWTResult.EXPIRED;
            }

            return JWTResult.VALID;

        } catch (Exception e) {
            return JWTResult.MALFORMED;
        }
    }
}