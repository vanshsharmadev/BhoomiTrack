package com.nla.notification.service;

import com.nla.notification.dto.NotificationRequest;
import com.nla.notification.dto.NotificationResponse;
import com.nla.notification.entity.NotificationStatus;
import com.nla.notification.entity.NotificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface NotificationService {

    NotificationResponse createNotification(NotificationRequest request);

    NotificationResponse getNotificationById(Long id);

    Page<NotificationResponse> getNotifications(Long projectId, NotificationType type, NotificationStatus status, Pageable pageable);

    List<NotificationResponse> getNotificationsByProject(Long projectId);

    NotificationResponse updateNotification(Long id, NotificationRequest request);

    void deleteNotification(Long id);
}
