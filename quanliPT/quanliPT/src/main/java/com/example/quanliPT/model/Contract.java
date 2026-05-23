package com.example.quanliPT.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.math.BigDecimal;

@Entity
@Table(name = "contracts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contract {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "tenant_id", nullable = false)
    private User tenant;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;
    
    @Column(name = "end_date")
    private LocalDate endDate;
    
    @Column(name = "rent_price", nullable = false)
    private BigDecimal rentPrice; // Giá thuê thỏa thuận lúc ký hợp đồng
    
    @Column(nullable = false)
    private BigDecimal deposit; // Tiền đặt cọc

    @Enumerated(EnumType.STRING)
    private ContractStatus status = ContractStatus.ACTIVE;
    
    @Builder.Default
    private boolean active = true;
}
