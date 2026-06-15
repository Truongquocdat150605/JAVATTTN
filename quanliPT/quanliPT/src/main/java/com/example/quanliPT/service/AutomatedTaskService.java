package com.example.quanliPT.service;

import com.example.quanliPT.model.Contract;
import com.example.quanliPT.model.ContractStatus;
import com.example.quanliPT.model.Invoice;
import com.example.quanliPT.model.InvoiceStatus;
import com.example.quanliPT.model.Notification;
import com.example.quanliPT.model.Role;
import com.example.quanliPT.model.User;
import com.example.quanliPT.repository.ContractRepository;
import com.example.quanliPT.repository.InvoiceRepository;
import com.example.quanliPT.repository.NotificationRepository;
import com.example.quanliPT.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AutomatedTaskService {

    private final InvoiceRepository invoiceRepository;
    private final ContractRepository contractRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    /**
     * Chạy vào lúc 00:00 mỗi ngày để kiểm tra các hóa đơn quá hạn thanh toán.
     * Gửi thông báo cho Admin thay vì tự động chuyển trạng thái.
     */
    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void checkOverdueInvoices() {
        log.info("Bắt đầu tiến trình tự động quét Hóa Đơn quá hạn...");
        List<Invoice> unpaidInvoices = invoiceRepository.findByStatus(InvoiceStatus.UNPAID);
        LocalDateTime now = LocalDateTime.now();
        int overdueCount = 0;

        for (Invoice invoice : unpaidInvoices) {
            LocalDateTime deadline = invoice.getDueDate() != null 
                ? invoice.getDueDate() 
                : (invoice.getBillingDate() != null ? invoice.getBillingDate().plusDays(5) : null);

            if (deadline != null && now.isAfter(deadline)) {
                overdueCount++;
                String title = "Cảnh báo Hóa đơn quá hạn";
                String content = String.format("Hóa đơn #%d của Phòng %s đã lố hạn thanh toán từ ngày %s. Vui lòng kiểm tra lại.",
                        invoice.getId(),
                        invoice.getContract().getRoom().getRoomNumber(),
                        deadline.toLocalDate().toString());
                
                notifyAdmins(title, content);
            }
        }
        log.info("Hoàn tất quét Hóa Đơn. Ghi nhận {} hóa đơn đã quá hạn (thông báo cho Admin).", overdueCount);
    }

    /**
     * Chạy vào lúc 00:05 mỗi ngày để kiểm tra các hợp đồng hết hạn.
     * Gửi thông báo cho Admin thay vì tự động kết thúc hợp đồng.
     */
    @Scheduled(cron = "0 5 0 * * ?")
    @Transactional
    public void checkExpiredContracts() {
        log.info("Bắt đầu tiến trình tự động quét Hợp Đồng hết hạn...");
        List<Contract> activeContracts = contractRepository.findByActiveTrueAndStatus(ContractStatus.ACTIVE);
        LocalDate today = LocalDate.now();
        int expiredCount = 0;

        for (Contract contract : activeContracts) {
            if (contract.getEndDate() != null && contract.getEndDate().isBefore(today)) {
                expiredCount++;
                String title = "Cảnh báo Hợp đồng hết hạn";
                String content = String.format("Hợp đồng #%d của Phòng %s (Khách thuê: %s) đã hết hạn vào ngày %s. Cần xem xét gia hạn hoặc thanh lý.",
                        contract.getId(),
                        contract.getRoom().getRoomNumber(),
                        contract.getTenant().getFullName(),
                        contract.getEndDate().toString());
                
                notifyAdmins(title, content);
            }
        }
        log.info("Hoàn tất quét Hợp Đồng. Ghi nhận {} hợp đồng đã hết hạn (thông báo cho Admin).", expiredCount);
    }

    private void notifyAdmins(String title, String content) {
        List<User> admins = userRepository.findByRoleAndActiveTrue(Role.ADMIN);
        for (User admin : admins) {
            Notification notification = Notification.builder()
                    .title(title)
                    .content(content)
                    .targetUserId(admin.getId())
                    .broadcast(false)
                    .isRead(false)
                    .createdAt(LocalDateTime.now())
                    .build();
            notificationRepository.save(notification);
        }
    }
}
