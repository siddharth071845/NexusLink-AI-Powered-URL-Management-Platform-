package com.urlshortener.backend.controllers;

import com.urlshortener.backend.dtos.AnalyticsDtos.AnalyticsResponse;
import com.urlshortener.backend.services.AnalyticsService;
import com.urlshortener.backend.models.ShortUrl;
import com.urlshortener.backend.repositories.ShortUrlRepository;
import com.urlshortener.backend.services.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private ShortUrlRepository shortUrlRepository;

    @Autowired
    private GeminiService geminiService;

    @GetMapping("/{shortCode}")
    public ResponseEntity<AnalyticsResponse> getAnalytics(@PathVariable String shortCode) {
        ShortUrl shortUrl = shortUrlRepository.findByShortCode(shortCode).orElse(null);
        if (shortUrl == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(analyticsService.getAnalyticsByShortUrlId(shortUrl.getId()));
    }

    @GetMapping("/{shortCode}/insights")
    public ResponseEntity<String> getAnalyticsInsights(@PathVariable String shortCode) {
        ShortUrl shortUrl = shortUrlRepository.findByShortCode(shortCode).orElse(null);
        if (shortUrl == null) {
            return ResponseEntity.notFound().build();
        }

        AnalyticsResponse stats = analyticsService.getAnalyticsByShortUrlId(shortUrl.getId());
        // build a simplistic string for location data based on top countries
        StringBuilder locationData = new StringBuilder("Top countries: ");
        if (stats.getCountryDistribution() != null) {
            stats.getCountryDistribution().forEach(
                    (country, count) -> locationData.append(country).append(" (").append(count).append(" clicks), "));
        }

        String insights = geminiService.generateAnalyticsInsights(shortUrl.getOriginalUrl(), stats.getTotalClicks(),
                locationData.toString());
        return ResponseEntity.ok(insights);
    }
}
