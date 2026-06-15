package com.example.quanliPT.controller;

import com.example.quanliPT.dto.ContactMessageDto;
import com.example.quanliPT.dto.PublicRentalRequestDto;
import com.example.quanliPT.model.ContactMessage;
import com.example.quanliPT.model.RentalRequest;
import com.example.quanliPT.repository.ContactMessageRepository;
import com.example.quanliPT.repository.RentalRequestRepository;
import com.example.quanliPT.repository.RoomRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final RoomRepository roomRepository;
    private final RentalRequestRepository rentalRequestRepository;
    private final ContactMessageRepository contactMessageRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @PostMapping("/rental-requests")
    public ResponseEntity<RentalRequest> createRentalRequest(@Valid @RequestBody PublicRentalRequestDto request) {
        var room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        RentalRequest rentalRequest = RentalRequest.builder()
                .room(room)
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .identityNumber(request.getIdentityNumber())
                .desiredMoveInDate(request.getDesiredMoveInDate())
                .note(request.getNote())
                .build();

        RentalRequest saved = rentalRequestRepository.save(rentalRequest);
        
        // Gửi thông báo realtime qua WebSocket đến admin
        messagingTemplate.convertAndSend("/topic/rental-requests", saved);
        
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/contacts")
    public ResponseEntity<ContactMessage> createContactMessage(@Valid @RequestBody ContactMessageDto request) {
        ContactMessage message = ContactMessage.builder()
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .message(request.getMessage())
                .build();
        return ResponseEntity.ok(contactMessageRepository.save(message));
    }
}