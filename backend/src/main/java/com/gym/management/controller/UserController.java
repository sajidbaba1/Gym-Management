package com.gym.management.controller;

import com.gym.management.dto.RegisterRequest;
import com.gym.management.dto.UpdateUserRequest;
import com.gym.management.dto.UserResponse;
import com.gym.management.model.User;
import com.gym.management.repository.UserRepository;
import com.gym.management.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(UserResponse.builder()
                .id(user.getId())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .email(user.getEmail())
                .avatar(user.getAvatar())
                .role(user.getRole())
                .enabled(user.isEnabled())
                .build());
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateCurrentUser(@RequestBody UpdateUserRequest request) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = repository.findByEmail(user.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (request.getFirstname() != null)
            currentUser.setFirstname(request.getFirstname());
        if (request.getLastname() != null)
            currentUser.setLastname(request.getLastname());
        if (request.getAvatar() != null)
            currentUser.setAvatar(request.getAvatar());

        String newToken = null;
        if (request.getEmail() != null && !request.getEmail().equals(currentUser.getEmail())) {
            if (repository.findByEmail(request.getEmail()).isPresent()) {
                throw new UnsupportedOperationException("Email already taken");
            }
            currentUser.setEmail(request.getEmail());
            newToken = jwtService.generateToken(currentUser);
        }

        repository.save(currentUser);

        return ResponseEntity.ok(UserResponse.builder()
                .id(currentUser.getId())
                .firstname(currentUser.getFirstname())
                .lastname(currentUser.getLastname())
                .email(currentUser.getEmail())
                .avatar(currentUser.getAvatar())
                .role(currentUser.getRole())
                .enabled(currentUser.isEnabled())
                .token(newToken)
                .build());
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<User> users = repository.findAll();
        List<UserResponse> response = users.stream().map(user -> UserResponse.builder()
                .id(user.getId())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .email(user.getEmail())
                .avatar(user.getAvatar())
                .role(user.getRole())
                .enabled(user.isEnabled())
                .build()).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/admins")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<UserResponse>> getAdmins() {
        return ResponseEntity.ok(repository.findByRole(com.gym.management.model.Role.ADMIN).stream()
                .map(u -> UserResponse.builder()
                        .id(u.getId())
                        .firstname(u.getFirstname())
                        .lastname(u.getLastname())
                        .email(u.getEmail())
                        .avatar(u.getAvatar())
                        .role(u.getRole())
                        .enabled(u.isEnabled())
                        .build())
                .collect(Collectors.toList()));
    }

    @PatchMapping("/{id}/toggle-status")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Integer id) {
        User user = repository.findById(id).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        user.setEnabled(!user.isEnabled());
        repository.save(user);
        return ResponseEntity.ok().build();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<UserResponse> createUser(@RequestBody RegisterRequest request) {
        var user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .enabled(true)
                .build();
        repository.save(user);
        return ResponseEntity.ok(UserResponse.builder()
                .id(user.getId())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .email(user.getEmail())
                .avatar(user.getAvatar())
                .role(user.getRole())
                .enabled(user.isEnabled())
                .build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Integer id, @RequestBody UpdateUserRequest request) {
        User user = repository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (request.getFirstname() != null)
            user.setFirstname(request.getFirstname());
        if (request.getLastname() != null)
            user.setLastname(request.getLastname());
        if (request.getEmail() != null)
            user.setEmail(request.getEmail());
        if (request.getAvatar() != null)
            user.setAvatar(request.getAvatar());
        if (request.getRole() != null)
            user.setRole(request.getRole());

        repository.save(user);

        return ResponseEntity.ok(UserResponse.builder()
                .id(user.getId())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .email(user.getEmail())
                .avatar(user.getAvatar())
                .role(user.getRole())
                .enabled(user.isEnabled())
                .build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
