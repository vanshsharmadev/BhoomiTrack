package com.nla.notification.repository;

import com.nla.notification.entity.NotificationStatus;
import com.nla.notification.entity.NotificationType;
import com.nla.notification.entity.StatutoryNotification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StatutoryNotificationRepository extends JpaRepository<StatutoryNotification, Long> {

    Optional<StatutoryNotification> findByNotificationNumber(String notificationNumber);

    boolean existsByNotificationNumber(String notificationNumber);

    List<StatutoryNotification> findByProjectId(Long projectId);

    long countByProjectId(Long projectId);

    @Query("SELECT n FROM StatutoryNotification n WHERE " +
            "(:projectId IS NULL OR n.project.id = :projectId) AND " +
            "(:type IS NULL OR n.notificationType = :type) AND " +
            "(:status IS NULL OR n.status = :status) " +
            "ORDER BY n.issueDate DESC")
    Page<StatutoryNotification> findByFilters(
            @Param("projectId") Long projectId,
            @Param("type") NotificationType type,
            @Param("status") NotificationStatus status,
            Pageable pageable
    );
}
