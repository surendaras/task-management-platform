import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const colors = ["#f97316", "#0f766e", "#eab308", "#1d4ed8", "#ef4444"];

export function DashboardPage({ dashboardData, tasks, users, currentUser, onOpenTask }) {
  if (!dashboardData) {
    return <section className="panel">Loading dashboard...</section>;
  }

  const doneTasks = tasks.filter((task) => task.status === "DONE").length;
  const pendingTasks = tasks.length - doneTasks;

  return (
    <section className="dashboard-grid">
      <div className="hero-summary panel">
        <div>
          <span className="eyebrow">Team Pulse</span>
          <h3>Project delivery at a glance</h3>
          <p>{currentUser?.name} A complete overview of current tasks, progress status, and team workload within the workspace.</p>
        </div>
        <div className="progress-ring">
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="48" />
            <circle
              cx="60"
              cy="60"
              r="48"
              className="active-ring"
              style={{ strokeDashoffset: 301 - (301 * dashboardData.completionPercent) / 100 }}
            />
          </svg>
          <strong>{dashboardData.completionPercent}%</strong>
          <span>Completed</span>
        </div>
      </div>

      <div className="metric-grid">
        {dashboardData.metrics.map((metric) => (
          <article className="panel metric-card" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </div>

      <div className="panel chart-panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Status Chart</span>
            <h3>Task status graph</h3>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={dashboardData.statusBreakdown}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d6d3d1" />
            <XAxis dataKey="name" stroke="#57534e" />
            <YAxis stroke="#57534e" />
            <Tooltip />
            <Bar dataKey="value" radius={[10, 10, 0, 0]}>
              {dashboardData.statusBreakdown.map((entry, index) => (
                <Cell key={entry.name} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="panel chart-panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Priority Chart</span>
            <h3>Priority distribution</h3>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={dashboardData.priorityBreakdown} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95}>
              {dashboardData.priorityBreakdown.map((entry, index) => (
                <Cell key={entry.name} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="panel team-panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">People + Tasks</span>
            <h3>Quick breakdown</h3>
          </div>
        </div>
        <div className="split-stats">
          <article>
            <strong>{users.length}</strong>
            <span>Users in workspace</span>
          </article>
          <article>
            <strong>{tasks.length}</strong>
            <span>Total tasks tracked</span>
          </article>
          <article>
            <strong>{pendingTasks}</strong>
            <span>Open tasks</span>
          </article>
        </div>
        <div className="status-stack">
          {dashboardData.statusBreakdown.map((item) => (
            <div key={item.name}>
              <div className="status-line">
                <span>{item.name}</span>
                <b>{item.value}</b>
              </div>
              <div className="mini-track">
                <span style={{ width: `${tasks.length ? (item.value * 100) / tasks.length : 0}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel team-directory-panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Team Directory</span>
            <h3>Workspace users</h3>
          </div>
        </div>
        <div className="user-directory">
          {users.map((user) => (
            <article className="user-card" key={user.id}>
              <strong>{user.name}</strong>
              <span>{user.role}</span>
              <small>{user.email}</small>
            </article>
          ))}
        </div>
      </div>

      <div className="panel recent-panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Latest Activity</span>
            <h3>Recent tasks</h3>
          </div>
        </div>
        <div className="recent-list">
          {dashboardData.recentTasks.map((task) => (
            <article className="recent-card clickable" key={task.id} onClick={() => onOpenTask?.(task.id)}>
              <div>
                <h4>{task.title}</h4>
                <p>{task.summary}</p>
              </div>
              <div className="recent-meta">
                <span>{task.assigneeName}</span>
                <i className={`pill ${task.priority.toLowerCase()}`}>{task.priority}</i>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
