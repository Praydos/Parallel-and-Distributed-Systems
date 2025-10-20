package com.example.bankmicroservice.mappers;

import com.example.bankmicroservice.dto.BankAccountRequestDTO;
import com.example.bankmicroservice.dto.BankAccountResponseDTO;
import com.example.bankmicroservice.entities.BankAccount;
import com.fasterxml.jackson.databind.util.BeanUtil;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

@Component
public class AccountMapper {
    public BankAccountResponseDTO fromBankAcountToResponse(BankAccount bankAccount) {
        BankAccountResponseDTO bankAccountResponseDTO = new BankAccountResponseDTO();
        BeanUtils.copyProperties(bankAccount, bankAccountResponseDTO);
        return bankAccountResponseDTO;
    }

    public BankAccountRequestDTO fromBankAccountToRequest(BankAccount bankAccount) {
        BankAccountRequestDTO bankAccountRequestDTO = new BankAccountRequestDTO();
        BeanUtils.copyProperties(bankAccount, bankAccountRequestDTO);
        return bankAccountRequestDTO;
    }

    public BankAccount fromRequestToBankAccount(BankAccountRequestDTO bankAccountRequestDTO) {
        BankAccount bankAccount = new BankAccount();
        BeanUtils.copyProperties(bankAccountRequestDTO, bankAccount);
        return bankAccount;
    }

}
