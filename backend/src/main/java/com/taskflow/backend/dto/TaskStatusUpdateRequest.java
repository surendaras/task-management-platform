package com.taskflow.backend.dto;

import com.taskflow.backend.model.TaskStatus;

public record TaskStatusUpdateRequest(TaskStatus status) {
}
