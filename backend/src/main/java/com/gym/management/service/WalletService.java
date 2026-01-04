package com.gym.management.service;

import com.gym.management.model.*;
import com.gym.management.repository.TransactionRepository;
import com.gym.management.repository.UserRepository;
import com.gym.management.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WalletService {

    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public Wallet getMyWallet(User user) {
        return walletRepository.findByUser(user)
                .orElseGet(() -> {
                    Wallet newWallet = Wallet.builder().user(user).balance(0.0).build();
                    return walletRepository.save(newWallet);
                });
    }

    @Transactional
    public void addFunds(User user, Double amount, String transactionId, String gateway) {
        Wallet wallet = getMyWallet(user);
        wallet.setBalance(wallet.getBalance() + amount);
        walletRepository.save(wallet);

        Transaction transaction = Transaction.builder()
                .wallet(wallet)
                .amount(amount)
                .type(TransactionType.DEPOSIT)
                .status(TransactionStatus.SUCCESS)
                .gateway(gateway)
                .transactionId(transactionId)
                .build();
        transactionRepository.save(transaction);
    }

    @Transactional
    public void transferBookingFunds(User member, User trainer, Double amount) {
        Wallet memberWallet = getMyWallet(member);
        if (memberWallet.getBalance() < amount) {
            throw new RuntimeException("Insufficient funds in member wallet");
        }

        // 1. Debit Member
        memberWallet.setBalance(memberWallet.getBalance() - amount);
        walletRepository.save(memberWallet);
        createTransaction(memberWallet, amount, TransactionType.BOOKING, TransactionStatus.SUCCESS, "WALLET",
                "BK-" + System.currentTimeMillis());

        // 2. Calculate Commission (15% for Gym HQ)
        Double commission = amount * 0.15;
        Double trainerShare = amount - commission;

        // 3. Credit Trainer
        Wallet trainerWallet = getMyWallet(trainer);
        trainerWallet.setBalance(trainerWallet.getBalance() + trainerShare);
        walletRepository.save(trainerWallet);
        createTransaction(trainerWallet, trainerShare, TransactionType.REVENUE, TransactionStatus.SUCCESS, "WALLET",
                "REV-" + System.currentTimeMillis());

        // 4. Credit Admin (Gym HQ)
        User admin = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.ADMIN || u.getRole() == Role.SUPER_ADMIN)
                .findFirst()
                .orElse(null);

        if (admin != null) {
            Wallet adminWallet = getMyWallet(admin);
            adminWallet.setBalance(adminWallet.getBalance() + commission);
            walletRepository.save(adminWallet);
            createTransaction(adminWallet, commission, TransactionType.COMMISSION, TransactionStatus.SUCCESS, "WALLET",
                    "COM-" + System.currentTimeMillis());
        }
    }

    private void createTransaction(Wallet wallet, Double amount, TransactionType type, TransactionStatus status,
            String gateway, String txId) {
        Transaction tx = Transaction.builder()
                .wallet(wallet)
                .amount(amount)
                .type(type)
                .status(status)
                .gateway(gateway)
                .transactionId(txId)
                .build();
        transactionRepository.save(tx);
    }

    public List<Transaction> getTransactions(User user) {
        Wallet wallet = getMyWallet(user);
        return transactionRepository.findByWalletIdOrderByCreatedAtDesc(wallet.getId());
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
}
