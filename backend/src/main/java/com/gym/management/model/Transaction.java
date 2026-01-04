package com.gym.management.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Double amount;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private TransactionType type;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private TransactionStatus status;

    private String gateway;

    private String transactionId;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "wallet_id")
    private Wallet wallet;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
