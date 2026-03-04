package com.urlshortener.backend.controllers;

import com.urlshortener.backend.repositories.ShortUrlRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import jakarta.servlet.http.HttpServletRequest;

@RestController
public class RedirectController {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private ShortUrlRepository shortUrlRepository;

    @GetMapping("/{shortCode}")
    public ResponseEntity<?> redirect(@PathVariable String shortCode, HttpServletRequest request) {
        String originalUrl = null;
        try {
            originalUrl = (String) redisTemplate.opsForValue().get(shortCode);
        } catch (Exception e) {
            System.out.println("Redis get failed for shortCode: " + shortCode);
        }

        if (originalUrl == null) {
            com.urlshortener.backend.models.ShortUrl urlObj = shortUrlRepository.findByShortCode(shortCode)
                    .orElse(null);
            if (urlObj != null) {
                if (!urlObj.isActive() || (urlObj.getUser() != null && urlObj.getUser().isSuspended())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .header("Content-Type", "text/html")
                            .body("<html><body><h2>This link has been disabled by the administrator.</h2></body></html>");
                }
                originalUrl = urlObj.getOriginalUrl();
                try {
                    redisTemplate.opsForValue().set(shortCode, originalUrl);
                } catch (Exception e) {
                }
            }
        }

        if (originalUrl != null) {
            // Analytics async publish goes here
            return ResponseEntity.status(HttpStatus.MOVED_PERMANENTLY)
                    .location(URI.create(originalUrl))
                    .build();
        }

        return ResponseEntity.notFound().build();
    }
}
