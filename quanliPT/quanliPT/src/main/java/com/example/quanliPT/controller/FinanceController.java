package com.example.quanliPT.controller;

import com.example.quanliPT.model.BusinessExpense;
import com.example.quanliPT.repository.BusinessExpenseRepository;
import com.example.quanliPT.service.FinanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/finance")
@RequiredArgsConstructor
public class FinanceController {

    private final FinanceService financeService;
    private final BusinessExpenseRepository expenseRepository;

    @GetMapping("/report")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getMonthlyReport(@RequestParam(defaultValue = "2026") int year) {
        return ResponseEntity.ok(financeService.getMonthlyReport(year));
    }

    @GetMapping("/expenses")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BusinessExpense>> getAllExpenses() {
        return ResponseEntity.ok(expenseRepository.findAll());
    }

    @PostMapping("/expenses")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BusinessExpense> createExpense(@RequestBody BusinessExpense expense) {
        return ResponseEntity.ok(expenseRepository.save(expense));
    }
}
