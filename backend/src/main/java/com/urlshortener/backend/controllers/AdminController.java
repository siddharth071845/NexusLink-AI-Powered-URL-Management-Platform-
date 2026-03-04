package com.urlshortener.backend.controllers;

import com.urlshortener.backend.models.BlacklistDomain;
import com.urlshortener.backend.models.ShortUrl;
import com.urlshortener.backend.models.User;
import com.urlshortener.backend.services.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // --- Statistics ---
    @GetMapping("/stats")
    public ResponseEntity<?> getAdminStats() {
        return ResponseEntity.ok(adminService.getGlobalStats());
    }

    // --- User Management ---
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PostMapping("/users/{id}/suspend")
    public ResponseEntity<User> suspendUser(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.suspendUser(id));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    @PostMapping("/users/{id}/limit")
    public ResponseEntity<User> setUserLimit(@PathVariable Long id, @RequestParam int limit) {
        return ResponseEntity.ok(adminService.setUserLimit(id, limit));
    }

    // --- URL Management ---
    @GetMapping("/urls")
    public ResponseEntity<List<ShortUrl>> getAllUrls() {
        return ResponseEntity.ok(adminService.getAllShortUrls());
    }

    @PostMapping("/urls/{id}/toggle")
    public ResponseEntity<ShortUrl> toggleUrlStatus(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.toggleUrlStatus(id));
    }

    @DeleteMapping("/urls/{id}")
    public ResponseEntity<?> deleteUrl(@PathVariable Long id) {
        adminService.deleteShortUrl(id);
        return ResponseEntity.ok("URL deleted successfully");
    }

    // --- Blacklist Management ---
    @GetMapping("/blacklist")
    public ResponseEntity<List<BlacklistDomain>> getBlacklist() {
        return ResponseEntity.ok(adminService.getBlacklistedDomains());
    }

    @PostMapping("/blacklist")
    public ResponseEntity<BlacklistDomain> addBlacklist(@RequestParam String domain) {
        return ResponseEntity.ok(adminService.addBlacklistDomain(domain));
    }

    @DeleteMapping("/blacklist/{id}")
    public ResponseEntity<?> removeBlacklist(@PathVariable Long id) {
        adminService.removeBlacklistDomain(id);
        return ResponseEntity.ok("Domain removed from blacklist");
    }
}
