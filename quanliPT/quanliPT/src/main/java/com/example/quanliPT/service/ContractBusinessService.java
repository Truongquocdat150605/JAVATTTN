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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ContractBusinessService {

    private final ContractRepository contractRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Tạo hợp đồng mới và cấp tài khoản Tenant nếu chưa có
     */
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
        
        // 1. Tìm Room
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng với ID: " + roomId));
        
        if (room.getStatus() != RoomStatus.AVAILABLE) {
            throw new RuntimeException("Phòng không ở trạng thái trống để thuê.");
        }

        // 2. Xác định username/email để tạo/khôi phục tài khoản tenant
        String loginIdentifier = tenantEmail != null && !tenantEmail.isBlank() ? tenantEmail : tenantPhone;
        if (loginIdentifier == null || loginIdentifier.isBlank()) {
            throw new RuntimeException("Thông tin email hoặc số điện thoại khách hàng không được để trống.");
        }

        User tenant;
        Optional<User> existingUser;
        if (loginIdentifier.contains("@")) {
            existingUser = userRepository.findByEmail(loginIdentifier);
        } else {
            existingUser = userRepository.findByUsername(loginIdentifier);
        }

        if (existingUser.isPresent()) {
            tenant = existingUser.get();
        } else {
            String emailValue = tenantEmail != null && !tenantEmail.isBlank() ? tenantEmail : tenantPhone;
            String usernameValue = loginIdentifier;

            tenant = User.builder()
                    .username(usernameValue)
                    .email(emailValue)
                    .fullName(tenantFullName)
                    .phone(tenantPhone)
                    .identityNumber(tenantIdentity)
                    .password(passwordEncoder.encode("123456")) // Pass mặc định
                    .role(Role.TENANT)
                    .active(true)
                    .build();
            tenant = userRepository.save(tenant);
        }

        // 3. Tạo Hợp đồng
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

        // 4. Đổi trạng thái Room
        room.setStatus(RoomStatus.OCCUPIED);
        roomRepository.save(room);

        return contract;
    }
}
