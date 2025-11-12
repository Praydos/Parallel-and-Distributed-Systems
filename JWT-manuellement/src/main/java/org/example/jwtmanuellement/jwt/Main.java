package org.example.jwtmanuellement.jwt;


import java.security.KeyPair;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.time.Instant;

public class Main {

    public static void main(String[] args) throws Exception {
        System.out.println("=== JWT Manual Implementation ===\n");

        // 1. Test Base64URL encoding/decoding
        Base64URL.test();

        // Generate RSA key pair
        KeyPair keyPair = JWTGenerator.generateRSAKeyPair();
        PrivateKey privateKey = keyPair.getPrivate();
        PublicKey publicKey = keyPair.getPublic();

        // Create payload
        String payload = JWTGenerator.createPayload("ahmed", "admin");
        System.out.println("=== Payload ===");
        System.out.println(payload);
        System.out.println();

        // 2. Generate HMAC token
        String hmacToken = JWTGenerator.generateHMACToken(payload);
        System.out.println("=== HMAC Token ===");
        System.out.println(hmacToken);
        System.out.println();

        // 3. Generate RSA token
        String rsaToken = JWTGenerator.generateRSAToken(payload, privateKey);
        System.out.println("=== RSA Token ===");
        System.out.println(rsaToken);
        System.out.println();

        // 4. Validation tests
        System.out.println("=== Validation Tests ===");

        // Test HMAC validation
        JWTResult hmacResult = JWTValidator.validateToken(hmacToken, publicKey);
        System.out.println("HMAC Token: " + hmacResult);

        // Test RSA validation
        JWTResult rsaResult = JWTValidator.validateToken(rsaToken, publicKey);
        System.out.println("RSA Token: " + rsaResult);
        System.out.println();

        // 5. Test cases as required
        System.out.println("=== Security Tests ===");

        // Test 1: Modify payload character
        String modifiedPayload = payload.replace("admin", "xdmin");
        String modifiedHmacToken = JWTGenerator.generateHMACToken(modifiedPayload);
        JWTResult test1 = JWTValidator.validateToken(modifiedHmacToken, publicKey);
        System.out.println("Modified payload: " + test1);

        // Test 2: Modify signature character
        String modifiedSignatureToken = hmacToken.substring(0, hmacToken.length() - 1) + "X";
        JWTResult test2 = JWTValidator.validateToken(modifiedSignatureToken, publicKey);
        System.out.println("Modified signature: " + test2);

        // Test 3: Different HMAC secret (simulated by generating with different secret)
        // This would require modifying the JWTGenerator temporarily

        // Test 4: Wrong RSA public key
        KeyPair wrongKeyPair = JWTGenerator.generateRSAKeyPair();
        JWTResult test4 = JWTValidator.validateToken(rsaToken, wrongKeyPair.getPublic());
        System.out.println("Wrong RSA public key: " + test4);

        // Test 5: Expired token
        String expiredPayload = String.format(
                "{\"sub\":\"ahmed\",\"role\":\"admin\",\"iat\":%d,\"exp\":%d}",
                Instant.now().getEpochSecond() - 400,  // iat 400 seconds ago
                Instant.now().getEpochSecond() - 100   // exp 100 seconds ago
        );
        String expiredToken = JWTGenerator.generateHMACToken(expiredPayload);
        JWTResult test5 = JWTValidator.validateToken(expiredToken, publicKey);
        System.out.println("Expired token: " + test5);

        System.out.println("\n=== All tests completed ===");
    }
}