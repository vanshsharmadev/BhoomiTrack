package com.nla.notification.dto;

import com.nla.notification.entity.NotificationStatus;
import com.nla.notification.entity.NotificationType;
import com.nla.notification.entity.StatutoryNotification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {

    private Long id;
    private Long projectId;
    private String projectCode;
    private String projectName;
    private NotificationType notificationType;
    private String notificationNumber;
    private LocalDate issueDate;
    private LocalDate publicationDate;
    private String gazetteNumber;
    private Long documentId;
    private NotificationStatus status;
    private String description;
    private String remarks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static NotificationResponse fromEntity(StatutoryNotification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .projectId(n.getProject().getId())
                .projectCode(n.getProject().getProjectCode())
                .projectName(n.getProject().getProjectName())
                .notificationType(n.getNotificationType())
                .notificationNumber(n.getNotificationNumber())
                .issueDate(n.getIssueDate())
                .publicationDate(n.getPublicationDate())
                .gazetteNumber(n.getGazetteNumber())
                .documentId(n.getDocumentId())
                .status(n.getStatus())
                .description(n.getDescription())
                .remarks(n.getRemarks())
                .createdAt(n.getCreatedAt())
                .updatedAt(n.getUpdatedAt())
                .build();
    }
}
