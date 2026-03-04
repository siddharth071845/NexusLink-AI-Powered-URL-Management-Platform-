package com.urlshortener.backend.services;

import com.urlshortener.backend.repositories.ShortUrlRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import jakarta.transaction.Transactional;
import java.time.LocalDateTime;

@Component
@EnableScheduling
public class ExpiredLinkCleanupJob {

    @Autowired
    private ShortUrlRepository shortUrlRepository;

    @Scheduled(cron = "0 0 0 * * ?") // Run at midnight every day
    @Transactional
    public void cleanupExpiredLinks() {
        shortUrlRepository.findAll().forEach(url -> {
            if (url.getExpiresAt() != null && url.getExpiresAt().isBefore(LocalDateTime.now())) {
                url.setActive(false);
                shortUrlRepository.save(url);
            }
        });
    }
}
