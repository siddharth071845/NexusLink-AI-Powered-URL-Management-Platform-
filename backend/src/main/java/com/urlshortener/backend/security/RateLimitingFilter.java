package com.urlshortener.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    private static final int MAX_REQUESTS_PER_MINUTE = 100;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        if (path.startsWith("/api/urls/shorten") && request.getMethod().equals("POST")) {
            String clientIp = request.getRemoteAddr();
            String key = "rate_limit:" + clientIp;

            try {
                Long currentRequests = redisTemplate.opsForValue().increment(key);
                if (currentRequests != null && currentRequests == 1) {
                    redisTemplate.expire(key, 1, TimeUnit.MINUTES);
                }
                if (currentRequests != null && currentRequests > MAX_REQUESTS_PER_MINUTE) {
                    response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                    response.getWriter().write("Too many requests. Please try again later.");
                    return;
                }
            } catch (Exception e) {
                // Redis is likely down, skip rate limiting
                System.out.println("Redis is down, skipping rate limiting.");
            }
        }

        filterChain.doFilter(request, response);
    }
}
