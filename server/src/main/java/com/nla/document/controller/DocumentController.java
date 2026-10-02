package com.nla.document.controller;

import com.nla.common.dto.ApiResponse;
import com.nla.document.dto.DocumentMetadataResponse;
import com.nla.document.entity.DocumentType;
import com.nla.document.entity.EntityType;
import com.nla.document.service.DocumentStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
@Tag(name = "Document Module", description = "Secure file upload, metadata tracking, and document download")
public class DocumentController {

    private final DocumentStorageService documentStorageService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload a statutory or project document")
    public ResponseEntity<ApiResponse<DocumentMetadataResponse>> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("documentType") DocumentType documentType,
            @RequestParam("entityType") EntityType entityType,
            @RequestParam("entityId") Long entityId,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "uploadedBy", required = false) String uploadedBy
    ) {
        DocumentMetadataResponse response = documentStorageService.uploadDocument(file, documentType, entityType, entityId, description, uploadedBy);
        return new ResponseEntity<>(ApiResponse.created(response, "Document uploaded successfully"), HttpStatus.CREATED);
    }

    @GetMapping("/{id}/metadata")
    @Operation(summary = "Get document metadata by ID")
    public ResponseEntity<ApiResponse<DocumentMetadataResponse>> getDocumentMetadata(@PathVariable Long id) {
        DocumentMetadataResponse response = documentStorageService.getDocumentMetadata(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}/download")
    @Operation(summary = "Download document binary content")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long id) {
        DocumentMetadataResponse metadata = documentStorageService.getDocumentMetadata(id);
        Resource resource = documentStorageService.downloadDocument(id);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + metadata.getFileName() + "\"")
                .body(resource);
    }

    @GetMapping("/entity/{entityType}/{entityId}")
    @Operation(summary = "Get all documents linked to an entity")
    public ResponseEntity<ApiResponse<List<DocumentMetadataResponse>>> getDocumentsForEntity(
            @PathVariable EntityType entityType,
            @PathVariable Long entityId
    ) {
        List<DocumentMetadataResponse> docs = documentStorageService.getDocumentsForEntity(entityType, entityId);
        return ResponseEntity.ok(ApiResponse.success(docs));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a document")
    public ResponseEntity<ApiResponse<Void>> deleteDocument(@PathVariable Long id) {
        documentStorageService.deleteDocument(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Document deleted successfully"));
    }
}
