package com.nla.audit.repository;

import com.nla.audit.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findByEntityNameAndEntityIdOrderByPerformedAtDesc(String entityName, Long entityId);

    Page<AuditLog> findByEntityNameOrderByPerformedAtDesc(String entityName, Pageable pageable);

    Page<AuditLog> findAllByOrderByPerformedAtDesc(Pageable pageable);
}
