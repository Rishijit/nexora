import { useState } from "react";
import NotebookAnimation from "./NotebookAnimation";
import API_URL from "../api";

function Login({ onLogin, onShowRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("nexoraToken", data.token);
      localStorage.setItem("nexoraUser", JSON.stringify(data.user));

      onLogin(data.user);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <NotebookAnimation />
      <div className="auth-background">
        <div className="auth-grid"></div>

        <div className="glow-orb glow-orb-one"></div>
        <div className="glow-orb glow-orb-two"></div>
        <div className="glow-orb glow-orb-three"></div>

        <div className="floating-shape shape-one">✦</div>
        <div className="floating-shape shape-two">◇</div>
        <div className="floating-shape shape-three">+</div>
        <div className="floating-shape shape-four">•</div>

        <div className="orbit orbit-one"></div>
        <div className="orbit orbit-two"></div>

        <div className="floating-workspace-card floating-notes-card">
          <span className="floating-card-icon">▤</span>
          <span>Notes</span>
        </div>

        <div className="floating-workspace-card floating-files-card">
          <span className="floating-card-icon">□</span>
          <span>Files</span>
        </div>

        <div className="floating-workspace-card floating-tasks-card">
          <span className="floating-card-icon">✓</span>
          <span>Tasks</span>
        </div>
      </div>

      <div className="auth-layout">
        <section className="auth-intro">
          <div className="auth-brand">
            <div className="auth-brand-icon">N</div>

            <div>
              <strong>Nexora</strong>
              <span>YOUR WORKSPACE</span>
            </div>
          </div>

          <div className="auth-tagline">
            <span>Organize</span>
            <b>•</b>
            <span>Focus</span>
            <b>•</b>
            <span>Achieve</span>
          </div>

          <h1>
            Welcome <span>back</span>
            <small>to Nexora.</small>
          </h1>

          <p className="auth-intro-description">
            A smarter way to keep your notes, files, tasks,
            and ideas all in one place.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature">
              <div className="auth-feature-icon">▤</div>
              <div>
                <strong>Keep everything in one place</strong>
                <span>Notes, files, tasks and more.</span>
              </div>
            </div>

            <div className="auth-feature">
              <div className="auth-feature-icon">ϟ</div>
              <div>
                <strong>Stay productive</strong>
                <span>Turn ideas into progress.</span>
              </div>
            </div>

            <div className="auth-feature">
              <div className="auth-feature-icon">⬡</div>
              <div>
                <strong>Secure and private</strong>
                <span>Your data, your space.</span>
              </div>
            </div>
          </div>

          <div className="auth-quote">
            <span>“</span>
            <p>
              Small steps every day
              <br />
              lead to big results.
            </p>
          </div>
        </section>

        <section className="auth-card">
          <div className="auth-card-glow"></div>

          <div className="auth-card-content">
            <div className="auth-mobile-brand">
              <div className="auth-brand-icon">N</div>
              <strong>Nexora</strong>
            </div>

            <div className="auth-card-heading">
              <div className="auth-card-symbol">↗</div>

              <h2>Welcome back</h2>

              <p>Sign in to continue to your workspace</p>
            </div>

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-input-group">
                <label htmlFor="login-email">Email address</label>

                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">@</span>

                  <input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label htmlFor="login-password">Password</label>

                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">⌑</span>

                  <input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="auth-options">
                <label className="remember-option">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  className="forgot-password-button"
                  onClick={() =>
                    alert("Password recovery will be added soon.")
                  }
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="auth-submit-button"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
                <span>→</span>
              </button>
            </form>

            <div className="auth-divider">
              <span></span>
              <em>or</em>
              <span></span>
            </div>

            <p className="auth-switch-text">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={onShowRegister}
              >
                Create one
              </button>
            </p>
          </div>
        </section>
      </div>

      <div className="auth-bottom-tagline">
        Your workspace. A better you.
      </div>
    </div>
  );
}

export default Login;