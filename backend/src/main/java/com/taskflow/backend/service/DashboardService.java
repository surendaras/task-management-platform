package com.taskflow.backend.service;

import com.taskflow.backend.dto.ChartItem;
import com.taskflow.backend.dto.DashboardResponse;
import com.taskflow.backend.dto.MetricCard;
import com.taskflow.backend.model.TaskPriority;
import com.taskflow.backend.model.TaskStatus;
import com.taskflow.backend.repository.UserRepository;
import java.util.Arrays;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final TaskService taskService;
    private final UserRepository userRepository;

    public DashboardService(TaskService taskService, UserRepository userRepository) {
        this.taskService = taskService;
        this.userRepository = userRepository;
    }

    public DashboardResponse getDashboard() {
        long totalTasks = taskService.totalTasks();
        long completedTasks = taskService.totalTasksByStatus(TaskStatus.DONE);
        int completionPercent = totalTasks == 0 ? 0 : (int) ((completedTasks * 100) / totalTasks);

        List<MetricCard> metrics = List.of(
                new MetricCard("Total Users", userRepository.count()),
                new MetricCard("Total Tasks", totalTasks),
                new MetricCard("In Progress", taskService.totalTasksByStatus(TaskStatus.IN_PROGRESS)),
                new MetricCard("Done Tasks", completedTasks)
        );

        List<ChartItem> statusBreakdown = Arrays.stream(TaskStatus.values())
                .map(status -> new ChartItem(formatName(status.name()), taskService.totalTasksByStatus(status)))
                .toList();

        List<ChartItem> priorityBreakdown = Arrays.stream(TaskPriority.values())
                .map(priority -> new ChartItem(formatName(priority.name()), taskService.totalTasksByPriority(priority)))
                .toList();

        return new DashboardResponse(metrics, statusBreakdown, priorityBreakdown, taskService.recentTasks(), completionPercent);
    }

    private String formatName(String raw) {
        return raw.replace("_", " ");
    }
}
