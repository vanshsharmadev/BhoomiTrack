package com.nla.common.config;

import com.nla.audit.entity.AuditAction;
import com.nla.audit.service.AuditService;
import com.nla.award.entity.Award;
import com.nla.award.entity.AwardStatus;
import com.nla.award.repository.AwardRepository;
import com.nla.compensation.entity.Compensation;
import com.nla.compensation.entity.PaymentStatus;
import com.nla.compensation.repository.CompensationRepository;
import com.nla.land.entity.AcquisitionStatus;
import com.nla.land.entity.LandParcel;
import com.nla.land.entity.LandType;
import com.nla.land.entity.VerificationStatus;
import com.nla.land.repository.LandParcelRepository;
import com.nla.notification.entity.NotificationStatus;
import com.nla.notification.entity.NotificationType;
import com.nla.notification.entity.StatutoryNotification;
import com.nla.notification.repository.StatutoryNotificationRepository;
import com.nla.possession.entity.Possession;
import com.nla.possession.entity.PossessionStatus;
import com.nla.possession.repository.PossessionRepository;
import com.nla.project.entity.Project;
import com.nla.project.entity.ProjectStatus;
import com.nla.project.entity.ProjectType;
import com.nla.project.repository.ProjectRepository;
import com.nla.proposal.entity.Proposal;
import com.nla.proposal.entity.ProposalStatus;
import com.nla.proposal.repository.ProposalRepository;
import com.nla.rehabilitation.entity.AffectedFamily;
import com.nla.rehabilitation.entity.FamilyCategory;
import com.nla.rehabilitation.entity.RehabilitationStatus;
import com.nla.rehabilitation.repository.AffectedFamilyRepository;
import com.nla.workflow.service.WorkflowService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ProjectRepository projectRepository;
    private final ProposalRepository proposalRepository;
    private final LandParcelRepository landParcelRepository;
    private final StatutoryNotificationRepository notificationRepository;
    private final AwardRepository awardRepository;
    private final CompensationRepository compensationRepository;
    private final PossessionRepository possessionRepository;
    private final AffectedFamilyRepository familyRepository;
    private final WorkflowService workflowService;
    private final AuditService auditService;

    @Override
    @Transactional
    public void run(String... args) {
        if (projectRepository.count() > 0) {
            log.info("Database already contains data. Skipping initial seeding.");
            return;
        }

        log.info("Seeding realistic initial sample data for National Land Acquisition System...");

        // 1. Projects
        Project p1 = Project.builder()
                .projectCode("PRJ-2026-001")
                .projectName("Delhi-Mumbai Industrial Corridor - Node 7 (Manesar)")
                .projectType(ProjectType.INDUSTRIAL_CORRIDOR)
                .description("Development of Multi-Modal Logistics Hub and smart industrial city node under DMIC")
                .implementingAgency("NICDC / HSIIDC")
                .ministryDepartment("Ministry of Commerce and Industry")
                .state("Haryana")
                .district("Gurugram")
                .estimatedLandRequirement(new BigDecimal("1250.5000"))
                .requiredLandUnit("ACRES")
                .projectStartDate(LocalDate.of(2025, 4, 1))
                .expectedCompletionDate(LocalDate.of(2028, 3, 31))
                .status(ProjectStatus.IN_ACQUISITION)
                .createdBy("admin")
                .build();
        p1 = projectRepository.save(p1);

        Project p2 = Project.builder()
                .projectCode("PRJ-2026-002")
                .projectName("NH-48 8-Lane Expressway Expansion")
                .projectType(ProjectType.HIGHWAY)
                .description("Widening of Golden Quadrilateral section from 4 to 8 lanes with grade separators")
                .implementingAgency("National Highways Authority of India (NHAI)")
                .ministryDepartment("Ministry of Road Transport and Highways")
                .state("Maharashtra")
                .district("Thane")
                .estimatedLandRequirement(new BigDecimal("480.0000"))
                .requiredLandUnit("ACRES")
                .projectStartDate(LocalDate.of(2025, 8, 15))
                .expectedCompletionDate(LocalDate.of(2027, 12, 31))
                .status(ProjectStatus.IN_ACQUISITION)
                .createdBy("nhai_agency")
                .build();
        p2 = projectRepository.save(p2);

        Project p3 = Project.builder()
                .projectCode("PRJ-2026-003")
                .projectName("Western Dedicated Freight Corridor - Feeder Line")
                .projectType(ProjectType.RAILWAY)
                .description("Construction of electrified double line freight railway corridor connecting ports")
                .implementingAgency("DFCCIL")
                .ministryDepartment("Ministry of Railways")
                .state("Gujarat")
                .district("Vadodara")
                .estimatedLandRequirement(new BigDecimal("620.0000"))
                .requiredLandUnit("ACRES")
                .projectStartDate(LocalDate.of(2026, 1, 10))
                .expectedCompletionDate(LocalDate.of(2028, 6, 30))
                .status(ProjectStatus.APPROVED)
                .createdBy("admin")
                .build();
        p3 = projectRepository.save(p3);

        // 2. Initialize Milestones
        workflowService.initializeProjectLifecycle(p1.getId());
        workflowService.initializeProjectLifecycle(p2.getId());
        workflowService.initializeProjectLifecycle(p3.getId());

        // 3. Proposals
        Proposal prop1 = Proposal.builder()
                .proposalNumber("PROP-2026-001")
                .project(p1)
                .landRequired(new BigDecimal("1250.5000"))
                .landUnit("ACRES")
                .villages("Manesar, Naharpur, Kasan, Khoh")
                .district("Gurugram")
                .state("Haryana")
                .purpose("Industrial manufacturing, multimodal logistics park, inland container depot")
                .proposedTimelineMonths(36)
                .affectedFamiliesCount(450)
                .estimatedCompensation(new BigDecimal("1250000000.00")) // 125 Crores
                .status(ProposalStatus.APPROVED)
                .remarks("Approved by High-Level Empowered Committee")
                .submittedBy("nhai_agency")
                .build();
        proposalRepository.save(prop1);

        // 4. Land Parcels for Project 1 (Gurugram)
        LandParcel lp1 = LandParcel.builder()
                .parcelNumber("LP-1001")
                .surveyNumber("24/1")
                .khasraNumber("104")
                .village("Manesar")
                .tehsil("Manesar")
                .district("Gurugram")
                .state("Haryana")
                .area(new BigDecimal("12.5000"))
                .areaUnit("ACRES")
                .landType(LandType.AGRICULTURAL)
                .ownerName("Ramesh Chand Yadav")
                .ownerContact("+91 98123 45678")
                .ownerAadhaarMasked("XXXX-XXXX-1234")
                .project(p1)
                .acquisitionStatus(AcquisitionStatus.POSSESSION_TAKEN)
                .verificationStatus(VerificationStatus.VERIFIED)
                .latitude(28.3512)
                .longitude(76.9384)
                .geometry("{\"type\":\"Polygon\",\"coordinates\":[[[76.937,28.350],[76.940,28.350],[76.940,28.353],[76.937,28.353],[76.937,28.350]]]}")
                .verifiedBy("field_surveyor")
                .remarks("Verified title records with revenue tehsil")
                .build();
        lp1 = landParcelRepository.save(lp1);

        LandParcel lp2 = LandParcel.builder()
                .parcelNumber("LP-1002")
                .surveyNumber("24/2")
                .khasraNumber("105")
                .village("Manesar")
                .tehsil("Manesar")
                .district("Gurugram")
                .state("Haryana")
                .area(new BigDecimal("8.7500"))
                .areaUnit("ACRES")
                .landType(LandType.AGRICULTURAL)
                .ownerName("Suresh Kumar Sharma")
                .ownerContact("+91 98234 56789")
                .ownerAadhaarMasked("XXXX-XXXX-5678")
                .project(p1)
                .acquisitionStatus(AcquisitionStatus.COMPENSATION_PAID)
                .verificationStatus(VerificationStatus.VERIFIED)
                .latitude(28.3535)
                .longitude(76.9410)
                .geometry("{\"type\":\"Polygon\",\"coordinates\":[[[76.940,28.352],[76.943,28.352],[76.943,28.355],[76.940,28.355],[76.940,28.352]]]}")
                .verifiedBy("field_surveyor")
                .remarks("Compensation RTGS payment credited")
                .build();
        lp2 = landParcelRepository.save(lp2);

        LandParcel lp3 = LandParcel.builder()
                .parcelNumber("LP-1003")
                .surveyNumber("31/5")
                .khasraNumber("142")
                .village("Kasan")
                .tehsil("Manesar")
                .district("Gurugram")
                .state("Haryana")
                .area(new BigDecimal("15.2000"))
                .areaUnit("ACRES")
                .landType(LandType.AGRICULTURAL)
                .ownerName("Balwan Singh & Brothers")
                .ownerContact("+91 98345 67890")
                .ownerAadhaarMasked("XXXX-XXXX-9012")
                .project(p1)
                .acquisitionStatus(AcquisitionStatus.AWARD_DECLARED)
                .verificationStatus(VerificationStatus.VERIFIED)
                .latitude(28.3620)
                .longitude(76.9250)
                .geometry("{\"type\":\"Polygon\",\"coordinates\":[[[76.923,28.360],[76.927,28.360],[76.927,28.364],[76.923,28.364],[76.923,28.360]]]}")
                .verifiedBy("field_surveyor")
                .remarks("Award declared by CALA / LAC")
                .build();
        lp3 = landParcelRepository.save(lp3);

        LandParcel lp4 = LandParcel.builder()
                .parcelNumber("LP-1004")
                .surveyNumber("42/3")
                .khasraNumber("210")
                .village("Khoh")
                .tehsil("Manesar")
                .district("Gurugram")
                .state("Haryana")
                .area(new BigDecimal("6.4000"))
                .areaUnit("ACRES")
                .landType(LandType.COMMERCIAL)
                .ownerName("DLF Commercial Holding")
                .ownerContact("+91 98456 78901")
                .ownerAadhaarMasked("XXXX-XXXX-3456")
                .project(p1)
                .acquisitionStatus(AcquisitionStatus.NOTIFIED)
                .verificationStatus(VerificationStatus.VERIFIED)
                .latitude(28.3710)
                .longitude(76.9520)
                .geometry("{\"type\":\"Polygon\",\"coordinates\":[[[76.950,28.370],[76.954,28.370],[76.954,28.373],[76.950,28.373],[76.950,28.370]]]}")
                .verifiedBy("field_surveyor")
                .remarks("Section 19 Final declaration gazette published")
                .build();
        lp4 = landParcelRepository.save(lp4);

        // 5. Notifications for Project 1
        StatutoryNotification notif1 = StatutoryNotification.builder()
                .project(p1)
                .notificationType(NotificationType.PRELIMINARY_NOTIFICATION)
                .notificationNumber("NOTIF/HAR/GUR/2025/SEC11/042")
                .issueDate(LocalDate.of(2025, 5, 10))
                .publicationDate(LocalDate.of(2025, 5, 15))
                .gazetteNumber("EG-HAR-2025-5431")
                .status(NotificationStatus.PUBLISHED)
                .description("Notification under Section 11(1) of RFCTLARR Act 2013 for village Manesar & Kasan")
                .remarks("Published in two daily local vernacular newspapers and e-Gazette")
                .build();
        notificationRepository.save(notif1);

        StatutoryNotification notif2 = StatutoryNotification.builder()
                .project(p1)
                .notificationType(NotificationType.FINAL_NOTIFICATION)
                .notificationNumber("NOTIF/HAR/GUR/2025/SEC19/089")
                .issueDate(LocalDate.of(2025, 11, 20))
                .publicationDate(LocalDate.of(2025, 11, 25))
                .gazetteNumber("EG-HAR-2025-9820")
                .status(NotificationStatus.PUBLISHED)
                .description("Declaration under Section 19(1) of RFCTLARR Act 2013")
                .remarks("Objections under Section 15 heard and disposed by Collector")
                .build();
        notificationRepository.save(notif2);

        // 6. Awards
        Award aw1 = Award.builder()
                .project(p1)
                .parcel(lp1)
                .awardNumber("AWD/GUR/2026/012")
                .awardDate(LocalDate.of(2026, 2, 10))
                .marketValue(new BigDecimal("12500000.00"))
                .solatium(new BigDecimal("12500000.00")) // 100% Solatium
                .additionalAmount(new BigDecimal("1500000.00")) // 12% per annum
                .assessedAmount(new BigDecimal("26500000.00"))
                .competentAuthority("District Collector / CALA Gurugram")
                .status(AwardStatus.DECLARED)
                .remarks("Award declared as per First Schedule of RFCTLARR Act 2013")
                .build();
        awardRepository.save(aw1);

        Award aw2 = Award.builder()
                .project(p1)
                .parcel(lp2)
                .awardNumber("AWD/GUR/2026/013")
                .awardDate(LocalDate.of(2026, 2, 12))
                .marketValue(new BigDecimal("8750000.00"))
                .solatium(new BigDecimal("8750000.00"))
                .additionalAmount(new BigDecimal("1050000.00"))
                .assessedAmount(new BigDecimal("18550000.00"))
                .competentAuthority("District Collector / CALA Gurugram")
                .status(AwardStatus.DECLARED)
                .remarks("Award accepted by titleholder")
                .build();
        awardRepository.save(aw2);

        // 7. Compensation
        Compensation comp1 = Compensation.builder()
                .project(p1)
                .parcel(lp1)
                .beneficiaryName("Ramesh Chand Yadav")
                .beneficiaryType("TITLE_HOLDER")
                .bankAccountNumberMasked("XXXX-XXXX-8921")
                .ifscCode("SBIN0001234")
                .assessedAmount(new BigDecimal("26500000.00"))
                .approvedAmount(new BigDecimal("26500000.00"))
                .paidAmount(new BigDecimal("26500000.00"))
                .paymentDate(LocalDate.of(2026, 3, 1))
                .paymentStatus(PaymentStatus.PAID)
                .transactionReference("CMS2026030198234123")
                .paymentMode("RTGS")
                .remarks("Payment credited directly through Treasury PFMS portal")
                .build();
        compensationRepository.save(comp1);

        Compensation comp2 = Compensation.builder()
                .project(p1)
                .parcel(lp2)
                .beneficiaryName("Suresh Kumar Sharma")
                .beneficiaryType("TITLE_HOLDER")
                .bankAccountNumberMasked("XXXX-XXXX-4512")
                .ifscCode("PUNB0123400")
                .assessedAmount(new BigDecimal("18550000.00"))
                .approvedAmount(new BigDecimal("18550000.00"))
                .paidAmount(new BigDecimal("18550000.00"))
                .paymentDate(LocalDate.of(2026, 3, 5))
                .paymentStatus(PaymentStatus.PAID)
                .transactionReference("CMS2026030588123991")
                .paymentMode("RTGS")
                .remarks("100% compensation cleared")
                .build();
        compensationRepository.save(comp2);

        // 8. Possession
        Possession poss1 = Possession.builder()
                .project(p1)
                .parcel(lp1)
                .possessionDate(LocalDate.of(2026, 3, 15))
                .possessionStatus(PossessionStatus.TAKEN)
                .possessionOfficer("Sub-Divisional Magistrate (SDM) Manesar")
                .inspectionReference("INSP/MNSR/2026/78")
                .remarks("Physical possession taken with panchnama in presence of revenue officials")
                .build();
        possessionRepository.save(poss1);

        // 9. Affected Families (R&R)
        AffectedFamily fam1 = AffectedFamily.builder()
                .project(p1)
                .familyHeadName("Ramesh Chand Yadav")
                .familyMemberCount(5)
                .category(FamilyCategory.DISPLACED)
                .socialCategory("OBC")
                .village("Manesar")
                .district("Gurugram")
                .state("Haryana")
                .entitlementDetails("Constructed house entitlement + one-time resettlement allowance of INR 50,000")
                .assistanceAmount(new BigDecimal("500000.00"))
                .assistanceProvided(new BigDecimal("500000.00"))
                .alternativeSiteAllotted(true)
                .alternativeSiteDetails("Plot No. 45, R&R Colony Sector 8, Manesar")
                .rehabilitationStatus(RehabilitationStatus.COMPLETED)
                .completionDate(LocalDate.of(2026, 3, 20))
                .remarks("Resettlement completed with water, road, electricity provisions")
                .build();
        familyRepository.save(fam1);

        AffectedFamily fam2 = AffectedFamily.builder()
                .project(p1)
                .familyHeadName("Bhoop Singh")
                .familyMemberCount(4)
                .category(FamilyCategory.AFFECTED)
                .socialCategory("SC")
                .village("Kasan")
                .district("Gurugram")
                .state("Haryana")
                .entitlementDetails("Subsistence grant of INR 3,000 per month for 1 year + skill training")
                .assistanceAmount(new BigDecimal("150000.00"))
                .assistanceProvided(new BigDecimal("75000.00"))
                .alternativeSiteAllotted(false)
                .rehabilitationStatus(RehabilitationStatus.BENEFIT_PROVIDED)
                .remarks("First installment of subsistence grant disbursed")
                .build();
        familyRepository.save(fam2);

        // 10. Audit Log
        auditService.logAction(
                "System",
                1L,
                AuditAction.CREATED,
                null,
                "INITIALIZED",
                "SYSTEM",
                "National Land Acquisition and Management System initial seed verified"
        );

        log.info("Sample database successfully seeded with projects, proposals, parcels, awards, compensations, possession, R&R, and milestones!");
    }
}
