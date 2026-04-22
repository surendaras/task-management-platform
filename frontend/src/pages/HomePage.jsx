import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <main className="landing-shell">
      <section className="hero-card">
        <div className="hero-copy">
          <span className="eyebrow">Java Full Stack Task Manager</span>
          <h1>Plan, assign and track work in a clean workspace.</h1>
          <p>
            Home page, secure login, create account, dashboard analytics, add task, add user, progress view,
            charts and assignee based task tracking .
          </p>
          <div className="hero-actions">
            <Link className="primary-btn" to="/auth">
              Login
            </Link>
            <Link className="secondary-btn" to="/auth?mode=register">
              Create Account
            </Link>
          </div>
        </div>

        <div className="hero-panel">
          <div className="mini-board">
            <h3>Delivery Pulse</h3>
            <div className="mini-track">
              <span style={{ width: "74%" }} />
            </div>
            <div className="hero-stats">
              <article>
                <strong>18</strong>
                <span>Total Tasks</span>
              </article>
              <article>
                <strong>6</strong>
                <span>Team Members</span>
              </article>
              <article>
                <strong>74%</strong>
                <span>Progress</span>
              </article>
            </div>
            <ul className="mini-list">
              <li>
                <b>Critical:</b> Payment gateway testing
              </li>
              <li>
                <b>In Review:</b> Dashboard analytics UI
              </li>
              <li>
                <b>Done:</b> Login and create account flow
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
