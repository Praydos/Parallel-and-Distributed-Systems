package org.example.keynoteservice;

import org.example.keynoteservice.entities.Keynote;
import org.example.keynoteservice.repositories.KeynoteRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.List;

@SpringBootApplication
public class KeynoteServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(KeynoteServiceApplication.class, args);
    }


    @Bean
    CommandLineRunner commandLineRunner(KeynoteRepository repository) {
        return args -> {
            repository.save(new Keynote(null,"anas","chafik","anas@email","fct1"));
            repository.save(new Keynote(null,"yassin","bodhim","yassine@email","fct1"));
            repository.save(new Keynote(null,"mohh","assel","assel@email","fct2"));

            List<Keynote> keynotes = repository.findAll();
            for(Keynote keynote : keynotes) {
                System.out.println("================");
                System.out.println(keynote.toString());
            }

        };
    }

}
