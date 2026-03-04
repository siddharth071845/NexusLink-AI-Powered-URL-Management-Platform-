package com.urlshortener.backend.repositories;

import com.urlshortener.backend.models.ShortUrl;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface ShortUrlRepository extends JpaRepository<ShortUrl, Long> {
    Optional<ShortUrl> findByShortCode(String shortCode);

    boolean existsByShortCode(String shortCode);

    List<ShortUrl> findByUserId(Long userId);

    long countByUserIdAndCreatedAtAfter(Long userId, java.time.LocalDateTime date);
}
