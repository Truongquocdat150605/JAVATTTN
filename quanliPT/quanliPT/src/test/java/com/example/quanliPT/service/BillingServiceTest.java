package com.example.quanliPT.service;

import com.example.quanliPT.model.*;
import com.example.quanliPT.repository.ContractRepository;
import com.example.quanliPT.repository.InvoiceRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BillingServiceTest {

    @Mock
    private ContractRepository contractRepository;
    @Mock
    private InvoiceRepository invoiceRepository;

    @InjectMocks
    private BillingService billingService;

    @Captor
    private ArgumentCaptor<Invoice> invoiceCaptor;

    @Test
    void testGenerateInvoiceForContract_Success() {
        // Arrange
        // Tạo danh sách dịch vụ
        RentalService service1 = RentalService.builder()
                .price(BigDecimal.valueOf(500000))
                .build();
        RentalService service2 = RentalService.builder()
                .price(BigDecimal.valueOf(200000))
                .build();

        Room room = Room.builder()
                .id(1L)
                .services(List.of(service1, service2))
                .build();

        Contract contract = Contract.builder()
                .id(100L)
                .room(room)
                .rentPrice(BigDecimal.valueOf(3000000))
                .startDate(LocalDate.now())
                .build();

        // Act
        billingService.generateInvoiceForContract(contract);

        // Assert
        verify(invoiceRepository, times(1)).save(invoiceCaptor.capture());
        Invoice savedInvoice = invoiceCaptor.getValue();

        // Tính kỳ vọng: rentPrice + service1 + service2 = 3.000.000 + 500.000 + 200.000 = 3.700.000
        BigDecimal expectedTotal = BigDecimal.valueOf(3700000);
        assertEquals(expectedTotal, savedInvoice.getTotalAmount(),
                "Total amount must equal rent price + sum of service prices");

        assertEquals(InvoiceStatus.UNPAID, savedInvoice.getStatus());
        assertEquals(contract, savedInvoice.getContract());
    }
}
