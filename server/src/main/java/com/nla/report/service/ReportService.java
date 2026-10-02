package com.nla.report.service;

import com.nla.compensation.entity.PaymentStatus;
import com.nla.possession.entity.PossessionStatus;
import com.nla.project.entity.ProjectStatus;
import com.nla.project.entity.ProjectType;
import com.nla.rehabilitation.entity.RehabilitationStatus;
import com.nla.report.dto.*;

import java.util.List;

public interface ReportService {

    List<StateWiseReportResponse> getStateWiseReport();

    List<DistrictWiseReportResponse> getDistrictWiseReport(String state);

    List<ProjectWiseReportResponse> getProjectWiseReport(String state, String district, ProjectType projectType, ProjectStatus status);

    List<CompensationReportItem> getCompensationReport(Long projectId, PaymentStatus status);

    List<PossessionReportItem> getPossessionReport(Long projectId, PossessionStatus status);

    List<RrReportItem> getRrReport(Long projectId, RehabilitationStatus status);

    List<DelayReportItem> getDelayReport(String state);
}
