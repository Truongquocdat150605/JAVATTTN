package com.example.quanliPT.service;

import com.example.quanliPT.model.Contract;
import com.example.quanliPT.model.Room;
import com.example.quanliPT.model.RoomStatus;
import com.example.quanliPT.model.User;
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

    @InjectMocks
    private ContractBusinessService contractBusinessService;

    private Room mockRoom;
    private User mockTenant;

    @BeforeEach
    void setUp() {
        mockRoom = new Room();
        mockRoom.setId(1L);
        mockRoom.setStatus(RoomStatus.AVAILABLE);

        mockTenant = new User();
        mockTenant.setId(1L);
        mockTenant.setEmail("test@tenant.com");
    }

    @Test
    @SuppressWarnings("null")
    void testCreateContract_Success_NewTenant() {
        when(roomRepository.findById(1L)).thenReturn(Optional.of(mockRoom));
        when(userRepository.findByEmail("new@tenant.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("123456")).thenReturn("hashedPassword");
        
        User savedUser = new User();
        savedUser.setEmail("new@tenant.com");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        
        Contract savedContract = new Contract();
        savedContract.setId(100L);
        when(contractRepository.save(any(Contract.class))).thenReturn(savedContract);

        Contract result = contractBusinessService.createContractAndTenant(
                1L, "Nguyen Van A", "new@tenant.com", "0123456789", "123456789",
                LocalDate.now(), LocalDate.now().plusMonths(6),
                BigDecimal.valueOf(3000000), BigDecimal.valueOf(3000000)
        );

        assertNotNull(result);
        assertEquals(RoomStatus.OCCUPIED, mockRoom.getStatus());
        verify(userRepository, times(1)).save(any(User.class));
        verify(roomRepository, times(1)).save(mockRoom);
        verify(contractRepository, times(1)).save(any(Contract.class));
    }

    @Test
    @SuppressWarnings("null")
    void testCreateContract_Fail_RoomNotAvailable() {
        mockRoom.setStatus(RoomStatus.OCCUPIED);
        when(roomRepository.findById(1L)).thenReturn(Optional.of(mockRoom));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            contractBusinessService.createContractAndTenant(
                    1L, "Nguyen Van A", "new@tenant.com", "0123456789", "123456789",
                    LocalDate.now(), LocalDate.now().plusMonths(6),
                    BigDecimal.valueOf(3000000), BigDecimal.valueOf(3000000)
            );
        });

        assertEquals("Phòng không ở trạng thái trống để thuê.", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
        verify(contractRepository, never()).save(any(Contract.class));
    }
}
