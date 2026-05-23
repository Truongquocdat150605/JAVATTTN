package com.example.quanliPT.controller;

import com.example.quanliPT.model.RentalService;
import com.example.quanliPT.repository.RentalServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceController {

    private final RentalServiceRepository serviceRepository;

    @GetMapping
    public ResponseEntity<List<RentalService>> getAllServices() {
        return ResponseEntity.ok(serviceRepository.findAll());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RentalService> createService(@RequestBody RentalService service) {
        return ResponseEntity.ok(serviceRepository.save(service));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        serviceRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
