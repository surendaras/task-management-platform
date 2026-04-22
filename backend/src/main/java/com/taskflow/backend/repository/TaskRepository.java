package com.taskflow.backend.repository;

import com.taskflow.backend.model.TaskItem;
import com.taskflow.backend.model.TaskPriority;
import com.taskflow.backend.model.TaskStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<TaskItem, Long> {

    long countByStatus(TaskStatus status);

    long countByPriority(TaskPriority priority);

    List<TaskItem> findAllByOrderByCreatedAtDesc();

    List<TaskItem> findAllByAssigneeIdOrReporterId(Long assigneeId, Long reporterId);

    List<TaskItem> findTop5ByOrderByCreatedAtDesc();
}
