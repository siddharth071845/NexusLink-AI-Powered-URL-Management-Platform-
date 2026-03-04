package com.urlshortener.backend.config;

import com.urlshortener.backend.models.Role;
import com.urlshortener.backend.models.User;
import com.urlshortener.backend.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            User admin = userRepository.findByUsername("admin").orElse(new User());
            admin.setUsername("admin");
            admin.setEmail("admin@shortnr.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ROLE_ADMIN);
            admin.setDailyLimit(1000);
            admin.setSuspended(false);
            userRepository.save(admin);
            System.out.println("Admin account synced: admin / admin123");
        };
    }
}
