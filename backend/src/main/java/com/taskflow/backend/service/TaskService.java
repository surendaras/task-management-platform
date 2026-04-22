package com.taskflow.backend.service;

import com.taskflow.backend.dto.CreateTaskRequest;
import com.taskflow.backend.dto.TaskResponse;
import com.taskflow.backend.model.TaskItem;
import com.taskflow.backend.model.TaskPriority;
import com.taskflow.backend.model.TaskStatus;
import com.taskflow.backend.model.UserAccount;
import com.taskflow.backend.repository.TaskRepository;
import java.util.Arrays;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserService userService;

    public TaskService(TaskRepository taskRepository, UserService userService) {
        this.taskRepository = taskRepository;
        this.userService = userService;
    }

    public List<TaskResponse> getAllTasks() {
        return taskRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    public TaskResponse getTask(Long id) {
        return toResponse(findEntity(id));
    }

    public TaskResponse createTask(CreateTaskRequest request, UserAccount reporter) {
        TaskItem task = new TaskItem();
        task.setReporter(reporter);
        applyRequest(task, request);
        return toResponse(taskRepository.save(task));
    }

    public TaskResponse updateTask(Long id, CreateTaskRequest request) {
        TaskItem task = findEntity(id);
        applyRequest(task, request);
        return toResponse(taskRepository.save(task));
    }

    public TaskResponse updateTaskStatus(Long id, TaskStatus status) {
        TaskItem task = findEntity(id);
        task.setStatus(status);
        return toResponse(taskRepository.save(task));
    }

    public void deleteTask(Long id) {
        taskRepository.delete(findEntity(id));
    }

    public long totalTasks() {
        return taskRepository.count();
    }

    public long totalTasksByStatus(TaskStatus status) {
        return taskRepository.countByStatus(status);
    }

    public long totalTasksByPriority(TaskPriority priority) {
        return taskRepository.countByPriority(priority);
    }

    public List<TaskResponse> recentTasks() {
        return taskRepository.findTop5ByOrderByCreatedAtDesc().stream().map(this::toResponse).toList();
    }

    public List<TaskStatus> statuses() {
        return Arrays.asList(TaskStatus.values());
    }

    public List<TaskPriority> priorities() {
        return Arrays.asList(TaskPriority.values());
    }

    private TaskItem findEntity(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found."));
    }

    private void applyRequest(TaskItem task, CreateTaskRequest request) {
        if (request.title() == null || request.title().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Task title is required.");
        }
        if (request.summary() == null || request.summary().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Task summary is required.");
        }

        task.setTitle(request.title());
        task.setSummary(request.summary());
        task.setPriority(request.priority() == null ? TaskPriority.MEDIUM : request.priority());
        task.setStatus(request.status() == null ? TaskStatus.TODO : request.status());
        task.setStoryPoints(request.storyPoints() == null ? 3 : request.storyPoints());
        task.setDueDate(request.dueDate());
        task.setAssignee(request.assigneeId() == null ? null : userService.findById(request.assigneeId()));
    }

    public TaskResponse toResponse(TaskItem task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getSummary(),
                task.getPriority(),
                task.getStatus(),
                task.getStoryPoints(),
                task.getDueDate(),
                task.getCreatedAt(),
                task.getUpdatedAt(),
                task.getAssignee() != null ? task.getAssignee().getId() : null,
                task.getAssignee() != null ? task.getAssignee().getName() : "Unassigned",
                task.getReporter() != null ? task.getReporter().getId() : null,
                task.getReporter() != null ? task.getReporter().getName() : "System"
        );
    }
}
