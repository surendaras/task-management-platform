package com.taskflow.backend.dto;

import com.taskflow.backend.model.UserRole;

public record UserResponse(Long id, String name, String email, UserRole role) {
}
