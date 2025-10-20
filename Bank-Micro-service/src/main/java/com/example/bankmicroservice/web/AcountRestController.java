package com.example.bankmicroservice.web;


import com.example.bankmicroservice.dto.BankAccountRequestDTO;
import com.example.bankmicroservice.dto.BankAccountResponseDTO;
import com.example.bankmicroservice.entities.BankAccount;
import com.example.bankmicroservice.repositories.BankAcountRepository;
import com.example.bankmicroservice.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class AcountRestController {
    @Autowired
    private BankAcountRepository bankAcountRepository;
    @Autowired
    private AccountService accountService;

    @GetMapping("/BankAccounts")
    public List<BankAccount> getBankAccounts() {
        return bankAcountRepository.findAll();
    }
    @GetMapping("/BankAccounts/{id}")
    public BankAccountResponseDTO getBankAccount(@PathVariable String id) {
        return accountService.findAccountById(id);
    }

    @PostMapping("/SaveBankAccount")
    public BankAccountResponseDTO saveBankAccount(@RequestBody BankAccountRequestDTO bankAccountRequestDTO) {
        return accountService.addAccount(bankAccountRequestDTO);
    }

    @PutMapping("/BnakAccount/{id}")

    public BankAccount updateBankAccount(@PathVariable String id,@RequestBody BankAccount bankAccount) {
        BankAccount account = bankAcountRepository.findById(id).orElseThrow(()-> new RuntimeException("Bank account not found"));
        if (account.getBalance()!=null) account.setBalance(bankAccount.getBalance());
        if (account.getCurrency()!=null)account.setCurrency(bankAccount.getCurrency());
        if (account.getType()!=null)account.setType(bankAccount.getType());
        if (account.getCreateDate()!=null)account.setCreateDate(new Date());
        return bankAcountRepository.save(bankAccount);
    }

    @DeleteMapping("/DeleteBnakAccount/{id}")
    public void delete(@PathVariable String id) {
         bankAcountRepository.deleteById(id);
    }


}
