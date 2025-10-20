package org.example.inventoryservice.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

@Entity @AllArgsConstructor @NoArgsConstructor @ToString @Getter @Builder
@Setter
public class Product {
    @Id
    private String id;
    private int quantity;
    private double price;
    private String name;
}
