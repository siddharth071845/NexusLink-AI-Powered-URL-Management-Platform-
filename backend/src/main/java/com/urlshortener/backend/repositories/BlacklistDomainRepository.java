package com.urlshortener.backend.repositories;

import com.urlshortener.backend.models.BlacklistDomain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BlacklistDomainRepository extends JpaRepository<BlacklistDomain, Long> {
    boolean existsByDomain(String domain);

    Optional<BlacklistDomain> findByDomain(String domain);
}
