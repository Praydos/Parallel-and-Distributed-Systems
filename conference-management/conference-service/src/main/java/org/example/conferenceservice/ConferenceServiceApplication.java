package org.example.conferenceservice;

import org.example.conferenceservice.entities.Conference;
import org.example.conferenceservice.repositories.ConferenceRepository;
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
    CommandLineRunner commandLineRunner(ConferenceRepository cr) {
        return args -> {
            cr.save(new Conference(null,"title","type1",new Date(),"2h",3));
            cr.save(new Conference(null,"title","type2",new Date(),"1h",4));
            cr.save(new Conference(null,"title","type3",new Date(),"30min",5));

            List<Conference> conferences = cr.findAll();
            for(Conference conference : conferences) {
                System.out.println("=====================");
                System.out.println(conference.toString());
            }
        };


    }

}
