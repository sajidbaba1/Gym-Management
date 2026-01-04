package com.gym.management.service;

import com.gym.management.model.Booking;
import com.gym.management.model.Transaction;
import com.gym.management.model.TransactionType;
import com.gym.management.repository.BookingRepository;
import com.gym.management.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class RevenueService {

    private final TransactionRepository transactionRepository;
    private final BookingRepository bookingRepository;

    public Map<String, Object> getDetailedRevenue() {
        List<Transaction> transactions = transactionRepository.findAll();
        List<Booking> bookings = bookingRepository.findAll();

        Map<String, Object> report = new HashMap<>();

        // Overall stats
        double totalVolume = transactions.stream()
                .filter(t -> TransactionType.BOOKING.equals(t.getType()) || TransactionType.DEPOSIT.equals(t.getType()))
                .mapToDouble(Transaction::getAmount).sum();

        double totalCommission = transactions.stream()
                .filter(t -> TransactionType.COMMISSION.equals(t.getType()))
                .mapToDouble(Transaction::getAmount).sum();

        report.put("totalVolume", totalVolume);
        report.put("totalCommission", totalCommission);
        report.put("totalBookings", (long) bookings.size());

        // Revenue by month (last 6 months)
        List<Map<String, Object>> monthlyRevenue = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM yyyy");
        for (int i = 5; i >= 0; i--) {
            LocalDateTime start = LocalDateTime.now().minusMonths(i).withDayOfMonth(1).withHour(0).withMinute(0);
            LocalDateTime end = start.plusMonths(1);

            double monthRev = transactions.stream()
                    .filter(t -> t.getCreatedAt().isAfter(start) && t.getCreatedAt().isBefore(end))
                    .filter(t -> TransactionType.COMMISSION.equals(t.getType()))
                    .mapToDouble(Transaction::getAmount).sum();

            Map<String, Object> monthData = new HashMap<>();
            monthData.put("month", start.format(formatter));
            monthData.put("revenue", monthRev);
            monthlyRevenue.add(monthData);
        }
        report.put("monthlyRevenue", monthlyRevenue);

        // Revenue by Training Type
        Map<String, Double> typeRevenue = new HashMap<>();
        bookings.forEach(b -> {
            String type = b.getService().getType().name();
            // Using 15% commission as defined in WalletService
            typeRevenue.put(type, typeRevenue.getOrDefault(type, 0.0) + b.getTotalAmount() * 0.15);
        });
        report.put("typeRevenue", typeRevenue);

        return report;
    }
}
