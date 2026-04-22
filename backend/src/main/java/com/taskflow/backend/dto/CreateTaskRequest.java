package com.taskflow.backend.dto;

import com.taskflow.backend.model.TaskPriority;
import com.taskflow.backend.model.TaskStatus;
import java.time.LocalDate;

public record CreateTaskRequest(
        String title,
        String summary,
        TaskPriority priority,
        TaskStatus status,
        Integer storyPoints,
        LocalDate dueDate,
        Long assigneeId
) {
}
