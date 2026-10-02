package com.nla.rehabilitation.repository;

import com.nla.rehabilitation.entity.AffectedFamily;
import com.nla.rehabilitation.entity.FamilyCategory;
import com.nla.rehabilitation.entity.RehabilitationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface AffectedFamilyRepository extends JpaRepository<AffectedFamily, Long> {

    List<AffectedFamily> findByProjectId(Long projectId);

    @Query("SELECT f FROM AffectedFamily f WHERE " +
            "(:projectId IS NULL OR f.project.id = :projectId) AND " +
            "(:category IS NULL OR f.category = :category) AND " +
            "(:status IS NULL OR f.rehabilitationStatus = :status) AND " +
            "(:district IS NULL OR LOWER(f.district) = LOWER(:district)) " +
            "ORDER BY f.id DESC")
    Page<AffectedFamily> findByFilters(
            @Param("projectId") Long projectId,
            @Param("category") FamilyCategory category,
            @Param("status") RehabilitationStatus status,
            @Param("district") String district,
            Pageable pageable
    );

    long countByProjectId(Long projectId);

    long countByProjectIdAndCategory(Long projectId, FamilyCategory category);

    long countByCategory(FamilyCategory category);

    long countByRehabilitationStatus(RehabilitationStatus status);

    @Query("SELECT COALESCE(SUM(f.assistanceAmount), 0) FROM AffectedFamily f WHERE f.project.id = :projectId")
    BigDecimal sumAssistanceAmountByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT COALESCE(SUM(f.assistanceProvided), 0) FROM AffectedFamily f WHERE f.project.id = :projectId")
    BigDecimal sumAssistanceProvidedByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT COALESCE(SUM(f.assistanceAmount), 0) FROM AffectedFamily f")
    BigDecimal sumTotalAssistanceAmount();

    @Query("SELECT COALESCE(SUM(f.assistanceProvided), 0) FROM AffectedFamily f")
    BigDecimal sumTotalAssistanceProvided();
}
