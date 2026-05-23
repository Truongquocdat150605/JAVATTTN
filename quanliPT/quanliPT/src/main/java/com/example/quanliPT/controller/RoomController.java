package com.example.quanliPT.controller;

import com.example.quanliPT.model.Room;
import com.example.quanliPT.model.RoomStatus;
import com.example.quanliPT.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomRepository roomRepository;

    private final String UPLOAD_DIR = "uploads/";

    // ─── GET: Lấy tất cả phòng ────────────────────────────────────────────────
    @GetMapping
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    // ─── GET: Lấy phòng còn trống ─────────────────────────────────────────────
    @GetMapping("/available")
    public List<Room> getAvailableRooms() {
        return roomRepository.findByStatus(RoomStatus.AVAILABLE);
    }

    // ─── POST: Tạo phòng với ảnh (Multipart) ─────────────────────────────────
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createRoom(
            @RequestParam("roomNumber") String roomNumber,
            @RequestParam("type") String type,
            @RequestParam("price") String priceStr,
            @RequestParam("area") String areaStr,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "image", required = false) MultipartFile imageFile
    ) {
        System.out.println("🚀 [RoomController] Request received for room: " + roomNumber);
        
        try {
            // Validate inputs manually
            if (roomNumber == null || roomNumber.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Số phòng không được để trống"));
            }
            
            java.math.BigDecimal price = java.math.BigDecimal.ZERO;
            try {
                if (priceStr != null && !priceStr.isEmpty()) {
                    price = new java.math.BigDecimal(priceStr);
                }
            } catch (Exception e) {
                System.err.println("Invalid price: " + priceStr);
            }

            double area = 0;
            try {
                if (areaStr != null && !areaStr.isEmpty()) {
                    area = Double.parseDouble(areaStr);
                }
            } catch (Exception e) {
                System.err.println("Invalid area: " + areaStr);
            }

            String imageName = null;
            if (imageFile != null && !imageFile.isEmpty()) {
                try {
                    imageName = saveImage(imageFile);
                } catch (Exception e) {
                    System.err.println("Image save error: " + e.getMessage());
                }
            }

            Room room = Room.builder()
                    .roomNumber(roomNumber)
                    .type(type)
                    .price(price)
                    .area(area)
                    .description(description)
                    .image(imageName)
                    .status(RoomStatus.AVAILABLE)
                    .build();

            Room savedRoom = roomRepository.save(room);
            System.out.println("✅ [RoomController] Successfully created room: " + savedRoom.getRoomNumber());
            return ResponseEntity.ok(savedRoom);
        } catch (Exception e) {
            System.err.println("❌ [RoomController] Critical Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi hệ thống: " + e.getMessage()));
        }
    }

    // ─── PUT: Cập nhật phòng (Multipart) ─────────────────────────────────────
    @PutMapping(value = "/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateRoom(
            @PathVariable Long id,
            @RequestParam("roomNumber") String roomNumber,
            @RequestParam("type") String type,
            @RequestParam("price") String priceStr,
            @RequestParam("area") String areaStr,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "image", required = false) MultipartFile imageFile
    ) {
        System.out.println("🚀 [RoomController] Updating room ID: " + id);
        try {
            Room room = roomRepository.findById(id).orElseThrow(() -> new RuntimeException("Phòng không tồn tại"));
            
            if (priceStr != null && !priceStr.isEmpty()) {
                room.setPrice(new java.math.BigDecimal(priceStr));
            }
            if (areaStr != null && !areaStr.isEmpty()) {
                room.setArea(Double.parseDouble(areaStr));
            }

            room.setRoomNumber(roomNumber);
            room.setType(type);
            room.setDescription(description);
            
            if (status != null && !status.isEmpty()) {
                try {
                    room.setStatus(RoomStatus.valueOf(status.toUpperCase()));
                } catch (IllegalArgumentException e) {
                    System.err.println("Invalid status: " + status);
                }
            }

            if (imageFile != null && !imageFile.isEmpty()) {
                String imageName = saveImage(imageFile);
                room.setImage(imageName);
            }

            Room savedRoom = roomRepository.save(room);
            System.out.println("✅ [RoomController] Updated room ID: " + savedRoom.getId());
            return ResponseEntity.ok(savedRoom);
        } catch (Exception e) {
            System.err.println("❌ [RoomController] Update error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi cập nhật phòng: " + e.getMessage()));
        }
    }

    // ─── PUT: Cập nhật ảnh phòng ─────────────────────────────────────────────
    @PutMapping(value = "/{id}/image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateRoomImage(
            @PathVariable Long id,
            @RequestParam("image") MultipartFile imageFile
    ) {
        try {
            Room room = roomRepository.findById(id).orElseThrow();
            String imageName = saveImage(imageFile);
            room.setImage(imageName);
            roomRepository.save(room);

            Map<String, String> response = new HashMap<>();
            response.put("fileName", imageName);
            response.put("filePath", "/uploads/" + imageName);
            response.put("message", "Cập nhật ảnh phòng thành công");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Lỗi cập nhật ảnh: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    // ─── DELETE: Xóa phòng ────────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        roomRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ─── Helper: Lưu ảnh vào ./uploads/ ──────────────────────────────────────
    private String saveImage(MultipartFile imageFile) throws Exception {
        String contentType = imageFile.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Chỉ chấp nhận file ảnh");
        }

        String originalName = StringUtils.cleanPath(
                imageFile.getOriginalFilename() != null ? imageFile.getOriginalFilename() : "img"
        );
        String ext = originalName.contains(".")
                ? originalName.substring(originalName.lastIndexOf("."))
                : "";
        String fileName = UUID.randomUUID().toString() + ext;

        Path uploadPath = Paths.get(UPLOAD_DIR).toAbsolutePath();
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        imageFile.transferTo(uploadPath.resolve(fileName).toFile());
        System.out.println("✅ [Room] Ảnh đã lưu: " + fileName);
        return fileName;
    }
}
