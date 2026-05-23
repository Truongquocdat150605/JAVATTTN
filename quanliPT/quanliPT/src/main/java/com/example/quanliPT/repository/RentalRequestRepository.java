package com.example.quanliPT.repository;

import com.example.quanliPT.model.RentalRequest;
import com.example.quanliPT.model.RentalRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RentalRequestRepository extends JpaRepository<RentalRequest, Long> {
    List<RentalRequest> findByStatus(RentalRequestStatus status);
}
