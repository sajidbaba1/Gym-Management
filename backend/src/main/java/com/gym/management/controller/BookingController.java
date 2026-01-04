package com.gym.management.controller;

import com.gym.management.model.Booking;
import com.gym.management.model.User;
import com.gym.management.service.BookingService;
import com.gym.management.dto.BookingRequest;
import com.gym.management.dto.BookingResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    private BookingResponse mapToResponse(Booking b) {
        return BookingResponse.builder()
                .id(b.getId())
                .service(BookingResponse.ServiceInfo.builder()
                        .id(b.getService().getId())
                        .name(b.getService().getName())
                        .image(b.getService().getImage())
                        .category(b.getService().getType().name())
                        .price(b.getService().getPrice())
                        .build())
                .bookingDate(b.getBookingDate())
                .totalAmount(b.getTotalAmount())
                .status(b.getStatus())
                .build();
    }

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@RequestBody BookingRequest request) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Booking booking = bookingService.createBooking(user, request.getServiceId(), request.getBookingDate());
        return ResponseEntity.ok(mapToResponse(booking));
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingResponse>> getMyBookings() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(bookingService.getMyBookings(user).stream()
                .map(this::mapToResponse).collect(Collectors.toList()));
    }

    @GetMapping("/trainer")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<List<BookingResponse>> getTrainerBookings() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(bookingService.getTrainerBookings(user).stream()
                .map(this::mapToResponse).collect(Collectors.toList()));
    }
}
