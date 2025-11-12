package org.example.jwtmanuellement.jwt;


import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.security.*;
import java.time.Instant;
import java.util.Base64;

public class JWTGenerator {

    public static String generateHMACToken(String payload) throws Exception {
        String headerBase64 = Base64URL.encodeString(JWTConstants.HMAC_HEADER);
        String payloadBase64 = Base64URL.encodeString(payload);
        String message = headerBase64 + "." + payloadBase64;

        // Sign with HMAC-SHA256
        Mac hmac = Mac.getInstance("HmacSHA256");
        SecretKeySpec keySpec = new SecretKeySpec(JWTConstants.HMAC_SECRET.getBytes(), "HmacSHA256");
        hmac.init(keySpec);
        byte[] signatureBytes = hmac.doFinal(message.getBytes());
        String signatureBase64 = Base64URL.encode(signatureBytes);

        return message + "." + signatureBase64;
    }

    public static String generateRSAToken(String payload, PrivateKey privateKey) throws Exception {
        String headerBase64 = Base64URL.encodeString(JWTConstants.RSA_HEADER);
        String payloadBase64 = Base64URL.encodeString(payload);
        String message = headerBase64 + "." + payloadBase64;

        // Sign with RSA-SHA256
        Signature signature = Signature.getInstance("SHA256withRSA");
        signature.initSign(privateKey);
        signature.update(message.getBytes());
        byte[] signatureBytes = signature.sign();
        String signatureBase64 = Base64URL.encode(signatureBytes);

        return message + "." + signatureBase64;
    }

    public static String createPayload(String subject, String role) {
        long iat = Instant.now().getEpochSecond();
        long exp = iat + JWTConstants.TOKEN_EXPIRATION_SECONDS;

        return String.format(
                "{\"sub\":\"%s\",\"role\":\"%s\",\"iat\":%d,\"exp\":%d}",
                subject, role, iat, exp
        );
    }

    public static KeyPair generateRSAKeyPair() throws Exception {
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");
        keyGen.initialize(2048);
        return keyGen.generateKeyPair();
    }

    public static boolean verifyHMACToken(String token) throws Exception {
        String[] parts = token.split("\\.");
        if (parts.length != 3) {
            return false;
        }

        String message = parts[0] + "." + parts[1];
        byte[] receivedSignature = Base64URL.decode(parts[2]);

        Mac hmac = Mac.getInstance("HmacSHA256");
        SecretKeySpec keySpec = new SecretKeySpec(JWTConstants.HMAC_SECRET.getBytes(), "HmacSHA256");
        hmac.init(keySpec);
        byte[] computedSignature = hmac.doFinal(message.getBytes());

        return MessageDigest.isEqual(computedSignature, receivedSignature);
    }

    public static boolean verifyRSAToken(String token, PublicKey publicKey) throws Exception {
        String[] parts = token.split("\\.");
        if (parts.length != 3) {
            return false;
        }

        String message = parts[0] + "." + parts[1];
        byte[] receivedSignature = Base64URL.decode(parts[2]);

        Signature signature = Signature.getInstance("SHA256withRSA");
        signature.initVerify(publicKey);
        signature.update(message.getBytes());

        return signature.verify(receivedSignature);
    }
}