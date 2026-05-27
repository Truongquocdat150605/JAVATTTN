package com.example.quanliPT.service;

import com.example.quanliPT.model.*;
import com.example.quanliPT.repository.ContractRepository;
import com.example.quanliPT.repository.RoomRepository;
import com.example.quanliPT.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ContractBusinessServiceTest {

    @Mock
    private ContractRepository contractRepository;
    @Mock
    private RoomRepository roomRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private BillingService billingService;

    @InjectMocks
    private ContractBusinessService contractBusinessService;

    private Room mockRoom;
    private User mockUser;

    @BeforeEach
    void setUp() {
        mockRoom = Room.builder()
                .id(1L)
                .status(RoomStatus.AVAILABLE)
                .build();

        mockUser = User.builder()
                .id(1L)
                .username("0123456789")
                .phone("0123456789")
                .fullName("Nguyen Van A")
                .build();
    }

    @Test
    void testCreateContractAndTenant_Success_NewTenant() {
        // Arrange
        when(roomRepository.findById(1L)).thenReturn(Optional.of(mockRoom));
        when(userRepository.findByPhone("0123456789")).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("hashed_password");
        when(userRepository.save(any(User.class))).thenReturn(mockUser);
        when(contractRepository.save(any(Contract.class))).thenReturn(Contract.builder().id(100L).build());

        // Act
        Contract result = contractBusinessService.createContractAndTenant(
                1L, "Nguyen Van A", "a@gmail.com", "0123456789", "123456789",
                LocalDate.now(), LocalDate.now().plusMonths(6),
                BigDecimal.valueOf(3000000), BigDecimal.valueOf(3000000)
        );

        // Assert
        assertNotNull(result);
        assertEquals(RoomStatus.OCCUPIED, mockRoom.getStatus());
        verify(userRepository, times(1)).save(any(User.class));
        verify(roomRepository, times(1)).save(mockRoom);
        verify(contractRepository, times(1)).save(any(Contract.class));
        verify(billingService, times(1)).generateInvoiceForContract(any(Contract.class));
    }

    @Test
    void testCreateContractAndTenant_Fail_RoomNotFound() {
        // Arrange
        when(roomRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            contractBusinessService.createContractAndTenant(
                    1L, "Nguyen Van A", "a@gmail.com", "0123456789", "123456789",
                    LocalDate.now(), LocalDate.now().plusMonths(6),
                    BigDecimal.valueOf(3000000), BigDecimal.valueOf(3000000)
            );
        });

        assertEquals("Không tìm thấy phòng", exception.getMessage());
        verify(contractRepository, never()).save(any());
    }

    @Test
    void testCreateContractAndTenant_Success_ExistingTenant() {
        // Arrange
        when(roomRepository.findById(1L)).thenReturn(Optional.of(mockRoom));
        when(userRepository.findByPhone("0123456789")).thenReturn(Optional.of(mockUser));
        when(userRepository.save(any(User.class))).thenReturn(mockUser);
        when(contractRepository.save(any(Contract.class))).thenReturn(Contract.builder().id(100L).build());

        // Act
        Contract result = contractBusinessService.createContractAndTenant(
                1L, "Nguyen Van A Updated", "updated@gmail.com", "0123456789", "123456789",
                LocalDate.now(), LocalDate.now().plusMonths(6),
                BigDecimal.valueOf(3000000), BigDecimal.valueOf(3000000)
        );

        // Assert
        assertNotNull(result);
        assertEquals(RoomStatus.OCCUPIED, mockRoom.getStatus());
        verify(userRepository, times(1)).save(mockUser); // Chỉ update, không tạo mới
        verify(passwordEncoder, never()).encode(anyString());
    }
}
