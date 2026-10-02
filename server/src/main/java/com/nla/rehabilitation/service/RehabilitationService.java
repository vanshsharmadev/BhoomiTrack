package com.nla.rehabilitation.service;

import com.nla.rehabilitation.dto.AffectedFamilyRequest;
import com.nla.rehabilitation.dto.AffectedFamilyResponse;
import com.nla.rehabilitation.dto.FamilyStatusUpdateRequest;
import com.nla.rehabilitation.entity.FamilyCategory;
import com.nla.rehabilitation.entity.RehabilitationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface RehabilitationService {

    AffectedFamilyResponse createAffectedFamily(AffectedFamilyRequest request);

    AffectedFamilyResponse getFamilyById(Long id);

    Page<AffectedFamilyResponse> getFamilies(Long projectId, FamilyCategory category, RehabilitationStatus status, String district, Pageable pageable);

    List<AffectedFamilyResponse> getFamiliesByProject(Long projectId);

    AffectedFamilyResponse updateFamily(Long id, AffectedFamilyRequest request);

    AffectedFamilyResponse updateStatus(Long id, FamilyStatusUpdateRequest request);

    void deleteFamily(Long id);
}
