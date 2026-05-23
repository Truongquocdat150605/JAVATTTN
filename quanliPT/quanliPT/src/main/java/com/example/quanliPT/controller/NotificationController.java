package com.example.quanliPT.controller;

import com.example.quanliPT.service.TelegramNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final TelegramNotificationService telegramService;

    @PostMapping("/telegram/send-pdf")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> sendPdfToTelegram(
            @RequestParam("chatId") String chatId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "caption", defaultValue = "Hóa đơn tiền phòng của bạn") String caption
    ) throws IOException {
        
        ByteArrayResource resource = new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        };

        telegramService.sendDocument(chatId, resource, caption);
        
        return ResponseEntity.ok("Notification request processed.");
    }
}
