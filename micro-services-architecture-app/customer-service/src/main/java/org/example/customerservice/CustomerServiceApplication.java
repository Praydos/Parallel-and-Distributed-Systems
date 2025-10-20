package org.example.customerservice;

import org.example.customerservice.entities.Customer;
import org.example.customerservice.repositories.CustomerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class CustomerServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(CustomerServiceApplication.class, args);
    }

    @Bean
    public CommandLineRunner command(CustomerRepository repository) {
        return args -> {
            repository.save(Customer.builder().name("anas").email("anas@email").build());
            repository.save(Customer.builder().name("iman").email("iman@email").build());
            repository.save(Customer.builder().name("salma").email("salma@email").build());

            repository.findAll().forEach(c->{
                System.out.println("==========================");
                System.out.println(c.toString());
                System.out.println("==========================");

            });
        };
    }

}
