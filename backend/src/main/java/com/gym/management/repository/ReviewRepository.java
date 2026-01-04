package com.gym.management.repository;

import com.gym.management.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByServiceId(Integer serviceId);
}
