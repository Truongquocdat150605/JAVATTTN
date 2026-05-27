package com.example.quanliPT.controller;

import com.example.quanliPT.model.*;
import com.example.quanliPT.repository.*;
import com.example.quanliPT.service.ContractBusinessService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class AdminRequestControllerTest {

    private MockMvc mockMvc;

    @Mock
    private RentalRequestRepository rentalRequestRepository;
    @Mock
    private ContactMessageRepository contactMessageRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private ContractRepository contractRepository;
    @Mock
    private RoomRepository roomRepository;
    @Mock
    private ContractBusinessService contractBusinessService;

    @InjectMocks
    private AdminRequestController adminRequestController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(adminRequestController).build();
    }

    @Test
    void testApproveAndCreateContract_Success() throws Exception {
        // Arrange
        Long requestId = 1L;
        Room room = Room.builder().id(10L).status(RoomStatus.AVAILABLE).build();
        RentalRequest request = RentalRequest.builder()
                .id(requestId)
                .room(room)
                .fullName("Nguyen Van A")
                .phone("0123456789")
                .identityNumber("123456789")
                .build();

        Contract savedContract = Contract.builder().id(100L).build();

        when(rentalRequestRepository.findById(requestId)).thenReturn(Optional.of(request));
        when(contractBusinessService.createContractAndTenant(anyLong(), anyString(), any(), anyString(), anyString(), any(), any(), any(), any()))
                .thenReturn(savedContract);

        // Act & Assert
        mockMvc.perform(post("/api/admin/requests/rental/{id}/approve-and-create-contract", requestId)
                .param("startDate", LocalDate.now().toString())
                .param("rentPrice", "3000000")
                .param("deposit", "3000000")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(100L));

        verify(roomRepository, times(1)).save(any(Room.class));
        verify(rentalRequestRepository, times(1)).save(any(RentalRequest.class));
    }
}
