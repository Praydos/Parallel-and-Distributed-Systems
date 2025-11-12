package org.example.conferenceservice.config;

import org.example.conferenceservice.entities.Conference;
import org.example.conferenceservice.entities.Review;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class RestRepositoryConfig implements RepositoryRestConfigurer {

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        // Exposition des IDs
        config.exposeIdsFor(Conference.class);
        config.exposeIdsFor(Review.class);

        // Configuration CORS COMPLÈTE pour Conference Service
        cors.addMapping("/**")
                .allowedOrigins(
                        "http://localhost:8000",
                        "http://127.0.0.1:8000",
                        "http://localhost:5500",
                        "http://127.0.0.1:5500"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}