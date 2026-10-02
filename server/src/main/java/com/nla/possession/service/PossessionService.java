package com.nla.possession.service;

import com.nla.possession.dto.PossessionRequest;
import com.nla.possession.dto.PossessionResponse;
import com.nla.possession.dto.PossessionStatusUpdateRequest;
import com.nla.possession.entity.PossessionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PossessionService {

    PossessionResponse createPossession(PossessionRequest request);

    PossessionResponse getPossessionById(Long id);

    Page<PossessionResponse> getPossessions(Long projectId, Long parcelId, PossessionStatus status, Pageable pageable);

    List<PossessionResponse> getPossessionsByProject(Long projectId);

    PossessionResponse updateStatus(Long id, PossessionStatusUpdateRequest request);

    void deletePossession(Long id);
}
