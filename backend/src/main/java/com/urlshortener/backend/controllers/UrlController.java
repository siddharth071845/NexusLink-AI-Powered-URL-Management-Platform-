package com.urlshortener.backend.controllers;

import com.urlshortener.backend.dtos.UrlDtos.*;
import com.urlshortener.backend.services.UrlShortenerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/urls")
public class UrlController {

    @Autowired
    private UrlShortenerService urlShortenerService;

    @PostMapping("/shorten")
    public ResponseEntity<UrlResponse> shortenUrl(@RequestBody UrlRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = null;
        if (auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser")) {
            username = auth.getName();
        }

        UrlResponse response = urlShortenerService.createShortUrl(request, username);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-links")
    public ResponseEntity<List<UrlResponse>> getMyLinks() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(401).build();
        }
        String username = auth.getName();
        List<UrlResponse> links = urlShortenerService.getUserLinks(username);
        return ResponseEntity.ok(links);
    }
}
