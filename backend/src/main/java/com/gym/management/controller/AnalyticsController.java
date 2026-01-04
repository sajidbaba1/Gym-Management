package com.gym.management.controller;

import com.gym.management.model.TransactionType;
import com.gym.management.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final UserRepository userRepository;
    private final GymServiceRepository serviceRepository;
    private final BookingRepository bookingRepository;
    private final TransactionRepository transactionRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalServices", serviceRepository.count());
        stats.put("totalBookings", bookingRepository.count());

        // Platform Profit (Commission sum)
        stats.put("totalRevenue", transactionRepository.findAll().stream()
                .filter(t -> TransactionType.COMMISSION.equals(t.getType()))
                .mapToDouble(t -> t.getAmount())
                .sum());

        return ResponseEntity.ok(stats);
    }
}
