package com.example.quanliPT.service;

import com.example.quanliPT.model.Room;
import com.example.quanliPT.model.RoomStatus;
import com.example.quanliPT.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;

    // 4 phòng trống rẻ nhất
    public List<Room> getPromoRooms() {
        Pageable limit4ByPriceAsc = PageRequest.of(0, 4, Sort.by(Sort.Direction.ASC, "price"));
        return roomRepository.findAvailableRooms(limit4ByPriceAsc);
    }

    // 4 phòng trống được ưu tiên theo diện tích lớn hoặc loại phòng
    public List<Room> getHotRooms() {
        // Ưu tiên: diện tích lớn trước, rồi đến type để ổn định
        Pageable limit4ByAreaDescThenTypeDesc = PageRequest.of(
                0,
                4,
                Sort.by(Sort.Direction.DESC, "area")
                        .and(Sort.by(Sort.Direction.DESC, "type"))
        );
        return roomRepository.findAvailableRooms(limit4ByAreaDescThenTypeDesc);
    }
}

