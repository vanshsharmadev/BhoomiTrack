package com.nla.project;

import com.nla.audit.service.AuditService;
import com.nla.common.exception.BusinessRuleException;
import com.nla.project.dto.ProjectRequest;
import com.nla.project.dto.ProjectResponse;
import com.nla.project.entity.Project;
import com.nla.project.entity.ProjectStatus;
import com.nla.project.entity.ProjectType;
import com.nla.project.repository.ProjectRepository;
import com.nla.project.service.impl.ProjectServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private ProjectServiceImpl projectService;

    private Project sampleProject;

    @BeforeEach
    void setUp() {
        sampleProject = Project.builder()
                .id(1L)
                .projectCode("PRJ-TEST-001")
                .projectName("Test Highway Project")
                .projectType(ProjectType.HIGHWAY)
                .implementingAgency("NHAI")
                .state("Haryana")
                .district("Gurugram")
                .estimatedLandRequirement(new BigDecimal("100.0000"))
                .status(ProjectStatus.DRAFT)
                .build();
    }

    @Test
    @DisplayName("Should create project successfully")
    void testCreateProjectSuccess() {
        ProjectRequest request = ProjectRequest.builder()
                .projectCode("PRJ-TEST-001")
                .projectName("Test Highway Project")
                .projectType(ProjectType.HIGHWAY)
                .implementingAgency("NHAI")
                .state("Haryana")
                .district("Gurugram")
                .estimatedLandRequirement(new BigDecimal("100.0000"))
                .build();

        when(projectRepository.existsByProjectCode("PRJ-TEST-001")).thenReturn(false);
        when(projectRepository.save(any(Project.class))).thenReturn(sampleProject);

        ProjectResponse response = projectService.createProject(request);

        assertThat(response).isNotNull();
        assertThat(response.getProjectCode()).isEqualTo("PRJ-TEST-001");
        verify(projectRepository, times(1)).save(any(Project.class));
        verify(auditService, times(1)).logAction(any(), any(), any(), any(), any(), any(), any());
    }

    @Test
    @DisplayName("Should throw exception when duplicate project code is provided")
    void testDuplicateProjectCodeThrowsException() {
        ProjectRequest request = ProjectRequest.builder()
                .projectCode("PRJ-TEST-001")
                .projectName("Another Project")
                .projectType(ProjectType.HIGHWAY)
                .implementingAgency("NHAI")
                .state("Haryana")
                .district("Gurugram")
                .estimatedLandRequirement(new BigDecimal("100.0000"))
                .build();

        when(projectRepository.existsByProjectCode("PRJ-TEST-001")).thenReturn(true);

        assertThatThrownBy(() -> projectService.createProject(request))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("already exists");

        verify(projectRepository, never()).save(any(Project.class));
    }

    @Test
    @DisplayName("Should transition project status and log audit")
    void testUpdateProjectStatus() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(sampleProject));
        when(projectRepository.save(any(Project.class))).thenAnswer(i -> i.getArgument(0));

        ProjectResponse response = projectService.updateProjectStatus(1L, ProjectStatus.APPROVED, "Approved by Central Board");

        assertThat(response.getStatus()).isEqualTo(ProjectStatus.APPROVED);
        verify(auditService, times(1)).logAction(eq("Project"), eq(1L), any(), eq("DRAFT"), eq("APPROVED"), any(), any());
    }
}
