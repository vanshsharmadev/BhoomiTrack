package com.nla.document.dto;

import com.nla.document.entity.DocumentMetadata;
import com.nla.document.entity.DocumentType;
import com.nla.document.entity.EntityType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentMetadataResponse {

    private Long id;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private String storagePath;
    private DocumentType documentType;
    private EntityType entityType;
    private Long entityId;
    private Integer version;
    private String status;
    private String uploadedBy;
    private LocalDateTime uploadedAt;
    private String description;

    public static DocumentMetadataResponse fromEntity(DocumentMetadata d) {
        return DocumentMetadataResponse.builder()
                .id(d.getId())
                .fileName(d.getFileName())
                .fileType(d.getFileType())
                .fileSize(d.getFileSize())
                .storagePath(d.getStoragePath())
                .documentType(d.getDocumentType())
                .entityType(d.getEntityType())
                .entityId(d.getEntityId())
                .version(d.getVersion())
                .status(d.getStatus())
                .uploadedBy(d.getUploadedBy())
                .uploadedAt(d.getUploadedAt())
                .description(d.getDescription())
                .build();
    }
}
