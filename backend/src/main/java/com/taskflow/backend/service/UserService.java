package com.taskflow.backend.service;

import com.taskflow.backend.dto.CreateUserRequest;
import com.taskflow.backend.dto.UserResponse;
import com.taskflow.backend.model.TaskItem;
import com.taskflow.backend.model.UserAccount;
import com.taskflow.backend.model.UserRole;
import com.taskflow.backend.repository.TaskRepository;
import com.taskflow.backend.repository.UserRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository, TaskRepository taskRepository) {
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream().map(this::toResponse).toList();
    }

    public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.findByEmailIgnoreCase(request.email()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User already exists.");
        }

        UserAccount user = new UserAccount();
        user.setName(request.name());
        user.setEmail(request.email().trim().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.password() == null || request.password().isBlank() ? "password123" : request.password()));
        user.setRole(request.role() == null ? UserRole.MEMBER : request.role());
        userRepository.save(user);
        return toResponse(user);
    }

    public UserAccount findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));
    }

    public void deleteUser(Long id) {
        UserAccount user = findById(id);
        List<TaskItem> relatedTasks = taskRepository.findAllByAssigneeIdOrReporterId(id, id);

        for (TaskItem task : relatedTasks) {
            if (task.getAssignee() != null && id.equals(task.getAssignee().getId())) {
                task.setAssignee(null);
            }
            if (task.getReporter() != null && id.equals(task.getReporter().getId())) {
                task.setReporter(null);
            }
        }

        taskRepository.saveAll(relatedTasks);
        userRepository.delete(user);
    }

    private UserResponse toResponse(UserAccount user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}
