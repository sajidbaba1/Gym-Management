package com.gym.management.service;

import com.gym.management.model.Booking;
import com.gym.management.model.GymService;
import com.gym.management.model.User;
import com.gym.management.repository.BookingRepository;
import com.gym.management.repository.GymServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final GymServiceRepository gymServiceRepository;
    private final WalletService walletService;
    private final NotificationService notificationService;

    @Transactional
    public Booking createBooking(User user, Integer serviceId, LocalDateTime bookingDate) {
        GymService service = gymServiceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Training program not found"));

        Double total = service.getPrice();

        // 1. Process Payment (15% commission already handled in walletService)
        walletService.transferBookingFunds(user, service.getTrainer(), total);

        // 2. Create Booking
        Booking booking = Booking.builder()
                .user(user)
                .service(service)
                .bookingDate(bookingDate)
                .totalAmount(total)
                .status("CONFIRMED")
                .build();

        Booking saved = bookingRepository.save(booking);

        // 3. Notify Trainer
        notificationService.createNotification(service.getTrainer(),
                "New booking for '" + service.getName() + "' by athlete " + user.getFirstname() + ". You earned ₹"
                        + (total * 0.85));

        // 4. Notify Athlete (Member)
        notificationService.createNotification(user,
                "Training session confirmed for " + service.getName() + "! Get ready to grind.");

        return saved;
    }

    public List<Booking> getMyBookings(User user) {
        return bookingRepository.findByUserId(user.getId());
    }

    public List<Booking> getTrainerBookings(User trainer) {
        return bookingRepository.findByServiceTrainerId(trainer.getId());
    }
}
