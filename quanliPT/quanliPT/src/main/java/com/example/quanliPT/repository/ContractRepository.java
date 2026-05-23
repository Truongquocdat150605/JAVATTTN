package com.example.quanliPT.repository;

import com.example.quanliPT.model.Contract;
import com.example.quanliPT.model.ContractStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ContractRepository extends JpaRepository<Contract, Long> {
    List<Contract> findByTenantId(Long tenantId);
    List<Contract> findByTenantIdAndActiveTrueAndStatus(Long tenantId, ContractStatus status);
    List<Contract> findByRoomIdAndActiveTrue(Long roomId);
    List<Contract> findByActiveTrueAndStatus(ContractStatus status);
    long countByStatus(ContractStatus status);
}
