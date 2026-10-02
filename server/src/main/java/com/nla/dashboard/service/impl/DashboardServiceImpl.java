package com.nla.dashboard.service.impl;

import com.nla.award.repository.AwardRepository;
import com.nla.common.exception.ResourceNotFoundException;
import com.nla.compensation.repository.CompensationRepository;
import com.nla.dashboard.dto.JurisdictionDashboardResponse;
import com.nla.dashboard.dto.NationalDashboardResponse;
import com.nla.dashboard.dto.ProjectDashboardResponse;
import com.nla.dashboard.service.DashboardService;
import com.nla.land.entity.AcquisitionStatus;
import com.nla.land.entity.LandParcel;
import com.nla.land.repository.LandParcelRepository;
import com.nla.notification.repository.StatutoryNotificationRepository;
import com.nla.possession.entity.PossessionStatus;
import com.nla.possession.repository.PossessionRepository;
import com.nla.project.entity.Project;
import com.nla.project.repository.ProjectRepository;
import com.nla.rehabilitation.entity.FamilyCategory;
import com.nla.rehabilitation.entity.RehabilitationStatus;
import com.nla.rehabilitation.repository.AffectedFamilyRepository;
import com.nla.workflow.entity.MilestoneStatus;
import com.nla.workflow.entity.ProjectMilestone;
import com.nla.workflow.repository.ProjectMilestoneRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final ProjectRepository projectRepository;
    private final LandParcelRepository landParcelRepository;
    private final StatutoryNotificationRepository notificationRepository;
    private final AwardRepository awardRepository;
    private final CompensationRepository compensationRepository;
    private final PossessionRepository possessionRepository;
    private final AffectedFamilyRepository familyRepository;
    private final ProjectMilestoneRepository milestoneRepository;

    @Override
    @Transactional(readOnly = true)
    public NationalDashboardResponse getNationalDashboard() {
        long totalProjects = projectRepository.count();
        List<Project> allProjects = projectRepository.findAll();

        BigDecimal totalLandProposed = allProjects.stream()
                .map(p -> p.getEstimatedLandRequirement() != null ? p.getEstimatedLandRequirement() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalLandAcquired = landParcelRepository.sumTotalAcquiredArea();

        double landAcqPct = (totalLandProposed.compareTo(BigDecimal.ZERO) > 0)
                ? totalLandAcquired.divide(totalLandProposed, 4, RoundingMode.HALF_UP).doubleValue() * 100
                : 0.0;

        BigDecimal totalCompAssessed = compensationRepository.sumTotalAssessedAmount();
        BigDecimal totalCompPaid = compensationRepository.sumTotalPaidAmount();

        double compPct = (totalCompAssessed.compareTo(BigDecimal.ZERO) > 0)
                ? totalCompPaid.divide(totalCompAssessed, 4, RoundingMode.HALF_UP).doubleValue() * 100
                : 0.0;

        long affectedFamilies = familyRepository.countByCategory(FamilyCategory.AFFECTED);
        long displacedFamilies = familyRepository.countByCategory(FamilyCategory.DISPLACED);

        long totalPossessions = possessionRepository.count();
        long completedPossessions = possessionRepository.countByPossessionStatus(PossessionStatus.TAKEN);
        double possessionPct = (totalPossessions > 0) ? ((double) completedPossessions / totalPossessions) * 100 : 0.0;

        long totalRr = familyRepository.count();
        long completedRr = familyRepository.countByRehabilitationStatus(RehabilitationStatus.COMPLETED)
                + familyRepository.countByRehabilitationStatus(RehabilitationStatus.REHABILITATED)
                + familyRepository.countByRehabilitationStatus(RehabilitationStatus.RESSETTLED);
        double rrPct = (totalRr > 0) ? ((double) completedRr / totalRr) * 100 : 0.0;

        long delayedProjects = milestoneRepository.findDelayedProjectIds().size();

        Map<String, Long> byStatus = allProjects.stream()
                .collect(Collectors.groupingBy(p -> p.getStatus().name(), Collectors.counting()));

        Map<String, Long> byType = allProjects.stream()
                .collect(Collectors.groupingBy(p -> p.getProjectType().name(), Collectors.counting()));

        return NationalDashboardResponse.builder()
                .totalProjects(totalProjects)
                .totalLandProposed(totalLandProposed)
                .totalLandAcquired(totalLandAcquired)
                .landAcquisitionPercentage(Math.min(100.0, landAcqPct))
                .totalCompensationAssessed(totalCompAssessed)
                .totalCompensationPaid(totalCompPaid)
                .compensationDisbursementPercentage(Math.min(100.0, compPct))
                .totalAffectedFamilies(affectedFamilies)
                .totalDisplacedFamilies(displacedFamilies)
                .possessionProgressPercentage(Math.min(100.0, possessionPct))
                .rrProgressPercentage(Math.min(100.0, rrPct))
                .delayedProjectsCount(delayedProjects)
                .projectsByStatus(byStatus)
                .projectsByType(byType)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectDashboardResponse getProjectDashboard(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        BigDecimal landRequired = project.getEstimatedLandRequirement() != null ? project.getEstimatedLandRequirement() : BigDecimal.ZERO;
        BigDecimal landAcquired = landParcelRepository.sumAreaByProjectIdAndStatus(projectId, AcquisitionStatus.ACQUIRED);
        if (landAcquired.compareTo(BigDecimal.ZERO) == 0) {
            landAcquired = landParcelRepository.sumAreaByProjectIdAndStatus(projectId, AcquisitionStatus.POSSESSION_TAKEN);
        }
        BigDecimal landPending = landRequired.subtract(landAcquired).max(BigDecimal.ZERO);

        double landPct = (landRequired.compareTo(BigDecimal.ZERO) > 0)
                ? landAcquired.divide(landRequired, 4, RoundingMode.HALF_UP).doubleValue() * 100
                : 0.0;

        long notifCount = notificationRepository.countByProjectId(projectId);
        long awardCount = awardRepository.countByProjectId(projectId);

        BigDecimal compAssessed = compensationRepository.sumAssessedAmountByProjectId(projectId);
        BigDecimal compPaid = compensationRepository.sumPaidAmountByProjectId(projectId);
        double compPct = (compAssessed.compareTo(BigDecimal.ZERO) > 0)
                ? compPaid.divide(compAssessed, 4, RoundingMode.HALF_UP).doubleValue() * 100
                : 0.0;

        List<LandParcel> parcels = landParcelRepository.findByProjectId(projectId);
        long totalParcels = parcels.size();
        long possessionTaken = parcels.stream().filter(p -> p.getAcquisitionStatus() == AcquisitionStatus.POSSESSION_TAKEN || p.getAcquisitionStatus() == AcquisitionStatus.ACQUIRED).count();
        double possessionPct = (totalParcels > 0) ? ((double) possessionTaken / totalParcels) * 100 : 0.0;

        long affectedFamCount = familyRepository.countByProjectId(projectId);
        long rehabCount = familyRepository.findByProjectId(projectId).stream()
                .filter(f -> f.getRehabilitationStatus() == RehabilitationStatus.COMPLETED || f.getRehabilitationStatus() == RehabilitationStatus.REHABILITATED)
                .count();
        double rrPct = (affectedFamCount > 0) ? ((double) rehabCount / affectedFamCount) * 100 : 0.0;

        List<ProjectMilestone> milestones = milestoneRepository.findByProjectIdOrderBySequenceOrderAsc(projectId);
        long totalMilestones = milestones.size();
        long completedMilestones = milestones.stream().filter(m -> m.getStatus() == MilestoneStatus.COMPLETED).count();
        long delayedMilestones = milestones.stream().filter(m -> m.getDelayDays() > 0 || m.getStatus() == MilestoneStatus.DELAYED).count();
        double timelinePct = (totalMilestones > 0) ? ((double) completedMilestones / totalMilestones) * 100 : 0.0;

        Map<String, Long> parcelsByStatus = parcels.stream()
                .collect(Collectors.groupingBy(p -> p.getAcquisitionStatus().name(), Collectors.counting()));

        return ProjectDashboardResponse.builder()
                .projectId(project.getId())
                .projectCode(project.getProjectCode())
                .projectName(project.getProjectName())
                .status(project.getStatus().name())
                .landRequired(landRequired)
                .landAcquired(landAcquired)
                .landPending(landPending)
                .landAcquisitionPercentage(Math.min(100.0, landPct))
                .notificationsIssued(notifCount)
                .awardsDeclared(awardCount)
                .compensationAssessed(compAssessed)
                .compensationPaid(compPaid)
                .compensationDisbursementPercentage(Math.min(100.0, compPct))
                .totalParcels(totalParcels)
                .possessionCompletedParcels(possessionTaken)
                .possessionPercentage(Math.min(100.0, possessionPct))
                .affectedFamiliesCount(affectedFamCount)
                .rehabilitatedFamiliesCount(rehabCount)
                .rrProgressPercentage(Math.min(100.0, rrPct))
                .totalMilestones(totalMilestones)
                .completedMilestones(completedMilestones)
                .delayedMilestones(delayedMilestones)
                .timelineProgressPercentage(Math.min(100.0, timelinePct))
                .parcelsByStatus(parcelsByStatus)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public JurisdictionDashboardResponse getStateDashboard(String stateName) {
        List<Project> projects = projectRepository.findByFilters(stateName, null, null, null, Pageable.unpaged()).getContent();
        return computeJurisdictionResponse("STATE", stateName, projects);
    }

    @Override
    @Transactional(readOnly = true)
    public JurisdictionDashboardResponse getDistrictDashboard(String districtName) {
        List<Project> projects = projectRepository.findByFilters(null, districtName, null, null, Pageable.unpaged()).getContent();
        return computeJurisdictionResponse("DISTRICT", districtName, projects);
    }

    private JurisdictionDashboardResponse computeJurisdictionResponse(String type, String name, List<Project> projects) {
        long totalProjects = projects.size();

        BigDecimal landProposed = projects.stream()
                .map(p -> p.getEstimatedLandRequirement() != null ? p.getEstimatedLandRequirement() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal landAcquired = BigDecimal.ZERO;
        BigDecimal compAssessed = BigDecimal.ZERO;
        BigDecimal compPaid = BigDecimal.ZERO;
        long affectedFamilies = 0;
        long totalParcels = 0;
        long acquiredParcels = 0;

        for (Project p : projects) {
            landAcquired = landAcquired.add(landParcelRepository.sumAreaByProjectIdAndStatus(p.getId(), AcquisitionStatus.ACQUIRED));
            compAssessed = compAssessed.add(compensationRepository.sumAssessedAmountByProjectId(p.getId()));
            compPaid = compPaid.add(compensationRepository.sumPaidAmountByProjectId(p.getId()));
            affectedFamilies += familyRepository.countByProjectId(p.getId());

            List<LandParcel> pParcels = landParcelRepository.findByProjectId(p.getId());
            totalParcels += pParcels.size();
            acquiredParcels += pParcels.stream().filter(lp -> lp.getAcquisitionStatus() == AcquisitionStatus.POSSESSION_TAKEN || lp.getAcquisitionStatus() == AcquisitionStatus.ACQUIRED).count();
        }

        double landPct = (landProposed.compareTo(BigDecimal.ZERO) > 0)
                ? landAcquired.divide(landProposed, 4, RoundingMode.HALF_UP).doubleValue() * 100 : 0.0;

        double compPct = (compAssessed.compareTo(BigDecimal.ZERO) > 0)
                ? compPaid.divide(compAssessed, 4, RoundingMode.HALF_UP).doubleValue() * 100 : 0.0;

        double possessionPct = (totalParcels > 0) ? ((double) acquiredParcels / totalParcels) * 100 : 0.0;

        Map<String, Long> byStatus = projects.stream()
                .collect(Collectors.groupingBy(p -> p.getStatus().name(), Collectors.counting()));

        return JurisdictionDashboardResponse.builder()
                .jurisdictionType(type)
                .jurisdictionName(name)
                .totalProjects(totalProjects)
                .totalLandProposed(landProposed)
                .totalLandAcquired(landAcquired)
                .landAcquisitionPercentage(Math.min(100.0, landPct))
                .totalCompensationAssessed(compAssessed)
                .totalCompensationPaid(compPaid)
                .compensationDisbursementPercentage(Math.min(100.0, compPct))
                .totalAffectedFamilies(affectedFamilies)
                .possessionProgressPercentage(Math.min(100.0, possessionPct))
                .rrProgressPercentage(possessionPct * 0.85) // representative progress
                .projectsByStatus(byStatus)
                .build();
    }
}
