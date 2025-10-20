package com.example.bankmicroservice.service;

import com.example.bankmicroservice.dto.BankAccountRequestDTO;
import com.example.bankmicroservice.dto.BankAccountResponseDTO;
import com.example.bankmicroservice.entities.BankAccount;
import com.example.bankmicroservice.mappers.AccountMapper;
import com.example.bankmicroservice.repositories.BankAcountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.UUID;

@Service
@Transactional
public class AccountServiceImpl implements AccountService {

    @Autowired
    private BankAcountRepository bankAcountRepository;
    @Autowired
    private AccountMapper accountMapper;


    // adding a new acount
    @Override
    public BankAccountResponseDTO addAccount(BankAccountRequestDTO bankAccountDTO) {
        BankAccount bankAccount = BankAccount.builder()
                .id(UUID.randomUUID().toString())
                .balance(bankAccountDTO.getBalance())
                .createDate(new Date())
                .type(bankAccountDTO.getType())
                .currency(bankAccountDTO.getCurrency())
                .build();
        BankAccount savedBankAcount = bankAcountRepository.save(bankAccount);
        return  accountMapper.fromBankAcountToResponse(savedBankAcount);


    }

    //finding acount by id
    @Override
    public BankAccountResponseDTO findAccountById(String id) {
        BankAccount bankAccount = bankAcountRepository.findById(id).orElseThrow(()-> new RuntimeException("Bank account not found"));
         return accountMapper.fromBankAcountToResponse(bankAccount);

    }




}
