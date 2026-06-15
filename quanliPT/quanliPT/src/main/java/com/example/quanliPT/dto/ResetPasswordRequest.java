package com.example.quanliPT.dto;

import lombok.Data;

@Data
public class ResetPasswordRequest {
    private String token;
    private String email;
    private String newPassword;
}
