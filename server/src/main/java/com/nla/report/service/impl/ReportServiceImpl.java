package com.nla.report.service.impl;

import com.nla.compensation.entity.Compensation;
import com.nla.compensation.entity.PaymentStatus;
import com.nla.compensation.repository.CompensationRepository;
import com.nla.land.entity.AcquisitionStatus;
import com.nla.land.entity.LandParcel;
import com.nla.land.repository.LandParcelRepository;
import com.nla.possession.entity.Possession;
import com.nla.possession.entity.PossessionStatus;
import com.nla.possession.repository.PossessionRepository;
import com.nla.project.entity.Project;
import com.nla.project.entity.ProjectStatus;
import com.nla.project.entity.ProjectType;
import com.nla.project.repository.ProjectRepository;
import com.nla.rehabilitation.entity.AffectedFamily;
import com.nla.rehabilitation.entity.RehabilitationStatus;
import com.nla.rehabilitation.repository.AffectedFamilyRepository;
import com.nla.report.dto.*;
import com.nla.report.service.ReportService;
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
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final ProjectRepository projectRepository;
    private final LandParcelRepository landParcelRepository;
    private final CompensationRepository compensationRepository;
    private final PossessionRepository possessionRepository;
    private final AffectedFamilyRepository familyRepository;
    private final ProjectMilestoneRepository milestoneRepository;

    @Override
    @Transactional(readOnly = true)
    public List<StateWiseReportResponse> getStateWiseReport() {
        List<String> states = projectRepository.findDistinctStates();
        List<StateWiseReportResponse> report = new ArrayList<>();

        for (String state : states) {
            List<Project> stateProjects = projectRepository.findByFilters(state, null, null, null, Pageable.unpaged()).getContent();
            BigDecimal landProposed = BigDecimal.ZERO;
            BigDecimal landAcquired = BigDecimal.ZERO;
            BigDecimal compAssessed = BigDecimal.ZERO;
            BigDecimal compPaid = BigDecimal.ZERO;
            long affectedFamilies = 0;
            long delayedProjects = 0;

            for (Project p : stateProjects) {
                if (p.getEstimatedLandRequirement() != null) landProposed = landProposed.add(p.getEstimatedLandRequirement());
                landAcquired = landAcquired.add(landParcelRepository.sumAreaByProjectIdAndStatus(p.getId(), AcquisitionStatus.ACQUIRED));
                compAssessed = compAssessed.add(compensationRepository.sumAssessedAmountByProjectId(p.getId()));
                compPaid = compPaid.add(compensationRepository.sumPaidAmountByProjectId(p.getId()));
                affectedFamilies += familyRepository.countByProjectId(p.getId());

                boolean hasDelay = milestoneRepository.findByProjectIdOrderBySequenceOrderAsc(p.getId()).stream()
                        .anyMatch(m -> m.getDelayDays() > 0 || m.getStatus() == MilestoneStatus.DELAYED);
                if (hasDelay) delayedProjects++;
            }

            double acqPct = (landProposed.compareTo(BigDecimal.ZERO) > 0)
                    ? landAcquired.divide(landProposed, 4, RoundingMode.HALF_UP).doubleValue() * 100 : 0.0;

            report.add(StateWiseReportResponse.builder()
                    .state(state)
                    .totalProjects(stateProjects.size())
                    .totalLandProposed(landProposed)
                    .totalLandAcquired(landAcquired)
                    .acquisitionPercentage(Math.min(100.0, acqPct))
                    .totalCompensationAssessed(compAssessed)
                    .totalCompensationPaid(compPaid)
                    .affectedFamilies(affectedFamilies)
                    .delayedProjects(delayedProjects)
                    .build());
        }

        return report;
    }

    @Override
    @Transactional(readOnly = true)
    public List<DistrictWiseReportResponse> getDistrictWiseReport(String stateFilter) {
        List<Project> projects = (stateFilter != null && !stateFilter.isBlank())
                ? projectRepository.findByFilters(stateFilter, null, null, null, Pageable.unpaged()).getContent()
                : projectRepository.findAll();

        Map<String, List<Project>> byDistrict = new LinkedHashMap<>();
        for (Project p : projects) {
            byDistrict.computeIfAbsent(p.getDistrict(), k -> new ArrayList<>()).add(p);
        }

        List<DistrictWiseReportResponse> report = new ArrayList<>();
        for (Map.Entry<String, List<Project>> entry : byDistrict.entrySet()) {
            String district = entry.getKey();
            List<Project> dProjects = entry.getValue();
            String state = dProjects.isEmpty() ? "" : dProjects.get(0).getState();

            BigDecimal landProposed = BigDecimal.ZERO;
            BigDecimal landAcquired = BigDecimal.ZERO;
            BigDecimal compAssessed = BigDecimal.ZERO;
            BigDecimal compPaid = BigDecimal.ZERO;
            long affectedFamilies = 0;

            for (Project p : dProjects) {
                if (p.getEstimatedLandRequirement() != null) landProposed = landProposed.add(p.getEstimatedLandRequirement());
                landAcquired = landAcquired.add(landParcelRepository.sumAreaByProjectIdAndStatus(p.getId(), AcquisitionStatus.ACQUIRED));
                compAssessed = compAssessed.add(compensationRepository.sumAssessedAmountByProjectId(p.getId()));
                compPaid = compPaid.add(compensationRepository.sumPaidAmountByProjectId(p.getId()));
                affectedFamilies += familyRepository.countByProjectId(p.getId());
            }

            double acqPct = (landProposed.compareTo(BigDecimal.ZERO) > 0)
                    ? landAcquired.divide(landProposed, 4, RoundingMode.HALF_UP).doubleValue() * 100 : 0.0;

            report.add(DistrictWiseReportResponse.builder()
                    .district(district)
                    .state(state)
                    .totalProjects(dProjects.size())
                    .totalLandProposed(landProposed)
                    .totalLandAcquired(landAcquired)
                    .acquisitionPercentage(Math.min(100.0, acqPct))
                    .totalCompensationAssessed(compAssessed)
                    .totalCompensationPaid(compPaid)
                    .affectedFamilies(affectedFamilies)
                    .build());
        }

        return report;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectWiseReportResponse> getProjectWiseReport(String state, String district, ProjectType projectType, ProjectStatus status) {
        List<Project> projects = projectRepository.findByFilters(state, district, status, projectType, Pageable.unpaged()).getContent();
        List<ProjectWiseReportResponse> report = new ArrayList<>();

        for (Project p : projects) {
            BigDecimal landRequired = p.getEstimatedLandRequirement() != null ? p.getEstimatedLandRequirement() : BigDecimal.ZERO;
            BigDecimal landAcquired = landParcelRepository.sumAreaByProjectIdAndStatus(p.getId(), AcquisitionStatus.ACQUIRED);
            if (landAcquired.compareTo(BigDecimal.ZERO) == 0) {
                landAcquired = landParcelRepository.sumAreaByProjectIdAndStatus(p.getId(), AcquisitionStatus.POSSESSION_TAKEN);
            }
            double acqPct = (landRequired.compareTo(BigDecimal.ZERO) > 0)
                    ? landAcquired.divide(landRequired, 4, RoundingMode.HALF_UP).doubleValue() * 100 : 0.0;

            BigDecimal compAssessed = compensationRepository.sumAssessedAmountByProjectId(p.getId());
            BigDecimal compPaid = compensationRepository.sumPaidAmountByProjectId(p.getId());

            List<LandParcel> parcels = landParcelRepository.findByProjectId(p.getId());
            long totalParcels = parcels.size();
            long possessionTaken = parcels.stream().filter(lp -> lp.getAcquisitionStatus() == AcquisitionStatus.POSSESSION_TAKEN || lp.getAcquisitionStatus() == AcquisitionStatus.ACQUIRED).count();

            long affectedFamilies = familyRepository.countByProjectId(p.getId());

            long maxDelay = milestoneRepository.findByProjectIdOrderBySequenceOrderAsc(p.getId()).stream()
                    .mapToLong(ProjectMilestone::getDelayDays)
                    .max()
                    .orElse(0L);

            report.add(ProjectWiseReportResponse.builder()
                    .projectId(p.getId())
                    .projectCode(p.getProjectCode())
                    .projectName(p.getProjectName())
                    .projectType(p.getProjectType().name())
                    .state(p.getState())
                    .district(p.getDistrict())
                    .status(p.getStatus().name())
                    .landRequired(landRequired)
                    .landAcquired(landAcquired)
                    .landAcquisitionPercentage(Math.min(100.0, acqPct))
                    .compensationAssessed(compAssessed)
                    .compensationPaid(compPaid)
                    .totalParcels(totalParcels)
                    .possessionTakenParcels(possessionTaken)
                    .affectedFamilies(affectedFamilies)
                    .projectStartDate(p.getProjectStartDate())
                    .expectedCompletionDate(p.getExpectedCompletionDate())
                    .delayedDays(maxDelay)
                    .build());
        }

        return report;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CompensationReportItem> getCompensationReport(Long projectId, PaymentStatus status) {
        List<Compensation> comps = compensationRepository.findByFilters(projectId, null, status, Pageable.unpaged()).getContent();
        return comps.stream().map(c -> CompensationReportItem.builder()
                .compensationId(c.getId())
                .projectId(c.getProject().getId())
                .projectCode(c.getProject().getProjectCode())
                .projectName(c.getProject().getProjectName())
                .parcelNumber(c.getParcel().getParcelNumber())
                .surveyNumber(c.getParcel().getSurveyNumber())
                .beneficiaryName(c.getBeneficiaryName())
                .assessedAmount(c.getAssessedAmount())
                .approvedAmount(c.getApprovedAmount())
                .paidAmount(c.getPaidAmount())
                .paymentStatus(c.getPaymentStatus().name())
                .paymentDate(c.getPaymentDate())
                .transactionReference(c.getTransactionReference())
                .build()).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PossessionReportItem> getPossessionReport(Long projectId, PossessionStatus status) {
        List<Possession> possessions = possessionRepository.findByFilters(projectId, null, status, Pageable.unpaged()).getContent();
        return possessions.stream().map(p -> PossessionReportItem.builder()
                .possessionId(p.getId())
                .projectId(p.getProject().getId())
                .projectCode(p.getProject().getProjectCode())
                .projectName(p.getProject().getProjectName())
                .parcelNumber(p.getParcel().getParcelNumber())
                .surveyNumber(p.getParcel().getSurveyNumber())
                .village(p.getParcel().getVillage())
                .area(p.getParcel().getArea())
                .possessionStatus(p.getPossessionStatus().name())
                .possessionDate(p.getPossessionDate())
                .possessionOfficer(p.getPossessionOfficer())
                .build()).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RrReportItem> getRrReport(Long projectId, RehabilitationStatus status) {
        List<AffectedFamily> families = familyRepository.findByFilters(projectId, null, status, null, Pageable.unpaged()).getContent();
        return families.stream().map(f -> RrReportItem.builder()
                .familyId(f.getId())
                .projectId(f.getProject().getId())
                .projectCode(f.getProject().getProjectCode())
                .projectName(f.getProject().getProjectName())
                .familyHeadName(f.getFamilyHeadName())
                .familyMemberCount(f.getFamilyMemberCount())
                .category(f.getCategory().name())
                .village(f.getVillage())
                .assistanceAmount(f.getAssistanceAmount())
                .assistanceProvided(f.getAssistanceProvided())
                .alternativeSiteAllotted(f.getAlternativeSiteAllotted())
                .rehabilitationStatus(f.getRehabilitationStatus().name())
                .completionDate(f.getCompletionDate())
                .build()).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<DelayReportItem> getDelayReport(String state) {
        List<Project> projects = (state != null && !state.isBlank())
                ? projectRepository.findByFilters(state, null, null, null, Pageable.unpaged()).getContent()
                : projectRepository.findAll();

        List<DelayReportItem> delays = new ArrayList<>();
        for (Project p : projects) {
            List<ProjectMilestone> milestones = milestoneRepository.findByProjectIdOrderBySequenceOrderAsc(p.getId());
            for (ProjectMilestone m : milestones) {
                if (m.getDelayDays() > 0 || m.getStatus() == MilestoneStatus.DELAYED) {
                    delays.add(DelayReportItem.builder()
                            .projectId(p.getId())
                            .projectCode(p.getProjectCode())
                            .projectName(p.getProjectName())
                            .state(p.getState())
                            .district(p.getDistrict())
                            .delayedMilestone(m.getCustomName())
                            .plannedDate(m.getPlannedDate())
                            .actualDate(m.getActualDate())
                            .delayDays(m.getDelayDays())
                            .remarks(m.getRemarks())
                            .build());
                }
            }
        }
        return delays;
    }
}
