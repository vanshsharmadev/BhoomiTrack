package com.nla.workflow;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nla.award.dto.AwardRequest;
import com.nla.award.dto.AwardResponse;
import com.nla.award.entity.AwardStatus;
import com.nla.compensation.dto.CompensationRequest;
import com.nla.compensation.dto.CompensationResponse;
import com.nla.compensation.dto.PaymentConfirmationRequest;
import com.nla.compensation.entity.PaymentStatus;
import com.nla.dashboard.dto.NationalDashboardResponse;
import com.nla.dashboard.dto.ProjectDashboardResponse;
import com.nla.dashboard.service.DashboardService;
import com.nla.land.dto.LandParcelRequest;
import com.nla.land.dto.LandParcelResponse;
import com.nla.land.dto.ParcelVerificationRequest;
import com.nla.land.entity.AcquisitionStatus;
import com.nla.land.entity.LandType;
import com.nla.land.entity.VerificationStatus;
import com.nla.notification.dto.NotificationRequest;
import com.nla.notification.dto.NotificationResponse;
import com.nla.notification.entity.NotificationStatus;
import com.nla.notification.entity.NotificationType;
import com.nla.possession.dto.PossessionRequest;
import com.nla.possession.dto.PossessionResponse;
import com.nla.possession.dto.PossessionStatusUpdateRequest;
import com.nla.possession.entity.PossessionStatus;
import com.nla.project.dto.ProjectRequest;
import com.nla.project.dto.ProjectResponse;
import com.nla.project.entity.ProjectStatus;
import com.nla.project.entity.ProjectType;
import com.nla.proposal.dto.ProposalApprovalRequest;
import com.nla.proposal.dto.ProposalRequest;
import com.nla.proposal.dto.ProposalResponse;
import com.nla.proposal.entity.ProposalStatus;
import com.nla.rehabilitation.dto.AffectedFamilyRequest;
import com.nla.rehabilitation.dto.AffectedFamilyResponse;
import com.nla.rehabilitation.dto.FamilyStatusUpdateRequest;
import com.nla.rehabilitation.entity.FamilyCategory;
import com.nla.rehabilitation.entity.RehabilitationStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class EndToEndWorkflowIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private DashboardService dashboardService;

    private static Long createdProjectId;
    private static Long createdProposalId;
    private static Long createdParcelId;
    private static Long createdNotificationId;
    private static Long createdAwardId;
    private static Long createdCompensationId;
    private static Long createdPossessionId;
    private static Long createdFamilyId;

    @Test
    @Order(1)
    @DisplayName("Stage 1: Project Creation")
    void testCreateProject() throws Exception {
        ProjectRequest request = ProjectRequest.builder()
                .projectCode("E2E-PRJ-2026")
                .projectName("National High-Speed Rail Corridor - Section 1")
                .projectType(ProjectType.RAILWAY)
                .description("Bullet train corridor connecting Ahmedabad and Mumbai")
                .implementingAgency("NHSRCL")
                .ministryDepartment("Ministry of Railways")
                .state("Gujarat")
                .district("Surat")
                .estimatedLandRequirement(new BigDecimal("350.0000"))
                .requiredLandUnit("ACRES")
                .projectStartDate(LocalDate.of(2026, 1, 1))
                .expectedCompletionDate(LocalDate.of(2029, 12, 31))
                .status(ProjectStatus.DRAFT)
                .build();

        MvcResult result = mockMvc.perform(post("/api/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.projectCode").value("E2E-PRJ-2026"))
                .andReturn();

        String responseJson = result.getResponse().getContentAsString();
        createdProjectId = objectMapper.readTree(responseJson).path("data").path("id").asLong();
        assertThat(createdProjectId).isNotNull();
    }

    @Test
    @Order(2)
    @DisplayName("Stage 2: Proposal Submission and Multi-tier Approval")
    void testProposalSubmissionAndApproval() throws Exception {
        // Create draft proposal
        ProposalRequest propReq = ProposalRequest.builder()
                .proposalNumber("E2E-PROP-001")
                .projectId(createdProjectId)
                .landRequired(new BigDecimal("350.0000"))
                .villages("Olpad, Choryasi, Kamrej")
                .district("Surat")
                .state("Gujarat")
                .purpose("Track alignment and traction substation construction")
                .proposedTimelineMonths(24)
                .affectedFamiliesCount(120)
                .estimatedCompensation(new BigDecimal("500000000.00"))
                .build();

        MvcResult propResult = mockMvc.perform(post("/api/proposals")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(propReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.status").value(ProposalStatus.DRAFT.name()))
                .andReturn();

        createdProposalId = objectMapper.readTree(propResult.getResponse().getContentAsString()).path("data").path("id").asLong();

        // Submit proposal
        mockMvc.perform(post("/api/proposals/" + createdProposalId + "/submit?submittedBy=nhsrcl_agency"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value(ProposalStatus.SUBMITTED.name()));

        // Approve proposal
        ProposalApprovalRequest approvalReq = ProposalApprovalRequest.builder()
                .comments("Approved after technical and financial vetting by State Committee")
                .reviewerRole("STATE_AUTHORITY")
                .build();

        mockMvc.perform(post("/api/proposals/" + createdProposalId + "/approve")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(approvalReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value(ProposalStatus.APPROVED.name()));

        // Verify project status advanced to IN_ACQUISITION
        mockMvc.perform(get("/api/projects/" + createdProjectId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value(ProjectStatus.IN_ACQUISITION.name()));
    }

    @Test
    @Order(3)
    @DisplayName("Stage 3: Land Parcel Identification & Field Verification")
    void testLandParcelIdentificationAndVerification() throws Exception {
        LandParcelRequest parcelReq = LandParcelRequest.builder()
                .parcelNumber("E2E-LP-501")
                .surveyNumber("78/3")
                .khasraNumber("214")
                .village("Olpad")
                .tehsil("Olpad")
                .district("Surat")
                .state("Gujarat")
                .area(new BigDecimal("5.5000"))
                .areaUnit("ACRES")
                .landType(LandType.AGRICULTURAL)
                .ownerName("Jayantibhai Patel")
                .ownerContact("+91 99887 76655")
                .ownerAadhaarMasked("XXXX-XXXX-9988")
                .projectId(createdProjectId)
                .latitude(21.3325)
                .longitude(72.7538)
                .build();

        MvcResult result = mockMvc.perform(post("/api/land-parcels")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(parcelReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.acquisitionStatus").value(AcquisitionStatus.PROPOSED.name()))
                .andReturn();

        createdParcelId = objectMapper.readTree(result.getResponse().getContentAsString()).path("data").path("id").asLong();

        // Field verification
        ParcelVerificationRequest verifReq = ParcelVerificationRequest.builder()
                .verificationStatus(VerificationStatus.VERIFIED)
                .verifiedBy("surveyor_surat")
                .remarks("Ground boundaries matched revenue cadastral map")
                .build();

        mockMvc.perform(patch("/api/land-parcels/" + createdParcelId + "/verify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(verifReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.acquisitionStatus").value(AcquisitionStatus.VERIFIED.name()))
                .andExpect(jsonPath("$.data.verificationStatus").value(VerificationStatus.VERIFIED.name()));
    }

    @Test
    @Order(4)
    @DisplayName("Stage 4: Statutory Notification Publication")
    void testStatutoryNotification() throws Exception {
        NotificationRequest notifReq = NotificationRequest.builder()
                .projectId(createdProjectId)
                .notificationType(NotificationType.FINAL_NOTIFICATION)
                .notificationNumber("E2E-NOTIF-SEC19-2026")
                .issueDate(LocalDate.now().minusDays(10))
                .publicationDate(LocalDate.now())
                .gazetteNumber("GUJ-GAZ-2026-0099")
                .status(NotificationStatus.PUBLISHED)
                .description("Section 19 Declaration for High-Speed Rail Corridor in Surat")
                .build();

        MvcResult result = mockMvc.perform(post("/api/notifications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(notifReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.status").value(NotificationStatus.PUBLISHED.name()))
                .andReturn();

        createdNotificationId = objectMapper.readTree(result.getResponse().getContentAsString()).path("data").path("id").asLong();

        // Check that verified parcel was automatically updated to NOTIFIED
        mockMvc.perform(get("/api/land-parcels/" + createdParcelId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.acquisitionStatus").value(AcquisitionStatus.NOTIFIED.name()));
    }

    @Test
    @Order(5)
    @DisplayName("Stage 5: Award Declaration")
    void testAwardDeclaration() throws Exception {
        AwardRequest awardReq = AwardRequest.builder()
                .projectId(createdProjectId)
                .parcelId(createdParcelId)
                .awardNumber("E2E-AWD-2026-001")
                .awardDate(LocalDate.now())
                .marketValue(new BigDecimal("5000000.00"))
                .solatium(new BigDecimal("5000000.00"))
                .additionalAmount(new BigDecimal("600000.00"))
                .assessedAmount(new BigDecimal("10600000.00"))
                .competentAuthority("Competent Authority for Land Acquisition (CALA) Surat")
                .status(AwardStatus.DECLARED)
                .build();

        MvcResult result = mockMvc.perform(post("/api/awards")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(awardReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.status").value(AwardStatus.DECLARED.name()))
                .andReturn();

        createdAwardId = objectMapper.readTree(result.getResponse().getContentAsString()).path("data").path("id").asLong();

        // Verify parcel transitioned to AWARD_DECLARED
        mockMvc.perform(get("/api/land-parcels/" + createdParcelId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.acquisitionStatus").value(AcquisitionStatus.AWARD_DECLARED.name()));
    }

    @Test
    @Order(6)
    @DisplayName("Stage 6: Compensation Assessment and Payment Disbursement")
    void testCompensationDisbursement() throws Exception {
        CompensationRequest compReq = CompensationRequest.builder()
                .projectId(createdProjectId)
                .parcelId(createdParcelId)
                .beneficiaryName("Jayantibhai Patel")
                .beneficiaryType("TITLE_HOLDER")
                .bankAccountNumberMasked("XXXX-XXXX-3344")
                .ifscCode("BARB0SURAT")
                .assessedAmount(new BigDecimal("10600000.00"))
                .approvedAmount(new BigDecimal("10600000.00"))
                .build();

        MvcResult compResult = mockMvc.perform(post("/api/compensation")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(compReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.paymentStatus").value(PaymentStatus.ASSESSED.name()))
                .andReturn();

        createdCompensationId = objectMapper.readTree(compResult.getResponse().getContentAsString()).path("data").path("id").asLong();

        // Approve compensation
        mockMvc.perform(post("/api/compensation/" + createdCompensationId + "/approve"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.paymentStatus").value(PaymentStatus.APPROVED.name()));

        // Disburse full compensation via RTGS
        PaymentConfirmationRequest paymentReq = PaymentConfirmationRequest.builder()
                .paidAmount(new BigDecimal("10600000.00"))
                .paymentDate(LocalDate.now())
                .transactionReference("RTGS2026040199998888")
                .paymentMode("RTGS")
                .remarks("100% award payment transferred to beneficiary bank account")
                .build();

        mockMvc.perform(post("/api/compensation/" + createdCompensationId + "/mark-paid")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(paymentReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.paymentStatus").value(PaymentStatus.PAID.name()));

        // Verify parcel transitioned to COMPENSATION_PAID
        mockMvc.perform(get("/api/land-parcels/" + createdParcelId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.acquisitionStatus").value(AcquisitionStatus.COMPENSATION_PAID.name()));
    }

    @Test
    @Order(7)
    @DisplayName("Stage 7: Physical Land Possession")
    void testPossessionTaking() throws Exception {
        PossessionRequest possReq = PossessionRequest.builder()
                .projectId(createdProjectId)
                .parcelId(createdParcelId)
                .possessionOfficer("SDM Olpad")
                .possessionStatus(PossessionStatus.TAKEN)
                .inspectionReference("INSP-SURAT-2026-088")
                .remarks("Physical handover completed, boundary poles erected")
                .build();

        MvcResult result = mockMvc.perform(post("/api/possession")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(possReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.possessionStatus").value(PossessionStatus.TAKEN.name()))
                .andReturn();

        createdPossessionId = objectMapper.readTree(result.getResponse().getContentAsString()).path("data").path("id").asLong();

        // Check parcel transitioned to POSSESSION_TAKEN
        mockMvc.perform(get("/api/land-parcels/" + createdParcelId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.acquisitionStatus").value(AcquisitionStatus.POSSESSION_TAKEN.name()));
    }

    @Test
    @Order(8)
    @DisplayName("Stage 8: Rehabilitation & Resettlement (R&R) Completion")
    void testRehabilitationAndResettlement() throws Exception {
        AffectedFamilyRequest familyReq = AffectedFamilyRequest.builder()
                .projectId(createdProjectId)
                .familyHeadName("Jayantibhai Patel")
                .familyMemberCount(4)
                .category(FamilyCategory.DISPLACED)
                .socialCategory("GENERAL")
                .village("Olpad")
                .district("Surat")
                .state("Gujarat")
                .assistanceAmount(new BigDecimal("400000.00"))
                .assistanceProvided(new BigDecimal("400000.00"))
                .alternativeSiteAllotted(true)
                .alternativeSiteDetails("Plot 12, R&R Township Surat")
                .rehabilitationStatus(RehabilitationStatus.COMPLETED)
                .completionDate(LocalDate.now())
                .build();

        MvcResult result = mockMvc.perform(post("/api/rr/families")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(familyReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.rehabilitationStatus").value(RehabilitationStatus.COMPLETED.name()))
                .andReturn();

        createdFamilyId = objectMapper.readTree(result.getResponse().getContentAsString()).path("data").path("id").asLong();
    }

    @Test
    @Order(9)
    @DisplayName("Stage 9: Verify Dashboards and GIS Integrations")
    void testDashboardAndGisAnalytics() throws Exception {
        // Project Dashboard
        mockMvc.perform(get("/api/dashboard/project/" + createdProjectId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.projectCode").value("E2E-PRJ-2026"))
                .andExpect(jsonPath("$.data.awardsDeclared").value(1))
                .andExpect(jsonPath("$.data.possessionCompletedParcels").value(1))
                .andExpect(jsonPath("$.data.compensationPaid").value(10600000.00));

        // GIS GeoJSON output
        mockMvc.perform(get("/api/gis/projects/" + createdProjectId + "/parcels"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.type").value("FeatureCollection"))
                .andExpect(jsonPath("$.features[0].properties.parcelNumber").value("E2E-LP-501"))
                .andExpect(jsonPath("$.features[0].properties.acquisitionStatus").value("POSSESSION_TAKEN"));

        // National Dashboard
        mockMvc.perform(get("/api/dashboard/national"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalProjects").isNumber());

        // Audit Trail verification
        mockMvc.perform(get("/api/audit/LandParcel/" + createdParcelId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray());
    }
}
