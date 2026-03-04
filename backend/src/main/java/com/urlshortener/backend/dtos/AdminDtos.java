package com.urlshortener.backend.dtos;

import com.urlshortener.backend.models.BlacklistDomain;
import com.urlshortener.backend.models.ShortUrl;
import com.urlshortener.backend.models.User;
import lombok.Data;

import java.util.List;

public class AdminDtos {

    @Data
    public static class GlobalStatsResponse {
        private long totalUsers;
        private long totalUrls;
        private long totalClicks;
        private List<UrlStatsDto> topLinks;
        private List<User> recentUsers;
    }

    @Data
    public static class UrlStatsDto {
        private ShortUrl shortUrl;
        private long clicks;
    }
}
