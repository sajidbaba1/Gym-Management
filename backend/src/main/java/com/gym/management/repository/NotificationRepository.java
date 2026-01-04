package com.gym.management.repository;

import com.gym.management.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findByRecipientIdOrderByCreatedAtDesc(Integer userId);
}
