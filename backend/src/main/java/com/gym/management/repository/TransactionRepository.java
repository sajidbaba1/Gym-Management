package com.gym.management.repository;

import com.gym.management.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Integer> {
    List<Transaction> findByWalletId(Integer walletId);

    List<Transaction> findByWalletIdOrderByCreatedAtDesc(Integer walletId);
}
