package com.example.bankmicroservice.dto;

import com.example.bankmicroservice.enums.AcountType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
@Data @NoArgsConstructor
@AllArgsConstructor
public class BankAccountRequestDTO {

    private Double balance;
    private String currency;
    private AcountType type;
}
