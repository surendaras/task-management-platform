package com.taskflow.backend.dto;

import com.taskflow.backend.model.TaskPriority;
import com.taskflow.backend.model.TaskStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record TaskResponse(
        Long id,
        String title,
        String summary,
        TaskPriority priority,
        TaskStatus status,
        Integer storyPoints,
        LocalDate dueDate,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Long assigneeId,
        String assigneeName,
        Long reporterId,
        String reporterName
) {
}
