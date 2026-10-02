package com.nla.workflow.repository;

import com.nla.workflow.entity.MilestoneStatus;
import com.nla.workflow.entity.MilestoneType;
import com.nla.workflow.entity.ProjectMilestone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectMilestoneRepository extends JpaRepository<ProjectMilestone, Long> {

    List<ProjectMilestone> findByProjectIdOrderBySequenceOrderAsc(Long projectId);

    Optional<ProjectMilestone> findByProjectIdAndMilestone(Long projectId, MilestoneType milestone);

    List<ProjectMilestone> findByStatus(MilestoneStatus status);

    @Query("SELECT COUNT(m) FROM ProjectMilestone m WHERE m.delayDays > 0 OR m.status = 'DELAYED'")
    long countDelayedMilestones();

    @Query("SELECT DISTINCT m.project.id FROM ProjectMilestone m WHERE m.delayDays > 0 OR m.status = 'DELAYED'")
    List<Long> findDelayedProjectIds();
}
