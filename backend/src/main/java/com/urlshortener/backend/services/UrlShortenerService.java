package com.urlshortener.backend.services;

import com.urlshortener.backend.dtos.UrlDtos.*;
import com.urlshortener.backend.models.ShortUrl;
import com.urlshortener.backend.models.User;
import com.urlshortener.backend.repositories.ShortUrlRepository;
import com.urlshortener.backend.repositories.UserRepository;
import com.urlshortener.backend.utils.Base62Encoder;
import com.urlshortener.backend.utils.SnowflakeIdGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.net.URI;
import com.urlshortener.backend.models.BlacklistDomain;
import com.urlshortener.backend.repositories.BlacklistDomainRepository;

@Service
public class UrlShortenerService {

    @Autowired
    private ShortUrlRepository shortUrlRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SnowflakeIdGenerator idGenerator;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private BlacklistDomainRepository blacklistDomainRepository;

    public UrlResponse createShortUrl(UrlRequest request, String username) {
        String shortCode;
        if (request.getCustomAlias() != null && !request.getCustomAlias().trim().isEmpty()) {
            if (shortUrlRepository.existsByShortCode(request.getCustomAlias())) {
                throw new RuntimeException("Custom alias already in use!");
            }
            shortCode = request.getCustomAlias();
        } else {
            long id = idGenerator.nextId();
            shortCode = Base62Encoder.encode(Math.abs(id));
        }

        ShortUrl shortUrl = new ShortUrl();
        shortUrl.setOriginalUrl(request.getOriginalUrl());
        shortUrl.setShortCode(shortCode);
        shortUrl.setExpiresAt(LocalDateTime.now().plusDays(30));

        // Domain Blacklist Check
        try {
            URI uri = new URI(request.getOriginalUrl());
            String host = uri.getHost();
            if (host != null) {
                // Strip "www." for matching if present
                if (host.startsWith("www.")) {
                    host = host.substring(4);
                }
                List<BlacklistDomain> blacklists = blacklistDomainRepository.findAll();
                for (BlacklistDomain bd : blacklists) {
                    if (host.equalsIgnoreCase(bd.getDomain()) || host.endsWith("." + bd.getDomain())) {
                        throw new RuntimeException("This domain is blocked by the administrator.");
                    }
                }
            }
        } catch (Exception e) {
            if (e instanceof RuntimeException)
                throw (RuntimeException) e;
            // ignore parse errors
        }

        if (username != null) {
            User user = userRepository.findByUsername(username).orElse(null);
            if (user != null) {
                // Rate Limiting
                LocalDateTime startOfDay = LocalDateTime.now().toLocalDate().atStartOfDay();
                long countToday = shortUrlRepository.countByUserIdAndCreatedAtAfter(user.getId(), startOfDay);
                if (countToday >= user.getDailyLimit()) {
                    throw new RuntimeException(
                            "Daily limit exceeded. You can only create " + user.getDailyLimit() + " links per day.");
                }
            }
            shortUrl.setUser(user);
        }

        shortUrlRepository.save(shortUrl);

        try {
            redisTemplate.opsForValue().set(shortCode, request.getOriginalUrl());
        } catch (Exception e) {
            System.out.println("Failed to cache shortened URL in Redis: " + e.getMessage());
        }

        UrlResponse response = new UrlResponse();
        response.setShortCode(shortCode);
        response.setOriginalUrl(request.getOriginalUrl());
        response.setCreatedAt(LocalDateTime.now());
        response.setExpiresAt(shortUrl.getExpiresAt());

        return response;
    }

    public List<UrlResponse> getUserLinks(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        List<ShortUrl> links = shortUrlRepository.findByUserId(user.getId());

        // Return reverse chronological
        return links.stream().map(link -> {
            UrlResponse r = new UrlResponse();
            r.setShortCode(link.getShortCode());
            r.setOriginalUrl(link.getOriginalUrl());
            r.setCreatedAt(link.getCreatedAt());
            r.setExpiresAt(link.getExpiresAt());
            return r;
        })
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(Collectors.toList());
    }
}
