package com.example.quanliPT.controller;

import com.example.quanliPT.model.MaintenanceRequest;
import com.example.quanliPT.model.IssueStatus;
import com.example.quanliPT.model.ContractStatus;
import com.example.quanliPT.repository.RoomRepository;
import com.example.quanliPT.repository.MaintenanceRequestRepository;
import com.example.quanliPT.repository.ContractRepository;
import com.example.quanliPT.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceController {

    private final MaintenanceRequestRepository issueRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final ContractRepository contractRepository;

    public MaintenanceController(
            MaintenanceRequestRepository issueRepository,
            UserRepository userRepository,
            RoomRepository roomRepository,
            ContractRepository contractRepository
    ) {
        this.issueRepository = issueRepository;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.contractRepository = contractRepository;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<MaintenanceRequest>> getAllIssues() {
        return ResponseEntity.ok(issueRepository.findAll());
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<List<MaintenanceRequest>> getMyIssues(Authentication authentication) {
        var user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(issueRepository.findByTenant(user));
    }

    @PostMapping
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<MaintenanceRequest> createIssue(
            Authentication authentication,
            @RequestParam Long roomId,
            @RequestParam String description
    ) {
        var user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        var room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        boolean isTenantRoom = contractRepository
                .findByTenantIdAndActiveTrueAndStatus(user.getId(), ContractStatus.ACTIVE)
                .stream()
                .anyMatch(contract -> contract.getRoom() != null && contract.getRoom().getId().equals(roomId));
        if (!isTenantRoom) {
            throw new RuntimeException("Bạn không có hợp đồng hiệu lực với phòng này");
        }
        MaintenanceRequest req = MaintenanceRequest.builder()
                .tenant(user)
                .room(room)
                .description(description)
                .status(IssueStatus.PENDING)
                .build();
        return ResponseEntity.ok(issueRepository.save(req));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MaintenanceRequest> updateStatus(
            @PathVariable Long id, 
            @RequestParam IssueStatus status) {
        
        MaintenanceRequest issue = issueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found"));
        
        issue.setStatus(status);
        return ResponseEntity.ok(issueRepository.save(issue));
    }
}
