package com.urlshortener.backend.services;

import com.urlshortener.backend.dtos.ClickEvent;
import com.urlshortener.backend.models.ClickAnalytics;
import com.urlshortener.backend.models.ShortUrl;
import com.urlshortener.backend.repositories.ClickAnalyticsRepository;
import com.urlshortener.backend.repositories.ShortUrlRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AnalyticsWorkerService {

    @Autowired
    private ClickAnalyticsRepository clickAnalyticsRepository;

    @Autowired
    private ShortUrlRepository shortUrlRepository;

    @Async
    public void processClickEvent(ClickEvent event) {
        ShortUrl shortUrl = shortUrlRepository.findByShortCode(event.getShortCode()).orElse(null);
        if (shortUrl != null) {
            ClickAnalytics analytics = new ClickAnalytics();
            analytics.setShortUrl(shortUrl);
            analytics.setClickedAt(LocalDateTime.now());
            analytics.setIpAddress(event.getIpAddress());
            analytics.setUserAgent(event.getUserAgent());

            analytics.setCountry("Unknown");
            analytics.setDeviceType(parseDeviceType(event.getUserAgent()));

            clickAnalyticsRepository.save(analytics);
        }
    }

    private String parseDeviceType(String userAgent) {
        if (userAgent == null)
            return "Unknown";
        String ua = userAgent.toLowerCase();
        if (ua.contains("mobile") || ua.contains("ipod") || ua.contains("iphone") || ua.contains("android")) {
            return "Mobile";
        } else if (ua.contains("ipad") || ua.contains("tablet")) {
            return "Tablet";
        }
        return "Desktop";
    }
}
