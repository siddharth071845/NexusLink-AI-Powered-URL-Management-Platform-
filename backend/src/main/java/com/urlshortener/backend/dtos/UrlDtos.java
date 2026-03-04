package com.urlshortener.backend.dtos;

import lombok.Data;
import java.time.LocalDateTime;

public class UrlDtos {

    @Data
    public static class UrlRequest {
        private String originalUrl;
        private String customAlias;
    }

    @Data
    public static class UrlResponse {
        private String shortCode;
        private String originalUrl;
        private LocalDateTime expiresAt;
        private LocalDateTime createdAt;
    }
}
