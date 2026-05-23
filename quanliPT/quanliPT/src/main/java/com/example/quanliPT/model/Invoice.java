package com.example.quanliPT.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "invoices")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "contract_id", nullable = false)
    private Contract contract;

    @Column(nullable = false)
    private BigDecimal rentalAmount;
    
    // Electricity
    private Double electricityStart;
    private Double electricityEnd;
    private BigDecimal electricityPrice;
    private BigDecimal electricityAmount;
    
    // Water
    private Double waterStart;
    private Double waterEnd;
    private BigDecimal waterPrice;
    private BigDecimal waterAmount;
    
    private BigDecimal serviceAmount; // Wifi, Cleaning, etc.
    @Column(nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "billing_date")
    private LocalDateTime billingDate;
    
    @Column(name = "payment_date")
    private LocalDateTime paymentDate;
    
    @Column(name = "due_date")
    private LocalDateTime dueDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InvoiceStatus status = InvoiceStatus.UNPAID;
    
    private String notes;
}
