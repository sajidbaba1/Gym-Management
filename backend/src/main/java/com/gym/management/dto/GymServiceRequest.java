package com.gym.management.dto;

import com.gym.management.model.ServiceType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GymServiceRequest {
    private String name;
    private String address;
    private String description;
    private Double price;
    private ServiceType type;
    private String image;
    private Double latitude;
    private Double longitude;
}
