package com.gym.management.controller;

import com.gym.management.model.Favorite;
import com.gym.management.model.GymService;
import com.gym.management.model.User;
import com.gym.management.repository.FavoriteRepository;
import com.gym.management.repository.GymServiceRepository;
import com.gym.management.dto.GymServiceResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteRepository favoriteRepository;
    private final GymServiceRepository serviceRepository;

    @GetMapping
    public ResponseEntity<List<GymServiceResponse>> getMyFavorites() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(favoriteRepository.findByUser(user).stream()
                .map(f -> mapToResponse(f.getService()))
                .collect(Collectors.toList()));
    }

    private GymServiceResponse mapToResponse(GymService service) {
        return GymServiceResponse.builder()
                .id(service.getId())
                .name(service.getName())
                .address(service.getAddress())
                .description(service.getDescription())
                .price(service.getPrice())
                .type(service.getType())
                .status(service.getStatus())
                .image(service.getImage())
                .latitude(service.getLatitude())
                .longitude(service.getLongitude())
                .trainerId(service.getTrainer().getId())
                .trainerName(service.getTrainer().getFirstname() + " " + service.getTrainer().getLastname())
                .build();
    }

    @PostMapping("/{serviceId}")
    public ResponseEntity<?> toggleFavorite(@PathVariable Integer serviceId) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        GymService service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Training program not found"));

        var existing = favoriteRepository.findByUserAndService(user, service);
        if (existing.isPresent()) {
            favoriteRepository.delete(existing.get());
            return ResponseEntity.ok(Map.of("message", "Removed from favorites", "status", false));
        } else {
            favoriteRepository.save(Favorite.builder().user(user).service(service).build());
            return ResponseEntity.ok(Map.of("message", "Added to favorites", "status", true));
        }
    }

    @GetMapping("/{serviceId}/check")
    public ResponseEntity<Map<String, Boolean>> checkFavorite(@PathVariable Integer serviceId) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        GymService service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Training program not found"));
        boolean exists = favoriteRepository.existsByUserAndService(user, service);
        return ResponseEntity.ok(Map.of("isFavorite", exists));
    }
}
