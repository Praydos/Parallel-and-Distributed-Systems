package org.example.billingservice.model;


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class Product {
    private String id;
    private String name;
    private double price;
    private int quantity;
}
