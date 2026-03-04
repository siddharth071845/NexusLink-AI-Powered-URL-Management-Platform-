package com.urlshortener.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClickEvent {
    private String shortCode;
    private String ipAddress;
    private String userAgent;
}
