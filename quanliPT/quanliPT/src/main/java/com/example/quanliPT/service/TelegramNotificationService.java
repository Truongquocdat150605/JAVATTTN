package com.example.quanliPT.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

@Service
@Slf4j
public class TelegramNotificationService {

    @Value("${app.telegram.bot-token:}")
    private String botToken;

    private final RestTemplate restTemplate = new RestTemplate();

    public void sendMessage(String chatId, String message) {
        if (isConfigMissing(chatId)) return;

        String url = String.format("https://api.telegram.org/bot%s/sendMessage?chat_id=%s&text=%s",
                botToken, chatId, message);
        try {
            restTemplate.getForObject(url, String.class);
            log.info("Telegram message sent successfully to {}", chatId);
        } catch (Exception e) {
            log.error("Failed to send Telegram message: {}", e.getMessage());
        }
    }

    public void sendDocument(String chatId, Resource pdfResource, String caption) {
        if (isConfigMissing(chatId)) return;

        String url = String.format("https://api.telegram.org/bot%s/sendDocument", botToken);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("chat_id", chatId);
        body.add("document", pdfResource);
        body.add("caption", caption);

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        try {
            restTemplate.postForObject(url, requestEntity, String.class);
            log.info("Telegram PDF document sent successfully to {}", chatId);
        } catch (Exception e) {
            log.error("Failed to send Telegram document: {}", e.getMessage());
        }
    }

    private boolean isConfigMissing(String chatId) {
        if (botToken == null || botToken.isEmpty() || chatId == null || chatId.isEmpty()) {
            log.warn("Telegram configurations missing (token or chatId). Action skipped.");
            return true;
        }
        return false;
    }
}
