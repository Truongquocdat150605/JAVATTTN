package com.example.quanliPT.config;

import com.example.quanliPT.dto.ApiResponse;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    // Xử lý các lỗi validation từ @Valid trên DTO
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ApiResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        log.error("Validation failed: {}", errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error("Lỗi validation dữ liệu đầu vào: " + errors.toString()));
    }

    // Xử lý các lỗi validation từ @RequestParam, @PathVariable (ConstraintViolationException)
    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ApiResponse> handleConstraintViolationException(ConstraintViolationException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getConstraintViolations().forEach(violation -> {
            // Lấy tên trường từ đường dẫn của violation
            String fieldName = violation.getPropertyPath().toString();
            // Nếu có nhiều phần, lấy phần cuối cùng (tên trường)
            if (fieldName.contains(".")) {
                fieldName = fieldName.substring(fieldName.lastIndexOf(".") + 1);
            }
            errors.put(fieldName, violation.getMessage());
        });
        log.error("Constraint violation: {}", errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error("Lỗi ràng buộc dữ liệu: " + errors.toString()));
    }

    // Xử lý các lỗi chung khác (ví dụ: RuntimeException từ service)
    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<ApiResponse> handleRuntimeException(RuntimeException ex) {
        log.error("Runtime error occurred: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.error("Lỗi hệ thống: " + ex.getMessage()));
    }

    // Xử lý các lỗi không xác định
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<ApiResponse> handleGenericException(Exception ex) {
        log.error("An unexpected error occurred: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.error("Đã xảy ra lỗi không xác định."));
    }
}
