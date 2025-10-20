package com.example.bankmicroservice.dto;

import com.example.bankmicroservice.enums.AcountType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data @AllArgsConstructor
@NoArgsConstructor @Builder
public class BankAccountResponseDTO {
    private String id;
    private Date createDate;
    private Double balance;
    private String currency;
    private AcountType type;

}
