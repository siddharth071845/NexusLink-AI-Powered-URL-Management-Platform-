package com.urlshortener.backend.services;

import com.urlshortener.backend.dtos.AdminDtos.GlobalStatsResponse;
import com.urlshortener.backend.dtos.AdminDtos.UrlStatsDto;
import com.urlshortener.backend.models.BlacklistDomain;
import com.urlshortener.backend.models.ClickAnalytics;
import com.urlshortener.backend.models.ShortUrl;
import com.urlshortener.backend.models.User;
import com.urlshortener.backend.repositories.BlacklistDomainRepository;
import com.urlshortener.backend.repositories.ClickAnalyticsRepository;
import com.urlshortener.backend.repositories.ShortUrlRepository;
import com.urlshortener.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ShortUrlRepository shortUrlRepository;

    @Autowired
    private ClickAnalyticsRepository clickAnalyticsRepository;

    @Autowired
    private BlacklistDomainRepository blacklistDomainRepository;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    public GlobalStatsResponse getGlobalStats() {
        GlobalStatsResponse stats = new GlobalStatsResponse();
        stats.setTotalUsers(userRepository.count());
        stats.setTotalUrls(shortUrlRepository.count());
        stats.setTotalClicks(clickAnalyticsRepository.count());

        List<ShortUrl> allUrls = shortUrlRepository.findAll();
        List<UrlStatsDto> topLinks = new ArrayList<>();

        for (ShortUrl url : allUrls) {
            long count = clickAnalyticsRepository.findByShortUrlId(url.getId()).size();
            UrlStatsDto dto = new UrlStatsDto();
            dto.setShortUrl(url);
            dto.setClicks(count);
            topLinks.add(dto);
        }

        topLinks.sort(Comparator.comparing(UrlStatsDto::getClicks).reversed());
        stats.setTopLinks(topLinks.stream().limit(5).collect(Collectors.toList()));

        List<User> users = userRepository.findAll();
        users.sort(Comparator.comparing(User::getCreatedAt).reversed());
        stats.setRecentUsers(users.stream().limit(5).collect(Collectors.toList()));

        return stats;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User suspendUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setSuspended(!user.isSuspended());
        if (user.isSuspended()) {
            List<ShortUrl> userUrls = shortUrlRepository.findByUserId(id);
            for (ShortUrl u : userUrls) {
                redisTemplate.delete(u.getShortCode());
            }
        }
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public User setUserLimit(Long id, int limit) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setDailyLimit(limit);
        return userRepository.save(user);
    }

    public List<ShortUrl> getAllShortUrls() {
        return shortUrlRepository.findAll();
    }

    public ShortUrl toggleUrlStatus(Long id) {
        ShortUrl url = shortUrlRepository.findById(id).orElseThrow(() -> new RuntimeException("URL not found"));
        url.setActive(!url.isActive());
        if (!url.isActive()) {
            redisTemplate.delete(url.getShortCode());
        }
        return shortUrlRepository.save(url);
    }

    public void deleteShortUrl(Long id) {
        ShortUrl url = shortUrlRepository.findById(id).orElseThrow(() -> new RuntimeException("URL not found"));
        redisTemplate.delete(url.getShortCode());
        shortUrlRepository.deleteById(id);
    }

    public List<BlacklistDomain> getBlacklistedDomains() {
        return blacklistDomainRepository.findAll();
    }

    public BlacklistDomain addBlacklistDomain(String domainName) {
        if (blacklistDomainRepository.existsByDomain(domainName)) {
            throw new RuntimeException("Domain is already blacklisted");
        }
        BlacklistDomain domain = new BlacklistDomain();
        domain.setDomain(domainName);
        return blacklistDomainRepository.save(domain);
    }

    public void removeBlacklistDomain(Long id) {
        blacklistDomainRepository.deleteById(id);
    }
}
