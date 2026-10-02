package com.nla.document.service.impl;

import com.nla.audit.entity.AuditAction;
import com.nla.audit.service.AuditService;
import com.nla.common.exception.BusinessRuleException;
import com.nla.common.exception.ResourceNotFoundException;
import com.nla.document.dto.DocumentMetadataResponse;
import com.nla.document.entity.DocumentMetadata;
import com.nla.document.entity.DocumentType;
import com.nla.document.entity.EntityType;
import com.nla.document.repository.DocumentMetadataRepository;
import com.nla.document.service.DocumentStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class DocumentStorageServiceImpl implements DocumentStorageService {

    private final DocumentMetadataRepository documentRepository;
    private final AuditService auditService;

    @Value("${app.upload.dir:uploads}")
    private String uploadBaseDir;

    @Override
    @Transactional
    public DocumentMetadataResponse uploadDocument(MultipartFile file, DocumentType documentType, EntityType entityType, Long entityId, String description, String uploadedBy) {
        if (file.isEmpty()) {
            throw new BusinessRuleException("Cannot upload an empty file");
        }

        try {
            Path uploadPath = Paths.get(uploadBaseDir, entityType.name().toLowerCase(), String.valueOf(entityId));
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "document";
            String storedFileName = UUID.randomUUID() + "_" + originalName;
            Path targetFile = uploadPath.resolve(storedFileName);

            Files.copy(file.getInputStream(), targetFile, StandardCopyOption.REPLACE_EXISTING);

            DocumentMetadata metadata = DocumentMetadata.builder()
                    .fileName(originalName)
                    .fileType(file.getContentType())
                    .fileSize(file.getSize())
                    .storagePath(targetFile.toAbsolutePath().toString())
                    .documentType(documentType)
                    .entityType(entityType)
                    .entityId(entityId)
                    .version(1)
                    .status("ACTIVE")
                    .uploadedBy(uploadedBy != null ? uploadedBy : "OFFICER")
                    .description(description)
                    .build();

            DocumentMetadata saved = documentRepository.save(metadata);

            auditService.logAction(
                    "Document",
                    saved.getId(),
                    AuditAction.DOCUMENT_UPLOADED,
                    null,
                    saved.getFileName(),
                    saved.getUploadedBy(),
                    "Document uploaded for " + entityType + " #" + entityId
            );

            return DocumentMetadataResponse.fromEntity(saved);
        } catch (IOException e) {
            log.error("Failed to store file", e);
            throw new BusinessRuleException("Could not store file: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public DocumentMetadataResponse getDocumentMetadata(Long id) {
        DocumentMetadata metadata = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DocumentMetadata", "id", id));
        return DocumentMetadataResponse.fromEntity(metadata);
    }

    @Override
    @Transactional(readOnly = true)
    public Resource downloadDocument(Long id) {
        DocumentMetadata metadata = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DocumentMetadata", "id", id));

        File file = new File(metadata.getStoragePath());
        if (!file.exists()) {
            throw new ResourceNotFoundException("Document file not found on disk at " + metadata.getStoragePath());
        }

        return new FileSystemResource(file);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentMetadataResponse> getDocumentsForEntity(EntityType entityType, Long entityId) {
        return documentRepository.findByEntityTypeAndEntityId(entityType, entityId).stream()
                .map(DocumentMetadataResponse::fromEntity)
                .toList();
    }

    @Override
    @Transactional
    public void deleteDocument(Long id) {
        DocumentMetadata metadata = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DocumentMetadata", "id", id));

        try {
            Files.deleteIfExists(Paths.get(metadata.getStoragePath()));
        } catch (IOException e) {
            log.warn("Could not delete physical file: {}", metadata.getStoragePath());
        }

        documentRepository.delete(metadata);

        auditService.logAction(
                "Document",
                id,
                AuditAction.DOCUMENT_DELETED,
                metadata.getFileName(),
                null,
                null,
                "Document deleted"
        );
    }
}
