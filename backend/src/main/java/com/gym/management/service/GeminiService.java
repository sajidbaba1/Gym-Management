package com.gym.management.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

    public String analyzeReport(String reportData, String userQuestion) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String url = GEMINI_API_URL + "?key=" + apiKey;

        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> content = new HashMap<>();
        Map<String, Object> part = new HashMap<>();

        String prompt = "You are a business analyst. Analyze this revenue report for a Gym Management System and answer the question: "
                + userQuestion + "\n\nReport Data:\n" + reportData;

        part.put("text", prompt);
        content.put("parts", List.of(part));
        requestBody.put("contents", List.of(content));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(url, entity, Map.class);
            if (response == null)
                return "No response from Gemini API";

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            if (candidates == null || candidates.isEmpty())
                return "No content generated";

            @SuppressWarnings("unchecked")
            Map<String, Object> firstCandidate = candidates.get(0);
            @SuppressWarnings("unchecked")
            Map<String, Object> candidatesContent = (Map<String, Object>) firstCandidate.get("content");
            if (candidatesContent == null)
                return "Empty content in response";

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> parts = (List<Map<String, Object>>) candidatesContent.get("parts");
            if (parts == null || parts.isEmpty())
                return "No parts found in response";

            return parts.get(0).get("text").toString();
        } catch (Exception e) {
            return "Error calling Gemini API: " + e.getMessage();
        }
    }
}
