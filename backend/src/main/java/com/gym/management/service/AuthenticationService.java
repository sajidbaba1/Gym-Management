package com.gym.management.service;

import com.gym.management.dto.AuthenticationRequest;
import com.gym.management.dto.AuthenticationResponse;
import com.gym.management.dto.RegisterRequest;
import com.gym.management.model.Role;
import com.gym.management.model.User;
import com.gym.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public AuthenticationResponse register(RegisterRequest request) {
        var user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .enabled(true)
                .build();
        repository.save(user);
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .role(user.getRole())
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .role(user.getRole())
                .build();
    }

    public void sendOtp(String email) {
        User user = repository.findByEmail(email).orElseThrow();
        String otp = String.format("%06d", new Random().nextInt(999999));
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        repository.save(user);
        emailService.sendEmail(email, "Your OTP", "Your OTP is: " + otp);
    }

    public AuthenticationResponse verifyOtp(String email, String otp) {
        User user = repository.findByEmail(email).orElseThrow();
        if (user.getOtp().equals(otp) && user.getOtpExpiry().isAfter(LocalDateTime.now())) {
            user.setOtp(null);
            user.setOtpExpiry(null);
            repository.save(user);
            var jwtToken = jwtService.generateToken(user);
            return AuthenticationResponse.builder()
                    .token(jwtToken)
                    .role(user.getRole())
                    .build();
        }
        throw new RuntimeException("Invalid or expired OTP");
    }

    public AuthenticationResponse googleAuth(String email, String firstname, String lastname, String avatar) {
        User user = repository.findByEmail(email).orElseGet(() -> {
            User newUser = User.builder()
                    .email(email)
                    .firstname(firstname)
                    .lastname(lastname)
                    .avatar(avatar)
                    .password(passwordEncoder.encode("GOOGLE_AUTH_" + System.currentTimeMillis()))
                    .role(Role.MEMBER)
                    .enabled(true)
                    .build();
            return repository.save(newUser);
        });
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .role(user.getRole())
                .build();
    }
}
