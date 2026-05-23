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

    @Transactional
    public void generateMonthlyInvoices() {
        log.info("Starting automated monthly invoice generation for active contracts...");
        
        List<Contract> activeContracts = contractRepository.findByActiveTrueAndStatus(ContractStatus.ACTIVE);
        
        for (Contract contract : activeContracts) {
            try {
                // Check if invoice already exists for this contract in this month to prevent duplicates
                // (Simplified logic: assuming one invoice per month)
                
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
                        .notes("Hóa đơn tự động tháng " + LocalDateTime.now().getMonthValue())
                        .build();
                
                invoiceRepository.save(invoice);
                log.info("Generated invoice for Contract ID: {} - Room: {}", contract.getId(), contract.getRoom().getRoomNumber());
            } catch (Exception e) {
                log.error("Failed to generate invoice for Contract ID: {}. Error: {}", contract.getId(), e.getMessage());
            }
        }
    }
}
