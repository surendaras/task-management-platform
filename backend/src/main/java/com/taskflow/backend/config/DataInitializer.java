package com.taskflow.backend.config;

import com.taskflow.backend.model.TaskItem;
import com.taskflow.backend.model.TaskPriority;
import com.taskflow.backend.model.TaskStatus;
import com.taskflow.backend.model.UserAccount;
import com.taskflow.backend.model.UserRole;
import com.taskflow.backend.repository.TaskRepository;
import com.taskflow.backend.repository.UserRepository;
import java.time.LocalDate;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public DataInitializer(UserRepository userRepository, TaskRepository taskRepository) {
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        UserAccount admin = createUser("Project Admin", "admin@taskflow.local", "admin123", UserRole.ADMIN);
        UserAccount designer = createUser("Riya Sharma", "riya@taskflow.local", "member123", UserRole.MEMBER);
        UserAccount developer = createUser("Aman Verma", "aman@taskflow.local", "member123", UserRole.MEMBER);
        userRepository.saveAll(List.of(admin, designer, developer));

        taskRepository.save(sampleTask("Design homepage funnel", "Hero section, CTA and feature cards.", TaskStatus.IN_PROGRESS, TaskPriority.HIGH, 8, designer, admin, 6));
        taskRepository.save(sampleTask("Implement auth flow", "Register, login and token persistence.", TaskStatus.IN_REVIEW, TaskPriority.CRITICAL, 13, developer, admin, 4));
        taskRepository.save(sampleTask("Sidebar navigation polish", "Jira style side menu and quick actions.", TaskStatus.TODO, TaskPriority.MEDIUM, 5, designer, admin, 10));
        taskRepository.save(sampleTask("Dashboard analytics", "Charts, progress ring and workload panel.", TaskStatus.DONE, TaskPriority.HIGH, 8, developer, admin, 2));
        taskRepository.save(sampleTask("User onboarding copy", "Add clean copy for home and register page.", TaskStatus.BLOCKED, TaskPriority.LOW, 3, admin, admin, 12));
    }

    private UserAccount createUser(String name, String email, String password, UserRole role) {
        UserAccount user = new UserAccount();
        user.setName(name);
        user.setEmail(email);
        user.setPasswordHash(encoder.encode(password));
        user.setRole(role);
        return user;
    }

    private TaskItem sampleTask(String title, String summary, TaskStatus status, TaskPriority priority, int points,
                                UserAccount assignee, UserAccount reporter, int dueInDays) {
        TaskItem task = new TaskItem();
        task.setTitle(title);
        task.setSummary(summary);
        task.setStatus(status);
        task.setPriority(priority);
        task.setStoryPoints(points);
        task.setAssignee(assignee);
        task.setReporter(reporter);
        task.setDueDate(LocalDate.now().plusDays(dueInDays));
        return task;
    }
}
