package com.nla.document.service;

import com.nla.document.dto.DocumentMetadataResponse;
import com.nla.document.entity.DocumentType;
import com.nla.document.entity.EntityType;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DocumentStorageService {

    DocumentMetadataResponse uploadDocument(MultipartFile file, DocumentType documentType, EntityType entityType, Long entityId, String description, String uploadedBy);

    DocumentMetadataResponse getDocumentMetadata(Long id);

    Resource downloadDocument(Long id);

    List<DocumentMetadataResponse> getDocumentsForEntity(EntityType entityType, Long entityId);

    void deleteDocument(Long id);
}
