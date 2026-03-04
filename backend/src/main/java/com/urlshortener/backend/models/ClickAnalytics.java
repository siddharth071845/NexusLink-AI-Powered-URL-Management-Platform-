package com.urlshortener.backend.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "click_analytics", indexes = {
        @Index(name = "idx_short_url_id", columnList = "short_url_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClickAnalytics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "short_url_id", nullable = false)
    private ShortUrl shortUrl;

    @CreationTimestamp
    private LocalDateTime clickedAt;

    private String ipAddress;
    private String userAgent;
    private String country;
    private String deviceType;
}
