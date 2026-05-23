package com.example.quanliPT.repository;

import com.example.quanliPT.model.Room;
import com.example.quanliPT.model.RoomStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByStatus(RoomStatus status);
    long countByStatus(RoomStatus status);
}
