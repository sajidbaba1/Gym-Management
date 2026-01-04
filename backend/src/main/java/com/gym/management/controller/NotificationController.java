package com.gym.management.controller;

import com.gym.management.model.Notification;
import com.gym.management.model.User;
import com.gym.management.service.NotificationService;
import com.gym.management.dto.NotificationResponse;
import com.gym.management.dto.BroadcastRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    private NotificationResponse mapToResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .message(notification.getMessage())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getMyNotifications() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<Notification> notifications = notificationService.getMyNotifications(user);
        return ResponseEntity.ok(notifications.stream().map(this::mapToResponse).collect(Collectors.toList()));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Integer id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/broadcast")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Void> broadcastNotification(@RequestBody BroadcastRequest request) {
        notificationService.broadcastNotification(request.getTargetAudience(), request.getTitle(),
                request.getMessage());
        return ResponseEntity.ok().build();
    }
}
