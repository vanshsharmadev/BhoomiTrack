package com.nla.notification.dto;

import com.nla.notification.entity.NotificationStatus;
import com.nla.notification.entity.NotificationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest {

    @NotNull(message = "Project ID is required")
    private Long projectId;

    @NotNull(message = "Notification type is required")
    private NotificationType notificationType;

    @NotBlank(message = "Notification number is required")
    private String notificationNumber;

    @NotNull(message = "Issue date is required")
    private LocalDate issueDate;

    private LocalDate publicationDate;

    private String gazetteNumber;

    private Long documentId;

    private NotificationStatus status;

    private String description;

    private String remarks;
}
