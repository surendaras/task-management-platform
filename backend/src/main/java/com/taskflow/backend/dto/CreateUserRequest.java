package com.taskflow.backend.dto;

import com.taskflow.backend.model.UserRole;

public record CreateUserRequest(String name, String email, String password, UserRole role) {
}
