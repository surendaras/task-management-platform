import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "./api";
import { DashboardPage } from "./pages/DashboardPage";
import { HomePage } from "./pages/HomePage";
import { AuthPage } from "./pages/AuthPage";
import { WorkspacePage } from "./pages/WorkspacePage";

const getStoredUser = () => {
  const raw = localStorage.getItem("taskflow-user");
  return raw ? JSON.parse(raw) : null;
};

export default function App() {
  const [user, setUser] = useState(getStoredUser);
  const [dashboardData, setDashboardData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [workspaceError, setWorkspaceError] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }

    fetchWorkspace();
  }, [user]);

  const fetchWorkspace = async () => {
    try {
      const [dashboard, allTasks, allUsers] = await Promise.all([api.dashboard(), api.tasks(), api.users()]);
      setDashboardData(dashboard);
      setTasks(allTasks);
      setUsers(allUsers);
      setWorkspaceError("");
    } catch (error) {
      if (String(error.message).includes("401")) {
        handleLogout();
        return;
      }
      setWorkspaceError(error.message.replace(/^Error:\s*/, ""));
    }
  };

  const handleAuthSuccess = (authUser) => {
    localStorage.setItem("taskflow-token", authUser.token);
    localStorage.setItem("taskflow-user", JSON.stringify(authUser));
    setUser(authUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("taskflow-token");
    localStorage.removeItem("taskflow-user");
    setUser(null);
    setDashboardData(null);
    setTasks([]);
    setUsers([]);
    setWorkspaceError("");
  };

  const refreshWorkspace = async () => {
    await fetchWorkspace();
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/auth"
        element={user ? <Navigate to="/workspace" replace /> : <AuthPage onAuthSuccess={handleAuthSuccess} />}
      />
      <Route
        path="/workspace"
        element={
          user ? (
            <WorkspacePage
              currentUser={user}
              dashboardData={dashboardData}
              tasks={tasks}
              users={users}
              workspaceError={workspaceError}
              onLogout={handleLogout}
              onRefresh={refreshWorkspace}
            />
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
      <Route
        path="/dashboard-preview"
        element={<DashboardPage dashboardData={dashboardData} tasks={tasks} users={users} currentUser={user} />}
      />
    </Routes>
  );
}
