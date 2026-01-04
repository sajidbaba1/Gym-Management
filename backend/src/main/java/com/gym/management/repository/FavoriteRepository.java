package com.gym.management.repository;

import com.gym.management.model.Favorite;
import com.gym.management.model.GymService;
import com.gym.management.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Integer> {
    List<Favorite> findByUser(User user);

    Optional<Favorite> findByUserAndService(User user, GymService service);

    boolean existsByUserAndService(User user, GymService service);
}
