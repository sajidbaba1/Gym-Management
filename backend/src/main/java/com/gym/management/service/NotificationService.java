package com.gym.management.service;

import com.gym.management.model.Notification;
import com.gym.management.model.Role;
import com.gym.management.model.User;
import com.gym.management.repository.NotificationRepository;
import com.gym.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public void createNotification(User recipient, String message) {
        Notification notification = Notification.builder()
                .recipient(recipient)
                .message(message)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
        notificationRepository.save(notification);
    }

    public void notifyAdmins(String message) {
        List<User> admins = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.ADMIN || u.getRole() == Role.SUPER_ADMIN)
                .toList();

        for (User admin : admins) {
            createNotification(admin, message);
        }
    }

    public List<Notification> getMyNotifications(User user) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(user.getId());
    }

    public void markAsRead(Integer id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    public void broadcastNotification(String targetAudience, String title, String message) {
        List<User> recipients;

        if ("ALL".equals(targetAudience)) {
            recipients = userRepository.findAll();
        } else if ("MEMBER".equals(targetAudience)) {
            recipients = userRepository.findByRole(Role.MEMBER);
        } else if ("TRAINER".equals(targetAudience)) {
            recipients = userRepository.findByRole(Role.TRAINER);
        } else {
            return;
        }

        String fullMessage = title + ": " + message;
        for (User recipient : recipients) {
            createNotification(recipient, fullMessage);
        }
    }
}
