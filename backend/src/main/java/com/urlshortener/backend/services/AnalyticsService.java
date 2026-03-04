package com.urlshortener.backend.services;

import com.urlshortener.backend.dtos.AnalyticsDtos.AnalyticsResponse;
import com.urlshortener.backend.models.ClickAnalytics;
import com.urlshortener.backend.repositories.ClickAnalyticsRepository;
import com.urlshortener.backend.repositories.ShortUrlRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private ClickAnalyticsRepository clickAnalyticsRepository;

    @Autowired
    private ShortUrlRepository shortUrlRepository;

    public AnalyticsResponse getAnalyticsByShortUrlId(Long id) {
        List<ClickAnalytics> clicks = clickAnalyticsRepository.findByShortUrlId(id);

        AnalyticsResponse response = new AnalyticsResponse();
        response.setTotalClicks(clicks.size());

        Map<String, Long> deviceDistribution = clicks.stream()
                .collect(Collectors.groupingBy(ClickAnalytics::getDeviceType, Collectors.counting()));
        response.setDeviceDistribution(deviceDistribution);

        Map<String, Long> countryDistribution = clicks.stream()
                .collect(Collectors.groupingBy(ClickAnalytics::getCountry, Collectors.counting()));
        response.setCountryDistribution(countryDistribution);

        Map<String, Long> clicksByDay = clicks.stream()
                .collect(Collectors.groupingBy(c -> c.getClickedAt().toLocalDate().toString(), Collectors.counting()));
        response.setClicksByDay(clicksByDay);

        return response;
    }
}
