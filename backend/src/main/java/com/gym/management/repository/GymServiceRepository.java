package com.gym.management.repository;

import com.gym.management.model.GymService;
import com.gym.management.model.ServiceType;
import com.gym.management.model.ServiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GymServiceRepository extends JpaRepository<GymService, Integer> {
    List<GymService> findByStatus(ServiceStatus status);

    List<GymService> findByTypeAndStatus(ServiceType type, ServiceStatus status);

    List<GymService> findByTrainerId(Integer trainerId);
}
