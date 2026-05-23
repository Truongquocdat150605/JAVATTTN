package com.example.quanliPT.repository;

import com.example.quanliPT.model.RentalService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RentalServiceRepository extends JpaRepository<RentalService, Long> {
}
