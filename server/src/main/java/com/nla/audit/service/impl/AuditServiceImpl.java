package com.nla.audit.service.impl;

import com.nla.audit.entity.AuditAction;
import com.nla.audit.entity.AuditLog;
import com.nla.audit.repository.AuditLogRepository;
import com.nla.audit.service.AuditService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditServiceImpl implements AuditService {

    private final AuditLogRepository auditLogRepository;

    @Override
    @Transactional
    public AuditLog logAction(String entityName, Long entityId, AuditAction action, String oldValue, String newValue, String performedBy, String remarks) {
        String actor = performedBy;
        String role = null;

        if (actor == null) {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated()) {
                actor = auth.getName();
                role = auth.getAuthorities().isEmpty() ? "USER" : auth.getAuthorities().iterator().next().getAuthority();
            } else {
                actor = "SYSTEM";
                role = "SYSTEM";
            }
        }

        AuditLog auditLog = AuditLog.builder()
                .entityName(entityName)
                .entityId(entityId)
                .action(action)
                .oldValue(oldValue)
                .newValue(newValue)
                .performedBy(actor)
                .performedRole(role)
                .performedAt(LocalDateTime.now())
                .remarks(remarks)
                .build();

        AuditLog saved = auditLogRepository.save(auditLog);
        log.info("Audit logged: [{} #{} - {}] by {}", entityName, entityId, action, actor);
        return saved;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLog> getHistoryForEntity(String entityName, Long entityId) {
        return auditLogRepository.findByEntityNameAndEntityIdOrderByPerformedAtDesc(entityName, entityId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AuditLog> getAllLogs(Pageable pageable) {
        return auditLogRepository.findAllByOrderByPerformedAtDesc(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AuditLog> getLogsByEntity(String entityName, Pageable pageable) {
        return auditLogRepository.findByEntityNameOrderByPerformedAtDesc(entityName, pageable);
    }
}
