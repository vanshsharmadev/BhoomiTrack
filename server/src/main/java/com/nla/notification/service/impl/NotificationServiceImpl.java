package com.nla.notification.service.impl;

import com.nla.audit.entity.AuditAction;
import com.nla.audit.service.AuditService;
import com.nla.common.exception.BusinessRuleException;
import com.nla.common.exception.ResourceNotFoundException;
import com.nla.land.entity.AcquisitionStatus;
import com.nla.land.entity.LandParcel;
import com.nla.land.repository.LandParcelRepository;
import com.nla.notification.dto.NotificationRequest;
import com.nla.notification.dto.NotificationResponse;
import com.nla.notification.entity.NotificationStatus;
import com.nla.notification.entity.NotificationType;
import com.nla.notification.entity.StatutoryNotification;
import com.nla.notification.repository.StatutoryNotificationRepository;
import com.nla.notification.service.NotificationService;
import com.nla.project.entity.Project;
import com.nla.project.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final StatutoryNotificationRepository notificationRepository;
    private final ProjectRepository projectRepository;
    private final LandParcelRepository landParcelRepository;
    private final AuditService auditService;

    @Override
    @Transactional
    public NotificationResponse createNotification(NotificationRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", request.getProjectId()));

        if (notificationRepository.existsByNotificationNumber(request.getNotificationNumber())) {
            throw new BusinessRuleException("Notification with number '" + request.getNotificationNumber() + "' already exists");
        }

        StatutoryNotification notification = StatutoryNotification.builder()
                .project(project)
                .notificationType(request.getNotificationType())
                .notificationNumber(request.getNotificationNumber())
                .issueDate(request.getIssueDate())
                .publicationDate(request.getPublicationDate())
                .gazetteNumber(request.getGazetteNumber())
                .documentId(request.getDocumentId())
                .status(request.getStatus() != null ? request.getStatus() : NotificationStatus.DRAFT)
                .description(request.getDescription())
                .remarks(request.getRemarks())
                .build();

        StatutoryNotification saved = notificationRepository.save(notification);

        // If published, advance verified parcels to NOTIFIED
        if (saved.getStatus() == NotificationStatus.PUBLISHED) {
            updateParcelsToNotified(project.getId());
        }

        auditService.logAction(
                "StatutoryNotification",
                saved.getId(),
                AuditAction.CREATED,
                null,
                saved.getStatus().name(),
                null,
                "Notification created: " + saved.getNotificationNumber() + " (" + saved.getNotificationType() + ")"
        );

        return NotificationResponse.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public NotificationResponse getNotificationById(Long id) {
        StatutoryNotification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("StatutoryNotification", "id", id));
        return NotificationResponse.fromEntity(notification);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationResponse> getNotifications(Long projectId, NotificationType type, NotificationStatus status, Pageable pageable) {
        return notificationRepository.findByFilters(projectId, type, status, pageable)
                .map(NotificationResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotificationsByProject(Long projectId) {
        return notificationRepository.findByProjectId(projectId).stream()
                .map(NotificationResponse::fromEntity)
                .toList();
    }

    @Override
    @Transactional
    public NotificationResponse updateNotification(Long id, NotificationRequest request) {
        StatutoryNotification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("StatutoryNotification", "id", id));

        NotificationStatus oldStatus = notification.getStatus();

        notification.setNotificationType(request.getNotificationType());
        notification.setIssueDate(request.getIssueDate());
        notification.setPublicationDate(request.getPublicationDate());
        notification.setGazetteNumber(request.getGazetteNumber());
        notification.setDocumentId(request.getDocumentId());
        if (request.getStatus() != null) {
            notification.setStatus(request.getStatus());
        }
        notification.setDescription(request.getDescription());
        notification.setRemarks(request.getRemarks());

        StatutoryNotification saved = notificationRepository.save(notification);

        if (saved.getStatus() == NotificationStatus.PUBLISHED && oldStatus != NotificationStatus.PUBLISHED) {
            updateParcelsToNotified(saved.getProject().getId());
        }

        auditService.logAction(
                "StatutoryNotification",
                saved.getId(),
                AuditAction.UPDATED,
                oldStatus.name(),
                saved.getStatus().name(),
                null,
                "Notification updated"
        );

        return NotificationResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public void deleteNotification(Long id) {
        StatutoryNotification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("StatutoryNotification", "id", id));

        notificationRepository.delete(notification);

        auditService.logAction(
                "StatutoryNotification",
                id,
                AuditAction.DELETED,
                notification.getNotificationNumber(),
                null,
                null,
                "Notification deleted"
        );
    }

    private void updateParcelsToNotified(Long projectId) {
        List<LandParcel> parcels = landParcelRepository.findByProjectId(projectId);
        for (LandParcel p : parcels) {
            if (p.getAcquisitionStatus() == AcquisitionStatus.PROPOSED || p.getAcquisitionStatus() == AcquisitionStatus.IDENTIFIED || p.getAcquisitionStatus() == AcquisitionStatus.VERIFIED) {
                p.setAcquisitionStatus(AcquisitionStatus.NOTIFIED);
                landParcelRepository.save(p);
            }
        }
    }
}
