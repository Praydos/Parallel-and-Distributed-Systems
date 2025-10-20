package com.example.bankmicroservice.repositories;

import com.example.bankmicroservice.entities.BankAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource
public interface BankAcountRepository extends JpaRepository<BankAccount,String> {
    List<BankAccount> findByCurrency(String currency);
}
