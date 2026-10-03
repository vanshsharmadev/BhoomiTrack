package com.nla.project.repository;

import com.nla.project.entity.Project;
import com.nla.project.entity.ProjectStatus;
import com.nla.project.entity.ProjectType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    Optional<Project> findByProjectCode(String projectCode);

    boolean existsByProjectCode(String projectCode);

    @Query("SELECT p FROM Project p WHERE " +
            "(CAST(:state AS string) IS NULL OR LOWER(p.state) = LOWER(CAST(:state AS string))) AND " +
            "(CAST(:district AS string) IS NULL OR LOWER(p.district) = LOWER(CAST(:district AS string))) AND " +
            "(:status IS NULL OR p.status = :status) AND " +
            "(:projectType IS NULL OR p.projectType = :projectType) " +
            "ORDER BY p.createdAt DESC")
    Page<Project> findByFilters(
            @Param("state") String state,
            @Param("district") String district,
            @Param("status") ProjectStatus status,
            @Param("projectType") ProjectType projectType,
            Pageable pageable
    );

    List<Project> findByStatus(ProjectStatus status);

    long countByStatus(ProjectStatus status);

    @Query("SELECT DISTINCT p.state FROM Project p WHERE p.state IS NOT NULL ORDER BY p.state")
    List<String> findDistinctStates();

    @Query("SELECT DISTINCT p.district FROM Project p WHERE p.district IS NOT NULL ORDER BY p.district")
    List<String> findDistinctDistricts();
}
