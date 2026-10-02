package com.nla.document.repository;

import com.nla.document.entity.DocumentMetadata;
import com.nla.document.entity.DocumentType;
import com.nla.document.entity.EntityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentMetadataRepository extends JpaRepository<DocumentMetadata, Long> {

    List<DocumentMetadata> findByEntityTypeAndEntityId(EntityType entityType, Long entityId);

    List<DocumentMetadata> findByEntityTypeAndEntityIdAndDocumentType(EntityType entityType, Long entityId, DocumentType documentType);
}
