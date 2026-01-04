package com.gym.management.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class GymService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String address;
    private String description;
    private Double price;

    @Enumerated(EnumType.STRING)
    private ServiceType type;

    @Enumerated(EnumType.STRING)
    private ServiceStatus status;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String image;

    private Double latitude;
    private Double longitude;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_id")
    private User trainer;
}
