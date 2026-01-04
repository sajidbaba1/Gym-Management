package com.gym.management.controller;

import com.gym.management.model.Review;
import com.gym.management.model.User;
import com.gym.management.repository.ReviewRepository;
import com.gym.management.repository.GymServiceRepository;
import com.gym.management.repository.BookingRepository;
import com.gym.management.dto.ReviewResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final GymServiceRepository serviceRepository;
    private final BookingRepository bookingRepository;

    @PostMapping("/{serviceId}")
    public ResponseEntity<?> addReview(@PathVariable Integer serviceId, @RequestBody Review review) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // Safety check: must have booked to review
        boolean hasBooked = bookingRepository.existsByUserIdAndServiceId(user.getId(), serviceId);
        if (!hasBooked) {
            return ResponseEntity.badRequest().body("You can only review sessions you have attended.");
        }

        review.setUser(user);

        var service = serviceRepository.findById(serviceId);
        if (service.isEmpty()) {
            return ResponseEntity.badRequest().body("Training program not found");
        }

        review.setService(service.get());
        Review saved = reviewRepository.save(review);
        return ResponseEntity.ok(mapToResponse(saved));
    }

    private ReviewResponse mapToResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .userId(review.getUser().getId())
                .userName(review.getUser().getFirstname() + " " + review.getUser().getLastname())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }

    @GetMapping("/service/{serviceId}")
    public ResponseEntity<List<ReviewResponse>> getServiceReviews(@PathVariable Integer serviceId) {
        return ResponseEntity.ok(reviewRepository.findByServiceId(serviceId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList()));
    }
}
