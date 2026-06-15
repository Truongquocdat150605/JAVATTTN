package com.example.quanliPT.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    @org.springframework.scheduling.annotation.Async("taskExecutor")
    public void sendResetEmail(String toEmail, String token, String fullName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            if (fromEmail != null && !fromEmail.isBlank()) {
                helper.setFrom(fromEmail);
            }
            helper.setSubject("Smart Phòng Trọ - Mã đặt lại mật khẩu");
            helper.setText(buildResetEmailHtml(token, fullName), true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Không thể tạo email đặt lại mật khẩu", e);
        }
    }

    private String buildResetEmailHtml(String token, String fullName) {
        String displayName = fullName == null || fullName.isBlank() ? "bạn" : fullName;
        String safeDisplayName = HtmlUtils.htmlEscape(displayName);
        String safeToken = HtmlUtils.htmlEscape(token);
        return """
                <div style="font-family:Arial,sans-serif;line-height:1.6;color:#222">
                    <h2>Đặt lại mật khẩu Smart Phòng Trọ</h2>
                    <p>Xin chào %s,</p>
                    <p>Mã xác thực đặt lại mật khẩu của bạn là:</p>
                    <div style="font-size:28px;font-weight:700;letter-spacing:6px;margin:18px 0;color:#1976d2">%s</div>
                    <p>Mã này có hiệu lực trong 15 phút. Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
                </div>
                """.formatted(safeDisplayName, safeToken);
    }
}
