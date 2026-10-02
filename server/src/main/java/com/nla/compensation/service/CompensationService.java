package com.nla.compensation.service;

import com.nla.compensation.dto.CompensationRequest;
import com.nla.compensation.dto.CompensationResponse;
import com.nla.compensation.dto.PaymentConfirmationRequest;
import com.nla.compensation.entity.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CompensationService {

    CompensationResponse createCompensation(CompensationRequest request);

    CompensationResponse getCompensationById(Long id);

    Page<CompensationResponse> getCompensations(Long projectId, Long parcelId, PaymentStatus status, Pageable pageable);

    List<CompensationResponse> getCompensationsByProject(Long projectId);

    CompensationResponse updateCompensation(Long id, CompensationRequest request);

    CompensationResponse approveCompensation(Long id);

    CompensationResponse markPaid(Long id, PaymentConfirmationRequest request);

    void deleteCompensation(Long id);
}
