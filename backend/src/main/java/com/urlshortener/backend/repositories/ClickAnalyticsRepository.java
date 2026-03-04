package com.urlshortener.backend.repositories;

import com.urlshortener.backend.models.ClickAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClickAnalyticsRepository extends JpaRepository<ClickAnalytics, Long> {
    List<ClickAnalytics> findByShortUrlId(Long shortUrlId);
}
