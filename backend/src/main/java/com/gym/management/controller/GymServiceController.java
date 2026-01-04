package com.gym.management.controller;

import com.gym.management.model.GymService;
import com.gym.management.model.ServiceStatus;
import com.gym.management.model.ServiceType;
import com.gym.management.model.User;
import com.gym.management.repository.GymServiceRepository;
import com.gym.management.repository.ReviewRepository;
import com.gym.management.service.NotificationService;
import com.gym.management.dto.GymServiceRequest;
import com.gym.management.dto.GymServiceResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/services")
@RequiredArgsConstructor
public class GymServiceController {

    private final GymServiceRepository serviceRepository;
    private final NotificationService notificationService;
    private final ReviewRepository reviewRepository;

    private GymServiceResponse mapToResponse(GymService service) {
        var reviews = reviewRepository.findByServiceId(service.getId());
        double avg = reviews.isEmpty() ? 0.0
                : reviews.stream().mapToInt(com.gym.management.model.Review::getRating).average().orElse(0.0);

        return GymServiceResponse.builder()
                .id(service.getId())
                .name(service.getName())
                .address(service.getAddress())
                .description(service.getDescription())
                .price(service.getPrice())
                .type(service.getType())
                .category(service.getType() != null ? service.getType().name() : "Other")
                .status(service.getStatus())
                .image(service.getImage())
                .latitude(service.getLatitude())
                .longitude(service.getLongitude())
                .trainerId(service.getTrainer().getId())
                .trainerName(service.getTrainer().getFirstname() + " " + service.getTrainer().getLastname())
                .averageRating(avg)
                .reviewCount(reviews.size())
                .build();
    }

    @PostMapping
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<GymServiceResponse> createService(@RequestBody GymServiceRequest request) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        GymService service = GymService.builder()
                .name(request.getName())
                .address(request.getAddress())
                .description(request.getDescription())
                .price(request.getPrice())
                .type(request.getType())
                .image(request.getImage())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .trainer(user)
                .status(ServiceStatus.PENDING)
                .build();

        GymService saved = serviceRepository.save(service);

        notificationService.notifyAdmins(
                "New training program '" + service.getName() + "' created by trainer " + user.getFirstname()
                        + " is pending approval.");

        return ResponseEntity.ok(mapToResponse(saved));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<List<GymServiceResponse>> getMyServices() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<GymService> services = serviceRepository.findByTrainerId(user.getId());
        return ResponseEntity.ok(services.stream().map(this::mapToResponse).collect(Collectors.toList()));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<List<GymServiceResponse>> getPendingServices() {
        List<GymService> services = serviceRepository.findByStatus(ServiceStatus.PENDING);
        return ResponseEntity.ok(services.stream().map(this::mapToResponse).collect(Collectors.toList()));
    }

    @GetMapping("/history")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<List<GymServiceResponse>> getServiceHistory() {
        List<GymService> all = serviceRepository.findAll();
        return ResponseEntity.ok(all.stream()
                .filter(p -> p.getStatus() != ServiceStatus.PENDING)
                .map(this::mapToResponse)
                .collect(Collectors.toList()));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<GymServiceResponse> updateStatus(@PathVariable Integer id,
            @RequestParam ServiceStatus status) {
        GymService service = serviceRepository.findById(id).orElseThrow();
        service.setStatus(status);
        GymService saved = serviceRepository.save(service);

        notificationService.createNotification(service.getTrainer(),
                "Your training program '" + service.getName() + "' has been " + status.name().toLowerCase() + ".");

        return ResponseEntity.ok(mapToResponse(saved));
    }

    @GetMapping
    public ResponseEntity<List<GymServiceResponse>> getServices(@RequestParam(required = false) ServiceType type) {
        List<GymService> services;
        if (type != null) {
            services = serviceRepository.findByTypeAndStatus(type, ServiceStatus.APPROVED);
        } else {
            services = serviceRepository.findByStatus(ServiceStatus.APPROVED);
        }
        return ResponseEntity.ok(services.stream().map(this::mapToResponse).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GymServiceResponse> getServiceById(@PathVariable Integer id) {
        GymService service = serviceRepository.findById(id).orElseThrow();
        return ResponseEntity.ok(mapToResponse(service));
    }
}
