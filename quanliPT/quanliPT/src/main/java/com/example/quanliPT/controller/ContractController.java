// entire file content ...
package com.example.quanliPT.controller;

import com.example.quanliPT.model.Contract;
import com.example.quanliPT.model.ContractStatus;
import com.example.quanliPT.model.RoomStatus;
import com.example.quanliPT.repository.ContractRepository;
import com.example.quanliPT.repository.RoomRepository;
import com.example.quanliPT.repository.UserRepository;
import com.example.quanliPT.service.ContractBusinessService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/contracts")
@RequiredArgsConstructor
public class ContractController {

    private final ContractRepository contractRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final ContractBusinessService contractBusinessService;  // <-- THÊM DÒNG NÀY

    // ========== API HIỆN CÓ ==========
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Contract> getAllContracts() {
        return contractRepository.findAll();
    }

    @GetMapping("/my-contracts/{tenantId}")
    @PreAuthorize("@contractSecurity.canAccessTenantContracts(#tenantId, authentication)")
    public List<Contract> getMyContracts(@PathVariable Long tenantId) {
        return contractRepository.findByTenantId(tenantId);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('TENANT')")
    public List<Contract> getCurrentTenantContracts(Authentication authentication) {
        var user = userRepository.findByUsername(authentication.getName()).orElseThrow();
        return contractRepository.findByTenantId(user.getId());
    }

    // ========== API HIỆN CÓ (Chỉ nhận Contract object, KHÔNG tạo tenant) ==========
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Contract> createContract(@RequestBody Contract contract) {
        Contract saved = contractRepository.save(contract);
        if (saved.getRoom() != null) {
            saved.getRoom().setStatus(RoomStatus.OCCUPIED);
            roomRepository.save(saved.getRoom());
        }
        return ResponseEntity.ok(saved);
    }

    // ========== API MỚI: Tạo hợp đồng + Tự động tạo Tenant nếu chưa có ==========
    @PostMapping("/create-with-tenant")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Contract> createContractWithTenant(
            @RequestParam Long roomId,
            @RequestParam String tenantFullName,
            @RequestParam String tenantEmail,
            @RequestParam String tenantPhone,
            @RequestParam(required = false) String tenantIdentity,
            @RequestParam String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam BigDecimal rentPrice,
            @RequestParam BigDecimal deposit) {

        Contract contract = contractBusinessService.createContractAndTenant(
                roomId,
                tenantFullName,
                tenantEmail,
                tenantPhone,
                tenantIdentity,
                LocalDate.parse(startDate),
                endDate != null ? LocalDate.parse(endDate) : null,
                rentPrice,
                deposit
        );
        return ResponseEntity.ok(contract);
    }

    // ========== API HIỆN CÓ ==========
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Contract> updateContract(@PathVariable Long id, @RequestBody Contract contractDetails) {
        Contract contract = contractRepository.findById(id).orElseThrow();
        contract.setStartDate(contractDetails.getStartDate());
        contract.setEndDate(contractDetails.getEndDate());
        contract.setRentPrice(contractDetails.getRentPrice());
        contract.setDeposit(contractDetails.getDeposit());
        contract.setStatus(contractDetails.getStatus());
        contract.setActive(contractDetails.isActive());
        Contract saved = contractRepository.save(contract);

        if (saved.getRoom() != null) {
            boolean shouldFreeRoom = !saved.isActive()
                    || saved.getStatus() == ContractStatus.EXPIRED
                    || saved.getStatus() == ContractStatus.TERMINATED;
            saved.getRoom().setStatus(shouldFreeRoom ? RoomStatus.AVAILABLE : RoomStatus.OCCUPIED);
            roomRepository.save(saved.getRoom());
        }

        if (saved.getTenant() != null) {
            if (saved.getStatus() == ContractStatus.TERMINATED || !saved.isActive()) {
                saved.getTenant().setActive(false);
            } else if (saved.getStatus() == ContractStatus.ACTIVE && saved.isActive()) {
                saved.getTenant().setActive(true);
            }
            userRepository.save(saved.getTenant());
        }

        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteContract(@PathVariable Long id) {
        contractRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
// ... goes in between
