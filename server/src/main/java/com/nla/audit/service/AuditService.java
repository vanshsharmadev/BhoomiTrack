package com.nla.audit.service;

import com.nla.audit.entity.AuditAction;
import com.nla.audit.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AuditService {

    AuditLog logAction(String entityName, Long entityId, AuditAction action, String oldValue, String newValue, String performedBy, String remarks);

    List<AuditLog> getHistoryForEntity(String entityName, Long entityId);

    Page<AuditLog> getAllLogs(Pageable pageable);

    Page<AuditLog> getLogsByEntity(String entityName, Pageable pageable);
}
