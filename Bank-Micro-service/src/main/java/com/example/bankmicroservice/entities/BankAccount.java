package com.example.bankmicroservice.entities;

import com.example.bankmicroservice.enums.AcountType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.*;

import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BankAccount {
    @Id

    private String id;
    private Date createDate;
    private Double balance;
    private String currency;
    @Enumerated(EnumType.STRING)
    private AcountType type;
}
