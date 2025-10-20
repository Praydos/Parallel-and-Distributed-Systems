package com.example.bankmicroservice;

import com.example.bankmicroservice.entities.BankAccount;
import com.example.bankmicroservice.enums.AcountType;
import com.example.bankmicroservice.repositories.BankAcountRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.Date;
import java.util.UUID;

@SpringBootApplication
public class BankMicroServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(BankMicroServiceApplication.class, args);
    }
    @Bean
    CommandLineRunner start(BankAcountRepository repository) {
        return args -> {
            for(int i=0;i<10;i++) {
                BankAccount bankAccount = BankAccount.builder()
                        .id(UUID.randomUUID().toString())
                        .type(Math.random()>0.5? AcountType.CURRENT_ACOUNT:AcountType.SAVING_ACOUNT)
                        .balance(10000+Math.random()*90000)
                        .createDate(new Date())
                        .currency("MAD")
                        .build();
                repository.save(bankAccount);
            }

        };
    }

}
