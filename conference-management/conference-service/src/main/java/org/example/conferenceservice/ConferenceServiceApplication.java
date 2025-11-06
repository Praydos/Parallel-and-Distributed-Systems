package org.example.conferenceservice;

import org.example.conferenceservice.entities.Conference;
import org.example.conferenceservice.entities.Review;
import org.example.conferenceservice.repositories.ConferenceRepository;
import org.example.conferenceservice.repositories.ReviewRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.Date;
import java.util.List;

@SpringBootApplication
public class ConferenceServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ConferenceServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner commandLineRunner(ConferenceRepository cr, ReviewRepository rr) {
        return args -> {
            Conference conference1 = Conference.builder()
                    .titre("Spring Boot Conference")
                    .type("Académique")
                    .date(new Date())
                    .duree("2h")
                    .score(4)
                    .build();

            Review review1 = Review.builder()
                    .date(new Date())
                    .text("Excellent conference with great insights about Spring Boot!")
                    .note(5)
                    .conference(conference1)
                    .build();

            conference1.setReviews(List.of(review1));
            //rr.save(review1);
            cr.save(conference1);

            // Create Conference 2 with Review
            Conference conference2 = Conference.builder()
                    .titre("Microservices Architecture")
                    .type("Commerciale")
                    .date(new Date(System.currentTimeMillis() + 86400000)) // Tomorrow
                    .duree("1h30")
                    .score(5)
                    .build();

            Review review2 = Review.builder()
                    .date(new Date())
                    .text("Very informative session about microservices patterns.")
                    .note(4)
                    .conference(conference2)
                    .build();

            conference2.setReviews(List.of(review2));

            //rr.save(review2);
            cr.save(conference2);

            // Create Conference 3 with Review
            Conference conference3 = Conference.builder()
                    .titre("Cloud Native Applications")
                    .type("Académique")
                    .date(new Date(System.currentTimeMillis() + 172800000)) // Day after tomorrow
                    .duree("3h")
                    .score(4)
                    .build();

            Review review3 = Review.builder()
                    .date(new Date())
                    .text("Comprehensive coverage of cloud technologies and best practices.")
                    .note(5)
                    .conference(conference3)
                    .build();
            Review review3_2 = Review.builder()  // Second review for conference3
                    .date(new Date())
                    .text("Amazing insights into cloud native development!")
                    .note(5)
                    .conference(conference3)
                    .build();

            conference3.setReviews(List.of(review3, review3_2));

            //rr.save(review3);
            cr.save(conference3);



        };


    }

}
