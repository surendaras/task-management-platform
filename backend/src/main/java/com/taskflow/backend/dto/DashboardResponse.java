package com.taskflow.backend.dto;

import java.util.List;

public record DashboardResponse(
        List<MetricCard> metrics,
        List<ChartItem> statusBreakdown,
        List<ChartItem> priorityBreakdown,
        List<TaskResponse> recentTasks,
        int completionPercent
) {
}
