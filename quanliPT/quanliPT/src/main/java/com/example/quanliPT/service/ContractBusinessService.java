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
import lombok.extern.slf4j.Slf4j; // Thêm import này
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j // Thêm annotation này
public class ContractBusinessService {

    private final ContractRepository contractRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final BillingService billingService;

    @Transactional
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

        // 1. Lấy phòng
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng"));

        // 2. Tìm hoặc tạo User
        String loginIdentifier = tenantPhone;
        Optional<User> existingUser = userRepository.findByPhone(loginIdentifier);

        User tenant;
        if (existingUser.isPresent()) {
            tenant = existingUser.get();
            // Cập nhật thông tin nếu cần
            if (tenantEmail != null) tenant.setEmail(tenantEmail);
            if (tenantFullName != null) tenant.setFullName(tenantFullName);
            if (tenantIdentity != null) tenant.setIdentityNumber(tenantIdentity);
            tenant = userRepository.save(tenant);
        } else {
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
        }

        // 3. Tạo hợp đồng
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

        // 4. Đổi trạng thái phòng
        room.setStatus(RoomStatus.OCCUPIED);
        log.info("ContractBusinessService: Đang cập nhật trạng thái phòng ID {} thành {}", room.getId(), room.getStatus()); // Thêm log
        roomRepository.save(room);

        // 5. Tự động tạo hóa đơn kỳ đầu
        try {
            billingService.generateInvoiceForContract(contract);
        } catch (Exception e) {
            System.err.println("Lỗi khi tự động tạo hóa đơn: " + e.getMessage());
        }

        return contract;
    }
}
