package com.gym.management.controller;

import com.gym.management.dto.AuthenticationRequest;
import com.gym.management.dto.AuthenticationResponse;
import com.gym.management.dto.RegisterRequest;
import com.gym.management.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> payload) {
        service.sendOtp(payload.get("email"));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthenticationResponse> verifyOtp(@RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(service.verifyOtp(payload.get("email"), payload.get("otp")));
    }

    @PostMapping("/google")
    public ResponseEntity<AuthenticationResponse> googleAuth(@RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(service.googleAuth(
                payload.get("email"),
                payload.get("firstname"),
                payload.get("lastname"),
                payload.get("avatar")));
    }
}
