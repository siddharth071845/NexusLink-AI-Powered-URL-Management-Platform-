package com.urlshortener.backend.dtos;

import lombok.Data;
import java.util.Map;

public class AnalyticsDtos {
    @Data
    public static class AnalyticsResponse {
        private long totalClicks;
        private Map<String, Long> deviceDistribution;
        private Map<String, Long> countryDistribution;
        private Map<String, Long> clicksByDay;
    }
}
