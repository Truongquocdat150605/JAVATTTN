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
    private final BillingService billingService;

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

        // 1. Kiểm tra phòng và lấy thông tin
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng"));

        // 2. Xử lý User (Lấy sẵn hoặc tạo mới)
        String loginIdentifier = tenantPhone;
        Optional<User> existingUser = userRepository.findByPhone(loginIdentifier);

        User tenant;
        if (existingUser.isPresent()) {
            tenant = existingUser.get();
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

        // 5. MỚI: Tự động tạo hóa đơn kỳ đầu tiên
        // Chúng ta gọi BillingService để hệ thống tự tạo hóa đơn ngay khi ký hợp đồng
        // Đảm bảo BillingService của bạn có hàm generateInvoiceForContract(Contract
        // contract)
        try {
            // Nếu bạn chưa có hàm generateInvoiceForContract, hãy báo mình để mình viết
            // cho!
            billingService.generateInvoiceForContract(contract);
        } catch (Exception e) {
            // Log lỗi để admin biết, nhưng không làm rollback cả hợp đồng
            System.err.println("Lỗi khi tự động tạo hóa đơn: " + e.getMessage());
        }

        return contract;
    }
}
