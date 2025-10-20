package org.example.inventoryservice;

import org.example.inventoryservice.entities.Product;
import org.example.inventoryservice.repositories.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.UUID;

@SpringBootApplication
public class InventoryServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(InventoryServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner comandLineRunner(ProductRepository productRepository) {
        return (args) -> {
            productRepository.save(new Product(UUID.randomUUID().toString(),10,15,"Pizza"));
            productRepository.save(new Product(UUID.randomUUID().toString(),200,25,"Hot Dog"));
            productRepository.save(new Product(UUID.randomUUID().toString(),2,5,"Zlafa"));
        };
    }

}
