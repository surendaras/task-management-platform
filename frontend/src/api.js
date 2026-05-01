const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

const getHeaders = () => {
  const token = localStorage.getItem("taskflow-token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  login: (payload) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  dashboard: () => request("/dashboard"),
  tasks: () => request("/tasks"),
  task: (id) => request(`/tasks/${id}`),
  users: () => request("/users"),
  createTask: (payload) =>
    request("/tasks", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateTask: (id, payload) =>
    request(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  updateTaskStatus: (id, status) =>
    request(`/tasks/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  deleteTask: (id) =>
    request(`/tasks/${id}`, {
      method: "DELETE",
    }),
  createUser: (payload) =>
    request("/users", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  deleteUser: (id) =>
    request(`/users/${id}`, {
      method: "DELETE",
    }),
};
