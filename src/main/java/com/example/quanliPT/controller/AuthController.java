package com.example.quanliPT.controller;

import com.example.quanliPT.dto.AuthResponse;
import com.example.quanliPT.dto.LoginRequest;
import com.example.quanliPT.dto.RegisterRequestDTO; // Sử dụng DTO mới
import com.example.quanliPT.service.AuthService;
import jakarta.validation.Valid; // Import @Valid
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    // Sử dụng RegisterRequestDTO và thêm @Valid
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequestDTO request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
