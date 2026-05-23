package com.example.quanliPT.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String fullName;
    
    @Column(nullable = false)
    private String email;
    
    private String phone;
    
    @Column(name = "identity_number")
    private String identityNumber; // CCCD/ID Card
    
    private String address; // Quê quán/Thường trú
    private String avatar;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "telegram_chat_id")
    private String telegramChatId;

    @Builder.Default
    private boolean active = true;
}
