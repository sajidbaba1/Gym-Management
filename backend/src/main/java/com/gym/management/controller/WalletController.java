package com.gym.management.controller;

import com.gym.management.model.User;
import com.gym.management.model.Wallet;
import com.gym.management.service.WalletService;
import com.gym.management.dto.WalletResponse;
import com.gym.management.dto.TransactionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    @GetMapping
    public ResponseEntity<WalletResponse> getMyWallet() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Wallet wallet = walletService.getMyWallet(user);
        return ResponseEntity.ok(WalletResponse.builder()
                .id(wallet.getId())
                .balance(wallet.getBalance())
                .build());
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<TransactionResponse>> getMyTransactions() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(walletService.getTransactions(user).stream()
                .map(t -> TransactionResponse.builder()
                        .id(t.getId())
                        .amount(t.getAmount())
                        .type(t.getType())
                        .status(t.getStatus())
                        .gateway(t.getGateway())
                        .transactionId(t.getTransactionId())
                        .createdAt(t.getCreatedAt())
                        .build())
                .collect(Collectors.toList()));
    }

    @PostMapping("/add-funds")
    public ResponseEntity<?> addFunds(@RequestBody Map<String, Object> payload) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Double amount = Double.valueOf(payload.get("amount").toString());
        String transactionId = payload.get("transactionId").toString();
        String gateway = payload.get("gateway").toString();

        walletService.addFunds(user, amount, transactionId, gateway);

        return ResponseEntity.ok().build();
    }
}
