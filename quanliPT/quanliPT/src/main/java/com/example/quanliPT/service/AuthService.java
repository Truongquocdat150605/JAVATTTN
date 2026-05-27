package com.example.quanliPT.service;

import com.example.quanliPT.dto.AuthResponse;
import com.example.quanliPT.dto.LoginRequest;
import com.example.quanliPT.dto.RegisterRequest;
import com.example.quanliPT.model.Role;
import com.example.quanliPT.model.User;
import com.example.quanliPT.repository.UserRepository;
import com.example.quanliPT.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        log.info("Registering new user with username={}", request.getUsername());
        if (userRepository.existsByUsername(request.getUsername())) {
            log.warn("Registration failed: username {} already exists", request.getUsername());
            throw new RuntimeException("Username already exists");
        }

        var user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .role(Role.TENANT)
                .active(true)
                .build();

        userRepository.save(user);
        log.debug("User saved with id={}, username={}", user.getId(), user.getUsername());

        var springUser = org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();

        var token = jwtUtils.generateToken(springUser);
        log.info("User registered successfully, token generated for username={}", user.getUsername());

        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .fullName(user.getFullName())
                .role(user.getRole())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        log.info("Login attempt for username={}", request.getUsername());
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        log.debug("Authentication successful for username={}", request.getUsername());

        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> {
                    log.error("User not found after authentication: {}", request.getUsername());
                    return new RuntimeException("User not found");
                });

        var springUser = org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();

        var token = jwtUtils.generateToken(springUser);
        log.info("Login successful for username={}, token generated", user.getUsername());

        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .fullName(user.getFullName())
                .role(user.getRole())
                .build();
    }
}
