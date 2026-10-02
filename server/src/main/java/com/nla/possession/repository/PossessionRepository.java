package com.nla.possession.repository;

import com.nla.possession.entity.Possession;
import com.nla.possession.entity.PossessionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PossessionRepository extends JpaRepository<Possession, Long> {

    List<Possession> findByProjectId(Long projectId);

    Optional<Possession> findByParcelId(Long parcelId);

    @Query("SELECT p FROM Possession p WHERE " +
            "(:projectId IS NULL OR p.project.id = :projectId) AND " +
            "(:parcelId IS NULL OR p.parcel.id = :parcelId) AND " +
            "(:status IS NULL OR p.possessionStatus = :status) " +
            "ORDER BY p.id DESC")
    Page<Possession> findByFilters(
            @Param("projectId") Long projectId,
            @Param("parcelId") Long parcelId,
            @Param("status") PossessionStatus status,
            Pageable pageable
    );

    long countByProjectIdAndPossessionStatus(Long projectId, PossessionStatus status);

    long countByPossessionStatus(PossessionStatus status);
}
