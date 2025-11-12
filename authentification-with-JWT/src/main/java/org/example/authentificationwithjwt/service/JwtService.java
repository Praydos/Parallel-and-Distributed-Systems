package org.example.authentificationwithjwt.service;

@Service
public class JwtService {
    private final Key key;
    private final long expirationMs;
    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-ms}") long expirationMs
    ) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.expirationMs = expirationMs;
    }
    public String generateToken(String username, Map<String, Object> claims) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expirationMs);
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return parse(token).getBody().getSubject();
    }
    public boolean isTokenValid(String token, String username) {
        try {
            return extractUsername(token).equals(username) && !isExpired(token);
        } catch (JwtException e) {
            return false;
        }
    }
    private boolean isExpired(String token) {
        return parse(token).getBody().getExpiration().before(new Date());
    }
    private Jws<Claims> parse(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
    }
}