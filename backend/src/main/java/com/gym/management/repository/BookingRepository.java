package com.gym.management.repository;

import com.gym.management.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Integer> {
    List<Booking> findByUserId(Integer userId);

    List<Booking> findByServiceTrainerId(Integer trainerId);

    boolean existsByUserIdAndServiceId(Integer userId, Integer serviceId);
}
