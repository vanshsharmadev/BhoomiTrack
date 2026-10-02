package com.nla.land.repository;

import com.nla.land.entity.AcquisitionStatus;
import com.nla.land.entity.LandParcel;
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
public interface LandParcelRepository extends JpaRepository<LandParcel, Long> {

    Optional<LandParcel> findByParcelNumber(String parcelNumber);

    boolean existsByParcelNumber(String parcelNumber);

    boolean existsBySurveyNumberAndVillageAndDistrictAndProjectId(String surveyNumber, String village, String district, Long projectId);

    List<LandParcel> findByProjectId(Long projectId);

    List<LandParcel> findByProjectIdAndAcquisitionStatus(Long projectId, AcquisitionStatus status);

    @Query("SELECT lp FROM LandParcel lp WHERE " +
            "(:projectId IS NULL OR lp.project.id = :projectId) AND " +
            "(:district IS NULL OR LOWER(lp.district) = LOWER(:district)) AND " +
            "(:status IS NULL OR lp.acquisitionStatus = :status) AND " +
            "(:village IS NULL OR LOWER(lp.village) = LOWER(:village)) " +
            "ORDER BY lp.id ASC")
    Page<LandParcel> findByFilters(
            @Param("projectId") Long projectId,
            @Param("district") String district,
            @Param("status") AcquisitionStatus status,
            @Param("village") String village,
            Pageable pageable
    );

    @Query("SELECT COALESCE(SUM(lp.area), 0) FROM LandParcel lp WHERE lp.project.id = :projectId AND lp.acquisitionStatus = :status")
    BigDecimal sumAreaByProjectIdAndStatus(@Param("projectId") Long projectId, @Param("status") AcquisitionStatus status);

    @Query("SELECT COALESCE(SUM(lp.area), 0) FROM LandParcel lp WHERE lp.project.id = :projectId")
    BigDecimal sumAreaByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT COALESCE(SUM(lp.area), 0) FROM LandParcel lp WHERE lp.acquisitionStatus = 'ACQUIRED'")
    BigDecimal sumTotalAcquiredArea();

    @Query("SELECT COALESCE(SUM(lp.area), 0) FROM LandParcel lp")
    BigDecimal sumTotalArea();

    long countByProjectId(Long projectId);

    long countByAcquisitionStatus(AcquisitionStatus status);

    @Query("SELECT lp FROM LandParcel lp WHERE " +
            "lp.latitude BETWEEN :minLat AND :maxLat AND " +
            "lp.longitude BETWEEN :minLng AND :maxLng")
    List<LandParcel> findWithinBoundingBox(
            @Param("minLat") Double minLat,
            @Param("maxLat") Double maxLat,
            @Param("minLng") Double minLng,
            @Param("maxLng") Double maxLng
    );
}
