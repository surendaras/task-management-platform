import { useEffect, useState } from "react";
import { api } from "../api";
import { DashboardPage } from "./DashboardPage";

const navItems = [
  { key: "dashboard", label: "Dashboard" },
  { key: "kanban", label: "Kanban Board" },
  { key: "add-task", label: "Add Task" },
  { key: "add-user", label: "Add User" },
  { key: "total-tasks", label: "Total Tasks" },
];

const priorities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
const statuses = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE", "BLOCKED"];
const roles = ["MEMBER", "MANAGER", "ADMIN"];
const emptyTaskForm = {
  title: "",
  summary: "",
  priority: "HIGH",
  status: "TODO",
  storyPoints: 5,
  dueDate: "",
  assigneeId: "",
};
const formatStatus = (value) => value.replaceAll("_", " ");

export function WorkspacePage({ currentUser, dashboardData, tasks, users, workspaceError, onLogout, onRefresh }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [taskForm, setTaskForm] = useState(emptyTaskForm);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "MEMBER",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    if (!selectedTask) {
      return;
    }

    const nextTask = tasks.find((task) => task.id === selectedTask.id);
    if (nextTask) {
      setSelectedTask(nextTask);
    }
  }, [tasks, selectedTask]);

  const resetTaskEditor = () => {
    setTaskForm(emptyTaskForm);
    setEditingTaskId(null);
  };

  const openTask = async (taskId) => {
    setError("");
    const task = await api.task(taskId);
    setSelectedTask(task);
  };

  const prepareEditTask = (task) => {
    setEditingTaskId(task.id);
    setTaskForm({
      title: task.title,
      summary: task.summary,
      priority: task.priority,
      status: task.status,
      storyPoints: task.storyPoints,
      dueDate: task.dueDate || "",
      assigneeId: task.assigneeId || "",
    });
    setActiveTab("add-task");
  };

  const submitTask = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      const payload = {
        ...taskForm,
        storyPoints: Number(taskForm.storyPoints),
        assigneeId: taskForm.assigneeId ? Number(taskForm.assigneeId) : null,
      };
      const savedTask = editingTaskId ? await api.updateTask(editingTaskId, payload) : await api.createTask(payload);
      await onRefresh();
      resetTaskEditor();
      setSelectedTask(savedTask);
      setMessage(editingTaskId ? "Task updated" : "Task created");
      setActiveTab("total-tasks");
    } catch (submitError) {
      setError(submitError.message.replace(/^Error:\s*/, ""));
    }
  };

  const submitUser = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      await api.createUser(userForm);
      await onRefresh();
      setUserForm({ name: "", email: "", password: "", role: "MEMBER" });
      setMessage("User add ho gaya.");
    } catch (submitError) {
      setError(submitError.message.replace(/^Error:\s*/, ""));
    }
  };

  const handleDeleteUser = async (userId) => {
    setMessage("");
    setError("");
    try {
      await api.deleteUser(userId);
      await onRefresh();
      if (selectedTask?.assigneeId === userId) {
        setSelectedTask(null);
      }
      setMessage("User removed.");
    } catch (deleteError) {
      setError(deleteError.message.replace(/^Error:\s*/, ""));
    }
  };

  const handleDeleteTask = async (taskId) => {
    setError("");
    try {
      await api.deleteTask(taskId);
      await onRefresh();
      if (selectedTask?.id === taskId) {
        setSelectedTask(null);
      }
      if (editingTaskId === taskId) {
        resetTaskEditor();
      }
      setMessage("Task delete.");
    } catch (deleteError) {
      setError(deleteError.message.replace(/^Error:\s*/, ""));
    }
  };

  const moveTaskToStatus = async (taskId, nextStatus) => {
    setError("");
    try {
      const updatedTask = await api.updateTaskStatus(taskId, nextStatus);
      await onRefresh();
      setSelectedTask((current) => (current?.id === taskId ? updatedTask : current));
      setMessage(`Task ${formatStatus(nextStatus)} moved.`);
    } catch (updateError) {
      setError(updateError.message.replace(/^Error:\s*/, ""));
    }
  };

  const renderTaskDetail = () => {
    if (!selectedTask) {
      return (
        <aside className="detail-drawer empty">
          <span className="eyebrow">Ticket Detail</span>
          <h3>Select any task</h3>
          <p>Clicking on a Kanban card or task list row opens a Jira-style detail panel</p>
        </aside>
      );
    }

    return (
      <aside className="detail-drawer">
        <div className="detail-header">
          <div>
            <span className="eyebrow">Ticket Detail</span>
            <h3>{selectedTask.title}</h3>
          </div>
          <button className="text-btn" onClick={() => setSelectedTask(null)} type="button">
            Close
          </button>
        </div>
        <p className="detail-copy">{selectedTask.summary}</p>
        <div className="detail-meta-grid">
          <article>
            <span>Status</span>
            <strong>{formatStatus(selectedTask.status)}</strong>
          </article>
          <article>
            <span>Priority</span>
            <strong>{selectedTask.priority}</strong>
          </article>
          <article>
            <span>Assignee</span>
            <strong>{selectedTask.assigneeName}</strong>
          </article>
          <article>
            <span>Reporter</span>
            <strong>{selectedTask.reporterName}</strong>
          </article>
          <article>
            <span>Story Points</span>
            <strong>{selectedTask.storyPoints}</strong>
          </article>
          <article>
            <span>Due Date</span>
            <strong>{selectedTask.dueDate || "-"}</strong>
          </article>
        </div>
        <div className="detail-status-list">
          <span className="eyebrow">Quick Move</span>
          <div className="status-chip-wrap">
            {statuses.map((status) => (
              <button
                key={status}
                className={selectedTask.status === status ? "chip active" : "chip"}
                onClick={() => moveTaskToStatus(selectedTask.id, status)}
                type="button"
              >
                {formatStatus(status)}
              </button>
            ))}
          </div>
        </div>
        <div className="detail-actions">
          <button className="primary-btn" onClick={() => prepareEditTask(selectedTask)} type="button">
            Edit Task
          </button>
          <button className="danger-btn" onClick={() => handleDeleteTask(selectedTask.id)} type="button">
            Delete Task
          </button>
        </div>
      </aside>
    );
  };

  const renderKanban = () => {
    return (
      <section className="board-layout">
        <div className="board-main">
          <div className="board-people panel">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Team</span>
                <h3>{users.length} active users</h3>
              </div>
            </div>
            <div className="people-row">
              {users.map((user) => (
                <article className="team-chip" key={user.id}>
                  <strong>{user.name}</strong>
                  <span>{user.role}</span>
                </article>
              ))}
            </div>
          </div>
          <div className="board-grid">
            {statuses.map((status) => {
              const columnTasks = tasks.filter((task) => task.status === status);
              return (
                <section
                  key={status}
                  className="board-column"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    const taskId = Number(event.dataTransfer.getData("taskId"));
                    if (taskId) {
                      moveTaskToStatus(taskId, status);
                    }
                  }}
                >
                  <div className="board-header">
                    <div>
                      <span className="eyebrow">{formatStatus(status)}</span>
                      <h3>{columnTasks.length} tasks</h3>
                    </div>
                  </div>
                  <div className="board-card-stack">
                    {columnTasks.map((task) => (
                      <article
                        key={task.id}
                        className="board-card"
                        draggable
                        onDragStart={(event) => event.dataTransfer.setData("taskId", String(task.id))}
                        onClick={() => openTask(task.id)}
                      >
                        <div className="board-card-top">
                          <i className={`pill ${task.priority.toLowerCase()}`}>{task.priority}</i>
                          <span>{task.storyPoints} SP</span>
                        </div>
                        <h4>{task.title}</h4>
                        <p>{task.summary}</p>
                        <div className="board-card-meta">
                          <span>{task.assigneeName}</span>
                          <span>{task.dueDate || "No due date"}</span>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
        {renderTaskDetail()}
      </section>
    );
  };

  const renderContent = () => {
    if (activeTab === "dashboard") {
      return (
        <DashboardPage
          dashboardData={dashboardData}
          tasks={tasks}
          users={users}
          currentUser={currentUser}
          onOpenTask={openTask}
        />
      );
    }

    if (activeTab === "kanban") {
      return renderKanban();
    }

    if (activeTab === "add-task") {
      return (
        <section className="panel form-panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Task Creation</span>
              <h3>{editingTaskId ? "Edit task" : "Add a new task"}</h3>
            </div>
          </div>
          <form className="grid-form" onSubmit={submitTask}>
            <label className="wide">
              Task Title
              <input value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} required />
            </label>
            <label className="wide">
              Summary
              <textarea
                rows="4"
                value={taskForm.summary}
                onChange={(e) => setTaskForm({ ...taskForm, summary: e.target.value })}
                required
              />
            </label>
            <label>
              Priority
              <select value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}>
                {priorities.map((priority) => (
                  <option key={priority}>{priority}</option>
                ))}
              </select>
            </label>
            <label>
              Status
              <select value={taskForm.status} onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}>
                {statuses.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </label>
            <label>
              Story Points
              <input
                type="number"
                min="1"
                value={taskForm.storyPoints}
                onChange={(e) => setTaskForm({ ...taskForm, storyPoints: e.target.value })}
                required
              />
            </label>
            <label>
              Due Date
              <input type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} />
            </label>
            <label className="wide">
              Assign To
              <select value={taskForm.assigneeId} onChange={(e) => setTaskForm({ ...taskForm, assigneeId: e.target.value })}>
                <option value="">Unassigned</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
            </label>
            <button className="primary-btn" type="submit">
              {editingTaskId ? "Update Task" : "Create Task"}
            </button>
            {editingTaskId && (
              <button className="secondary-btn" onClick={resetTaskEditor} type="button">
                Cancel Edit
              </button>
            )}
          </form>
        </section>
      );
    }

    if (activeTab === "add-user") {
      return (
        <section className="panel form-panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Team Management</span>
              <h3>Add a user</h3>
            </div>
            <strong>{users.length} users</strong>
          </div>
          <form className="grid-form" onSubmit={submitUser}>
            <label>
              Full Name
              <input value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} required />
            </label>
            <label>
              Email
              <input type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} required />
            </label>
            <label>
              Password
              <input
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                required
              />
            </label>
            <label>
              Role
              <select value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}>
                {roles.map((role) => (
                  <option key={role}>{role}</option>
                ))}
              </select>
            </label>
            <button className="primary-btn" type="submit">
              Add User
            </button>
          </form>
          <div className="user-list-panel">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Current Users</span>
                <h3>Who is in the workspace</h3>
              </div>
            </div>
            <div className="user-list">
              {users.map((user) => (
                <article className="user-row-card" key={user.id}>
                  <div>
                    <strong>{user.name}</strong>
                    <p>{user.email}</p>
                  </div>
                  <div className="user-row-actions">
                    <span className="pill medium">{user.role}</span>
                    <button className="link-btn danger-text" onClick={() => handleDeleteUser(user.id)} type="button">
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className="panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Task Overview</span>
            <h3>Total Tasks</h3>
          </div>
        </div>
        <div className="task-table">
          <div className="task-row task-head">
            <span>Title</span>
            <span>Priority</span>
            <span>Status</span>
            <span>Assignee</span>
            <span>Due</span>
            <span>Actions</span>
          </div>
          {tasks.map((task) => (
            <div className="task-row" key={task.id}>
              <span>{task.title}</span>
              <span><i className={`pill ${task.priority.toLowerCase()}`}>{task.priority}</i></span>
              <span>{formatStatus(task.status)}</span>
              <span>{task.assigneeName}</span>
              <span>{task.dueDate || "-"}</span>
              <span className="row-actions">
                <button className="link-btn" onClick={() => openTask(task.id)} type="button">View</button>
                <button className="link-btn" onClick={() => prepareEditTask(task)} type="button">Edit</button>
                <button className="link-btn danger-text" onClick={() => handleDeleteTask(task.id)} type="button">Delete</button>
              </span>
            </div>
          ))}
        </div>
        {renderTaskDetail()}
      </section>
    );
  };

  return (
    <main className="workspace-shell">
      <aside className="sidebar">
        <div>
          <div className="brand-block">
            <span className="brand-mark">TF</span>
            <div>
              <h2>TaskFlow</h2>
              <p>Jira style board</p>
            </div>
          </div>
          <nav className="nav-stack">
            {navItems.map((item) => (
              <button
                key={item.key}
                className={activeTab === item.key ? "nav-btn active" : "nav-btn"}
                onClick={() => setActiveTab(item.key)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer">
          <p>{currentUser.name}</p>
          <span>{currentUser.role}</span>
          <button className="secondary-btn" onClick={onLogout} type="button">
            Logout
          </button>
        </div>
      </aside>

      <section className="workspace-content">
        <header className="topbar">
          <div>
            <span className="eyebrow">Delivery Command Center</span>
            <h1>Welcome back, {currentUser.name}</h1>
          </div>
          {message && <p className="success-pill">{message}</p>}
        </header>
        {(error || workspaceError) && <p className="error-banner">{error || workspaceError}</p>}
        {renderContent()}
      </section>
    </main>
  );
}
