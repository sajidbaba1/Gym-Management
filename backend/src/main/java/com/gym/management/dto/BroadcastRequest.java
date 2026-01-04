package com.gym.management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BroadcastRequest {
    private String targetAudience; // ALL, MEMBER, TRAINER
    private String title;
    private String message;
}
