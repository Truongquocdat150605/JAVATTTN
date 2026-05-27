// entire file content ...
package com.example.quanliPT.controller;

import com.example.quanliPT.model.ContactMessage;
import com.example.quanliPT.model.Contract;
import com.example.quanliPT.model.RentalRequest;
import com.example.quanliPT.model.RentalRequestStatus;
import com.example.quanliPT.model.RoomStatus;
import com.example.quanliPT.service.ContractBusinessService;
import com.example.quanliPT.repository.ContactMessageRepository;
import com.example.quanliPT.repository.ContractRepository;
import com.example.quanliPT.repository.RentalRequestRepository;
import com.example.quanliPT.repository.RoomRepository;
import com.example.quanliPT.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin/requests")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminRequestController {

    private final RentalRequestRepository rentalRequestRepository;
    private final ContactMessageRepository contactMessageRepository;
    private final UserRepository userRepository;
    private final ContractRepository contractRepository;
    private final RoomRepository roomRepository;
    private final ContractBusinessService contractBusinessService;

    @GetMapping("/rental")
    public List<RentalRequest> getAllRentalRequests() {
        return rentalRequestRepository.findAll();
    }

    @PutMapping("/rental/{id}/status")
    public ResponseEntity<RentalRequest> updateRentalRequestStatus(
            @PathVariable Long id,
            @RequestParam RentalRequestStatus status
    ) {
        RentalRequest request = rentalRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rental request not found"));
        request.setStatus(status);
        return ResponseEntity.ok(rentalRequestRepository.save(request));
    }

    @GetMapping("/contacts")
    public List<ContactMessage> getAllContactMessages() {
        return contactMessageRepository.findAll();
    }

    @PostMapping("/rental/{id}/approve-and-create-contract")
    public ResponseEntity<Contract> approveAndCreateContract(
            @PathVariable Long id,
            @RequestParam LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam BigDecimal rentPrice,
            @RequestParam BigDecimal deposit
    ) {
        RentalRequest request = rentalRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rental request not found"));
        var room = request.getRoom();
        if (room == null) {
            throw new RuntimeException("Rental request has no room");
        }

        Contract savedContract = contractBusinessService.createContractAndTenant(
                room.getId(),
                request.getFullName(),
                null,
                request.getPhone(),
                request.getIdentityNumber(),
                startDate,
                endDate,
                rentPrice,
                deposit
        );

        // ✅ THÊM ĐOẠN CODE NÀY - Cập nhật trạng thái phòng
        if (room != null) {
            room.setStatus(RoomStatus.OCCUPIED);
            roomRepository.save(room);
        }

        request.setStatus(RentalRequestStatus.APPROVED);
        rentalRequestRepository.save(request);

        return ResponseEntity.ok(savedContract);
    }
}
// ... goes in between
