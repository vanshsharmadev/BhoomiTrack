package com.nla.compensation.repository;

import com.nla.compensation.entity.Compensation;
import com.nla.compensation.entity.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface CompensationRepository extends JpaRepository<Compensation, Long> {

    List<Compensation> findByProjectId(Long projectId);

    List<Compensation> findByParcelId(Long parcelId);

    @Query("SELECT c FROM Compensation c WHERE " +
            "(:projectId IS NULL OR c.project.id = :projectId) AND " +
            "(:parcelId IS NULL OR c.parcel.id = :parcelId) AND " +
            "(:status IS NULL OR c.paymentStatus = :status) " +
            "ORDER BY c.id DESC")
    Page<Compensation> findByFilters(
            @Param("projectId") Long projectId,
            @Param("parcelId") Long parcelId,
            @Param("status") PaymentStatus status,
            Pageable pageable
    );

    @Query("SELECT COALESCE(SUM(c.assessedAmount), 0) FROM Compensation c WHERE c.project.id = :projectId")
    BigDecimal sumAssessedAmountByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT COALESCE(SUM(c.paidAmount), 0) FROM Compensation c WHERE c.project.id = :projectId")
    BigDecimal sumPaidAmountByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT COALESCE(SUM(c.assessedAmount), 0) FROM Compensation c")
    BigDecimal sumTotalAssessedAmount();

    @Query("SELECT COALESCE(SUM(c.paidAmount), 0) FROM Compensation c")
    BigDecimal sumTotalPaidAmount();

    long countByProjectId(Long projectId);

    long countByPaymentStatus(PaymentStatus status);
}
