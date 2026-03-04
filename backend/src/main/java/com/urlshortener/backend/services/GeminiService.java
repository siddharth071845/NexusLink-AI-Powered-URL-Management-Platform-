package com.urlshortener.backend.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public GeminiService() {
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = new ObjectMapper();
    }

    private String getGeminiApiUrl() {
        return "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;
    }

    public String generateAnalyticsInsights(String originalUrl, long totalClicks, String locationData) {
        String prompt = "You are an analytics expert. I have a shortened URL pointing to: " + originalUrl + ".\n" +
                "It has received a total of " + totalClicks + " clicks.\n" +
                "Here is some optional data about the clicks: " + locationData + ".\n" +
                "Provide a brief, 2-3 sentence insightful summary and recommendation for the owner of this link on how to improve its reach.";

        try {
            Map<String, Object> requestBody = new HashMap<>();

            Map<String, Object> part = new HashMap<>();
            part.put("text", prompt);

            Map<String, Object> content = new HashMap<>();
            content.put("parts", List.of(part));

            requestBody.put("contents", List.of(content));

            String jsonPayload = objectMapper.writeValueAsString(requestBody);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(getGeminiApiUrl()))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonNode rootNode = objectMapper.readTree(response.body());
                return rootNode.path("candidates").get(0)
                        .path("content").path("parts").get(0)
                        .path("text").asText();
            } else {
                return "AI Insights temporarily unavailable. Service returned status: " + response.statusCode();
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "Unable to generate insights at this time due to an internal error.";
        }
    }
}
