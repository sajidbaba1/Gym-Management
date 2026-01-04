package com.gym.management.controller;

import com.gym.management.service.WalletService;
import com.gym.management.dto.TransactionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin/transactions")
@RequiredArgsConstructor
public class AdminTransactionController {

    private final WalletService walletService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<List<TransactionResponse>> getAllTransactions() {
        return ResponseEntity.ok(walletService.getAllTransactions().stream()
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
}
