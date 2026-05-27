package com.example.quanliPT.controller;

import com.example.quanliPT.model.Room;
import com.example.quanliPT.model.RoomStatus;
import com.example.quanliPT.repository.RoomRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class RoomControllerTest {

    private MockMvc mockMvc;

    @Mock
    private RoomRepository roomRepository;

    @InjectMocks
    private RoomController roomController;

    @Captor
    private ArgumentCaptor<Room> roomCaptor;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(roomController).build();
    }

    // ─── Test 1: Cập nhật phòng với status hợp lệ ─────────────────────────
    @Test
    void testUpdateRoom_ValidStatus_OCCUPIED() throws Exception {
        // Arrange
        Long roomId = 1L;
        Room existingRoom = Room.builder()
                .id(roomId)
                .roomNumber("101")
                .type("Standard")
                .price(java.math.BigDecimal.valueOf(2000000))
                .area(25.0)
                .status(RoomStatus.AVAILABLE) // trạng thái ban đầu
                .build();

        Room savedRoom = Room.builder()
                .id(roomId)
                .roomNumber("101")
                .type("Standard")
                .price(java.math.BigDecimal.valueOf(2000000))
                .area(25.0)
                .status(RoomStatus.OCCUPIED) // sau cập nhật
                .build();

        when(roomRepository.findById(roomId)).thenReturn(Optional.of(existingRoom));
        when(roomRepository.save(any(Room.class))).thenReturn(savedRoom);

        // Act & Assert
        mockMvc.perform(put("/api/rooms/{id}", roomId)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .param("roomNumber", "101")
                .param("type", "Standard")
                .param("price", "2000000")
                .param("area", "25")
                .param("status", "OCCUPIED")
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("OCCUPIED"));
    }

    // ─── Test 2: Cập nhật phòng với status không hợp lệ ───────────────────
    @Test
    void testUpdateRoom_InvalidStatus_FallbackToAvailable() throws Exception {
        // Arrange
        Long roomId = 2L;
        Room existingRoom = Room.builder()
                .id(roomId)
                .roomNumber("102")
                .type("VIP")
                .price(java.math.BigDecimal.valueOf(5000000))
                .area(40.0)
                .status(RoomStatus.AVAILABLE) // ban đầu là AVAILABLE
                .build();

        // Giả lập rằng roomRepository.save(roomCaptor.capture()) trả về room với status giữ nguyên AVAILABLE
        when(roomRepository.findById(roomId)).thenReturn(Optional.of(existingRoom));
        when(roomRepository.save(any(Room.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        mockMvc.perform(put("/api/rooms/{id}", roomId)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .param("roomNumber", "102")
                .param("type", "VIP")
                .param("price", "5000000")
                .param("area", "40")
                .param("status", "INVALID_STATUS")
        )
                .andExpect(status().isOk());

        // Capture room được lưu và kiểm tra status không thay đổi
        verify(roomRepository).save(roomCaptor.capture());
        Room savedRoom = roomCaptor.getValue();
        assertEquals(RoomStatus.AVAILABLE, savedRoom.getStatus());
    }
}
