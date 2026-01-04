package com.gym.management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookingResponse {
    private Integer id;
    private ServiceInfo service;
    private LocalDateTime bookingDate;
    private Double totalAmount;
    private String status;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ServiceInfo {
        private Integer id;
        private String name;
        private String image;
        private String category;
        private Double price;
    }
}
