package com.example.quanliPT.controller;

import com.example.quanliPT.model.*;
import com.example.quanliPT.repository.InvoiceRepository;
import com.example.quanliPT.repository.PaymentTransactionRepository;
import com.example.quanliPT.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final InvoiceRepository invoiceRepository;
    private final PaymentTransactionRepository paymentRepository;
    private final UserRepository userRepository;

    @PostMapping("/invoices/{invoiceId}/create-qr")
    @PreAuthorize("hasAnyRole('TENANT','ADMIN')")
    public ResponseEntity<?> createQrPayment(@PathVariable Long invoiceId, Authentication authentication) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin) {
            User user = userRepository.findByUsername(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            if (invoice.getContract() == null || invoice.getContract().getTenant() == null
                    || !invoice.getContract().getTenant().getId().equals(user.getId())) {
                throw new RuntimeException("Bạn không có quyền thanh toán hóa đơn này");
            }
        }

        String code = "PTINV" + invoiceId + "_" + System.currentTimeMillis();
        String qrUrl = "https://img.vietqr.io/image/970422-0000000000-qr_only.png"
                + "?amount=" + invoice.getTotalAmount().intValue()
                + "&addInfo=" + code
                + "&accountName=SMART_PHONG_TRO";

        PaymentTransaction tx = PaymentTransaction.builder()
                .invoice(invoice)
                .method(PaymentMethod.QR)
                .status(PaymentStatus.PENDING)
                .amount(invoice.getTotalAmount())
                .transactionCode(code)
                .qrUrl(qrUrl)
                .notes("QR thanh toán hóa đơn phòng trọ")
                .build();

        return ResponseEntity.ok(paymentRepository.save(tx));
    }

    @PutMapping("/{paymentId}/confirm")
    @PreAuthorize("hasAnyRole('TENANT','ADMIN')")
    public ResponseEntity<?> confirmPayment(@PathVariable Long paymentId, Authentication authentication) {
        PaymentTransaction tx = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin) {
            User user = userRepository.findByUsername(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            if (tx.getInvoice() == null || tx.getInvoice().getContract() == null || tx.getInvoice().getContract().getTenant() == null
                    || !tx.getInvoice().getContract().getTenant().getId().equals(user.getId())) {
                throw new RuntimeException("Bạn không có quyền xác nhận thanh toán này");
            }
        }

        tx.setStatus(PaymentStatus.COMPLETED);
        paymentRepository.save(tx);

        Invoice invoice = tx.getInvoice();
        invoice.setStatus(InvoiceStatus.PAID);
        if (invoice.getPaymentDate() == null) {
            invoice.setPaymentDate(LocalDateTime.now());
        }
        invoiceRepository.save(invoice);

        return ResponseEntity.ok(Map.of("success", true, "message", "Xác nhận thanh toán thành công"));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<List<PaymentTransaction>> getMyPayments(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(paymentRepository.findByInvoiceContractTenantId(user.getId()));
    }

    @GetMapping("/invoice/{invoiceId}")
    @PreAuthorize("@invoiceSecurity.canAccessInvoice(#invoiceId, authentication)")
    public ResponseEntity<List<PaymentTransaction>> getPaymentsByInvoice(@PathVariable Long invoiceId) {
        return ResponseEntity.ok(paymentRepository.findByInvoiceId(invoiceId));
    }
}
