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
        log.info("Starting automated monthly invoice generation...");
        List<Contract> activeContracts = contractRepository.findByActiveTrueAndStatus(ContractStatus.ACTIVE);
        log.debug("Found {} active contracts for monthly invoicing", activeContracts.size());
        for (Contract contract : activeContracts) {
            try {
                generateInvoiceForContract(contract);
            } catch (Exception e) {
                log.error("Failed to generate monthly invoice for contract id={}: {}", contract.getId(), e.getMessage(), e);
            }
        }
        log.info("Monthly invoice generation completed");
    }

    @Transactional
    public void generateInvoiceForContract(Contract contract) {
        log.info("Generating invoice for Contract ID: {}", contract.getId());
        log.debug("Contract details: rentPrice={}, servicesCount={}",
                contract.getRentPrice(),
                contract.getRoom().getServices() != null ? contract.getRoom().getServices().size() : 0);

        BigDecimal roomServiceFees = contract.getRoom().getServices().stream()
                .map(RentalService::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        log.debug("Total service fees calculated: {}", roomServiceFees);

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
        log.info("Invoice saved for contract id={} with totalAmount={}", contract.getId(), invoice.getTotalAmount());
    }
}
