package com.nla.award.service;

import com.nla.award.dto.AwardRequest;
import com.nla.award.dto.AwardResponse;
import com.nla.award.entity.AwardStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AwardService {

    AwardResponse createAward(AwardRequest request);

    AwardResponse getAwardById(Long id);

    Page<AwardResponse> getAwards(Long projectId, Long parcelId, AwardStatus status, Pageable pageable);

    List<AwardResponse> getAwardsByProject(Long projectId);

    AwardResponse updateAward(Long id, AwardRequest request);

    void deleteAward(Long id);
}
