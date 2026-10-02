package com.nla.workflow.service;

import com.nla.workflow.dto.MilestoneRequest;
import com.nla.workflow.dto.MilestoneResponse;

import java.util.List;

public interface WorkflowService {

    List<MilestoneResponse> getMilestonesByProject(Long projectId);

    MilestoneResponse addMilestone(Long projectId, MilestoneRequest request);

    MilestoneResponse updateMilestone(Long milestoneId, MilestoneRequest request);

    List<MilestoneResponse> initializeProjectLifecycle(Long projectId);

    void deleteMilestone(Long milestoneId);
}
