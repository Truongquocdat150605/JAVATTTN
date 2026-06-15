package com.example.quanliPT.service;

import com.example.quanliPT.model.Contract;
import com.example.quanliPT.model.ContractStatus;
import com.example.quanliPT.model.Role;
import com.example.quanliPT.model.Room;
import com.example.quanliPT.model.RoomStatus;
import com.example.quanliPT.model.User;
import com.example.quanliPT.repository.ContractRepository;
import com.example.quanliPT.repository.RoomRepository;
import com.example.quanliPT.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContractBusinessService {

    private final ContractRepository contractRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final BillingService billingService;

    @Transactional
    @CacheEvict(value = {"roomsAvailable", "roomsById"}, allEntries = true)
    public Contract createContractAndTenant(
            Long roomId,
            String tenantFullName,
            String tenantEmail,
            String tenantPhone,
            String tenantIdentity,
            LocalDate startDate,
            LocalDate endDate,
            BigDecimal rentPrice,
            BigDecimal deposit) {

        log.info("Starting createContractAndTenant for roomId={}, tenantPhone={}", roomId, tenantPhone);

        // 1. Lấy phòng
        log.debug("Looking up room with id={}", roomId);
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> {
                    log.error("Room not found with id={}", roomId);
                    return new RuntimeException("Không tìm thấy phòng");
                });
        log.debug("Found room: id={}, status={}", room.getId(), room.getStatus());

        // 2. Tìm hoặc tạo User
        String loginIdentifier = tenantPhone;
        log.debug("Looking up user by phone={}", loginIdentifier);
        java.util.List<User> usersByPhone = userRepository.findByPhone(loginIdentifier);

        User tenant;
        if (!usersByPhone.isEmpty()) {
            tenant = usersByPhone.get(0); // Lấy user đầu tiên nếu có nhiều
            log.debug("Existing user found: id={}, username={}", tenant.getId(), tenant.getUsername());
            // Cập nhật thông tin nếu cần
            if (tenantEmail != null) tenant.setEmail(tenantEmail);
            if (tenantFullName != null) tenant.setFullName(tenantFullName);
            if (tenantIdentity != null) tenant.setIdentityNumber(tenantIdentity);
            tenant = userRepository.save(tenant);
            log.info("Updated existing tenant id={}", tenant.getId());
        } else {
            log.debug("No existing user found, creating new tenant");
            tenant = User.builder()
                    .username(tenantPhone)
                    .email(tenantEmail != null ? tenantEmail : tenantPhone + "@example.com")
                    .fullName(tenantFullName)
                    .phone(tenantPhone)
                    .identityNumber(tenantIdentity)
                    .password(passwordEncoder.encode("123456"))
                    .role(Role.TENANT)
                    .active(true)
                    .build();
            tenant = userRepository.save(tenant);
            log.info("Created new tenant id={}, username={}", tenant.getId(), tenant.getUsername());
        }

        // 3. Tạo hợp đồng
        log.debug("Creating contract for roomId={}, tenantId={}", room.getId(), tenant.getId());
        Contract contract = Contract.builder()
                .room(room)
                .tenant(tenant)
                .startDate(startDate)
                .endDate(endDate)
                .rentPrice(rentPrice)
                .deposit(deposit)
                .status(ContractStatus.ACTIVE)
                .active(true)
                .build();

        contract = contractRepository.save(contract);
        log.info("Contract created with id={}, status=ACTIVE", contract.getId());

        // 4. Đổi trạng thái phòng
        log.debug("Updating room status to OCCUPIED for roomId={}", room.getId());
        room.setStatus(RoomStatus.OCCUPIED);
        log.info("Room id={} status changed to {}", room.getId(), room.getStatus());
        roomRepository.save(room);

        // 5. Tự động tạo hóa đơn kỳ đầu
        log.debug("Generating initial invoice for contract id={}", contract.getId());
        try {
            billingService.generateInvoiceForContract(contract);
            log.info("Initial invoice generated for contract id={}", contract.getId());
        } catch (Exception e) {
            log.error("Failed to generate initial invoice for contract id={}: {}", contract.getId(), e.getMessage(), e);
        }

        log.info("Completed createContractAndTenant successfully for contractId={}", contract.getId());
        return contract;
    }
}
