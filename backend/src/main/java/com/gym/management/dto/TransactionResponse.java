package com.gym.management.dto;

import com.gym.management.model.TransactionStatus;
import com.gym.management.model.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TransactionResponse {
    private Integer id;
    private Double amount;
    private TransactionType type;
    private TransactionStatus status;
    private String gateway;
    private String transactionId;
    private LocalDateTime createdAt;
}
