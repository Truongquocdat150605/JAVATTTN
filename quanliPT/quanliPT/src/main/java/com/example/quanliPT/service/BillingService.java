package com.example.quanliPT.service;

import com.example.quanliPT.model.*;
import com.example.quanliPT.repository.ContractRepository;
import com.example.quanliPT.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
public class BillingService {

    private final ContractRepository contractRepository;
    private final InvoiceRepository invoiceRepository;

    // 1. Dùng cho Scheduler hàng tháng
    @Transactional
    public void generateMonthlyInvoices() {
        log.info("Starting automated monthly invoice generation...");
        List<Contract> activeContracts = contractRepository.findByActiveTrueAndStatus(ContractStatus.ACTIVE);
        for (Contract contract : activeContracts) {
            generateInvoiceForContract(contract);
        }
    }

    // 2. Dùng cho việc tạo hóa đơn ngay khi ký hợp đồng
    @Transactional
    public void generateInvoiceForContract(Contract contract) {
        log.info("Generating invoice for Contract ID: {}", contract.getId());

        BigDecimal roomServiceFees = contract.getRoom().getServices().stream()
                .map(RentalService::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Invoice invoice = Invoice.builder()
                .contract(contract)
                .rentalAmount(contract.getRentPrice())
                .electricityStart(0.0) 
                .electricityEnd(0.0)
                .electricityPrice(BigDecimal.valueOf(3500))
                .waterStart(0.0) 
                .waterEnd(0.0)
                .waterPrice(BigDecimal.valueOf(15000))
                .serviceAmount(roomServiceFees)
                .totalAmount(contract.getRentPrice().add(roomServiceFees)) 
                .billingDate(LocalDateTime.now())
                .status(InvoiceStatus.UNPAID)
                .notes("Hóa đơn tháng " + LocalDateTime.now().getMonthValue())
                .build();
        
        invoiceRepository.save(invoice);
    }
}