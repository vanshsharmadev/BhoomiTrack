package com.nla.audit.controller;

import com.nla.audit.entity.AuditLog;
import com.nla.audit.service.AuditService;
import com.nla.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
@Tag(name = "Audit Module", description = "Immutable audit trail and change history")
public class AuditController {

    private final AuditService auditService;

    @GetMapping
    @Operation(summary = "Get audit logs with pagination and optional entity filter")
    public ResponseEntity<ApiResponse<Page<AuditLog>>> getAuditLogs(
            @RequestParam(required = false) String entityName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AuditLog> result = (entityName != null && !entityName.isBlank())
                ? auditService.getLogsByEntity(entityName, pageable)
                : auditService.getAllLogs(pageable);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/{entityName}/{entityId}")
    @Operation(summary = "Get complete audit history for a specific entity record")
    public ResponseEntity<ApiResponse<List<AuditLog>>> getEntityHistory(
            @PathVariable String entityName,
            @PathVariable Long entityId
    ) {
        List<AuditLog> history = auditService.getHistoryForEntity(entityName, entityId);
        return ResponseEntity.ok(ApiResponse.success(history));
    }
}
