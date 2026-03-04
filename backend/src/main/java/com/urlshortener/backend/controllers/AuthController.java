package com.urlshortener.backend.controllers;

import com.urlshortener.backend.dtos.AuthDtos.*;
import com.urlshortener.backend.services.AuthService;
import com.urlshortener.backend.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticateUser(@RequestBody LoginRequest loginRequest) {
        String token = authService.authenticateUser(loginRequest);
        User user = authService.findByUsername(loginRequest.getUsername());
        String role = user != null ? user.getRole().name() : "ROLE_USER";
        return ResponseEntity.ok(new AuthResponse(token, loginRequest.getUsername(), role));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            User user = authService.registerUser(registerRequest);
            return ResponseEntity.ok("User registered successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
