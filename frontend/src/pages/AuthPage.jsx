import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../api";

export function AuthPage({ onAuthSuccess }) {
  const location = useLocation();
  const defaultMode = useMemo(
    () => new URLSearchParams(location.search).get("mode") === "register" ? "register" : "login",
    [location.search]
  );
  const [mode, setMode] = useState(defaultMode);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const action = mode === "login" ? api.login : api.register;
      const response = await action(form);
      onAuthSuccess(response);
    } catch (submitError) {
      setError(submitError.message.replace(/^Error:\s*/, ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-copy">
          <span className="eyebrow">TaskFlow Workspace</span>
          <h2>{mode === "login" ? "Login to your team space" : "Create your account"}</h2>
          <p>Role based users, assignee selection, task priorities aur live dashboard ke saath project manage kijiye.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "register" && (
            <label>
              Full Name
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
          )}
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </label>
          {error && <p className="error-text">{error}</p>}
          <button className="primary-btn" disabled={loading} type="submit">
            {loading ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}
          </button>
          <button className="text-btn" type="button" onClick={() => setMode(mode === "login" ? "register" : "login")}>
            {mode === "login" ? "New here? Create account" : "Already have an account? Login"}
          </button>
        </form>
      </section>
    </main>
  );
}
