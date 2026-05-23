package com.example.quanliPT.repository;

import com.example.quanliPT.model.Invoice;
import com.example.quanliPT.model.InvoiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import java.time.LocalDateTime;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByContractTenantId(Long tenantId);
    long countByStatus(InvoiceStatus status);
    List<Invoice> findByBillingDateBetween(LocalDateTime start, LocalDateTime end);
}
