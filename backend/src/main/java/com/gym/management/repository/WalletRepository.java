package com.gym.management.repository;

import com.gym.management.model.Wallet;
import com.gym.management.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface WalletRepository extends JpaRepository<Wallet, Integer> {
    Optional<Wallet> findByUser(User user);

    Optional<Wallet> findByUserId(Integer userId);
}
