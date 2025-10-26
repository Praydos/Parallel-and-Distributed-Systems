package org.example.billingservice.repositories;

import org.example.billingservice.entities.Bill;
import org.springframework.data.jpa.repository.JpaRepository;


public interface BillRepository extends JpaRepository<Bill, Long> {
}
