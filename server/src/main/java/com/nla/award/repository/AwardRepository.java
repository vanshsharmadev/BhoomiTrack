package com.nla.award.repository;

import com.nla.award.entity.Award;
import com.nla.award.entity.AwardStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface AwardRepository extends JpaRepository<Award, Long> {

    Optional<Award> findByAwardNumber(String awardNumber);

    boolean existsByAwardNumber(String awardNumber);

    List<Award> findByProjectId(Long projectId);

    List<Award> findByParcelId(Long parcelId);

    @Query("SELECT a FROM Award a WHERE " +
            "(:projectId IS NULL OR a.project.id = :projectId) AND " +
            "(:parcelId IS NULL OR a.parcel.id = :parcelId) AND " +
            "(:status IS NULL OR a.status = :status) " +
            "ORDER BY a.awardDate DESC")
    Page<Award> findByFilters(
            @Param("projectId") Long projectId,
            @Param("parcelId") Long parcelId,
            @Param("status") AwardStatus status,
            Pageable pageable
    );

    @Query("SELECT COALESCE(SUM(a.assessedAmount), 0) FROM Award a WHERE a.project.id = :projectId")
    BigDecimal sumAssessedAmountByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT COALESCE(SUM(a.assessedAmount), 0) FROM Award a")
    BigDecimal sumTotalAssessedAmount();

    long countByProjectId(Long projectId);
}
