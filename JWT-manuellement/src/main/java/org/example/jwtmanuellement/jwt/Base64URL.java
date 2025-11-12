package org.example.jwtmanuellement.jwt;


import java.util.Base64;

public class Base64URL {

    public static String encode(byte[] data) {
        String base64 = Base64.getEncoder().encodeToString(data);
        String base64URL = base64
                .replace('+', '-')
                .replace('/', '_')
                .replace("=", "");
        return base64URL;
    }

    public static byte[] decode(String base64URL) {
        String base64 = base64URL
                .replace('-', '+')
                .replace('_', '/');

        // Add padding if necessary
        int padding = 4 - (base64.length() % 4);
        if (padding != 4) {
            base64 += "=".repeat(padding);
        }

        return Base64.getDecoder().decode(base64);
    }

    public static String encodeString(String data) {
        return encode(data.getBytes());
    }

    public static String decodeToString(String base64URL) {
        return new String(decode(base64URL));
    }

    // Test method as requested
    public static void test() {
        String original = "Hello World+/=";
        String encoded = encode(original.getBytes());
        String decoded = new String(decode(encoded));

        System.out.println("=== Base64URL Test ===");
        System.out.println("Original: " + original);
        System.out.println("Encoded: " + encoded);
        System.out.println("Decoded: " + decoded);
        System.out.println("Success: " + original.equals(decoded));
        System.out.println("No +/ in encoded: " +
                (!encoded.contains("+") && !encoded.contains("/") && !encoded.contains("=")));
        System.out.println();
    }
}