package com.example.quanliPT.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "rental_services")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RentalService {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private BigDecimal price;

    private String description;

    @Builder.Default
    private boolean active = true;
}
