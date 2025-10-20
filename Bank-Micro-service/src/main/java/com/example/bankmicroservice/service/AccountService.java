package com.example.bankmicroservice.service;

import com.example.bankmicroservice.dto.BankAccountRequestDTO;
import com.example.bankmicroservice.dto.BankAccountResponseDTO;
import com.example.bankmicroservice.entities.BankAccount;

public interface AccountService {
    public BankAccountResponseDTO addAccount(BankAccountRequestDTO bankAccountDTO);
    public BankAccountResponseDTO findAccountById(String id);
}
