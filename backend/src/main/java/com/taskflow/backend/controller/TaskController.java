package com.taskflow.backend.controller;

import com.taskflow.backend.dto.CreateTaskRequest;
import com.taskflow.backend.dto.TaskResponse;
import com.taskflow.backend.dto.TaskStatusUpdateRequest;
import com.taskflow.backend.model.UserAccount;
import com.taskflow.backend.service.TaskService;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public List<TaskResponse> tasks() {
        return taskService.getAllTasks();
    }

    @GetMapping("/{id}")
    public TaskResponse task(@PathVariable Long id) {
        return taskService.getTask(id);
    }

    @PostMapping
    public TaskResponse createTask(@RequestBody CreateTaskRequest request, @RequestAttribute("currentUser") UserAccount currentUser) {
        return taskService.createTask(request, currentUser);
    }

    @PutMapping("/{id}")
    public TaskResponse updateTask(@PathVariable Long id, @RequestBody CreateTaskRequest request) {
        return taskService.updateTask(id, request);
    }

    @PatchMapping("/{id}/status")
    public TaskResponse updateTaskStatus(@PathVariable Long id, @RequestBody TaskStatusUpdateRequest request) {
        return taskService.updateTaskStatus(id, request.status());
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }
}
