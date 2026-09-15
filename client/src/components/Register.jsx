import { useState } from "react";
import API_URL from "../api";

function Register({ onRegister, onShowLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed"
        );
      }

      onRegister();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
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
            Start <span>creating</span>
            <small>your workspace.</small>
          </h1>

          <p className="auth-intro-description">
            Bring your ideas, files, and plans together
            in one focused digital space.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature">
              <div className="auth-feature-icon">✦</div>

              <div>
                <strong>Create your personal space</strong>
                <span>Everything organized your way.</span>
              </div>
            </div>

            <div className="auth-feature">
              <div className="auth-feature-icon">ϟ</div>

              <div>
                <strong>Work with clarity</strong>
                <span>Focus on what matters most.</span>
              </div>
            </div>

            <div className="auth-feature">
              <div className="auth-feature-icon">⬡</div>

              <div>
                <strong>Your space, your control</strong>
                <span>Private and secure by design.</span>
              </div>
            </div>
          </div>

          <div className="auth-quote">
            <span>“</span>

            <p>
              Every great idea
              <br />
              starts with one small step.
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
              <div className="auth-card-symbol">✦</div>

              <h2>Create account</h2>

              <p>
                Start building your personal workspace
              </p>
            </div>

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="auth-form"
            >
              <div className="auth-input-group">
                <label htmlFor="register-name">
                  Full name
                </label>

                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">
                    ◉
                  </span>

                  <input
                    id="register-name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label htmlFor="register-email">
                  Email address
                </label>

                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">
                    @
                  </span>

                  <input
                    id="register-email"
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
                <label htmlFor="register-password">
                  Password
                </label>

                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">
                    ⌑
                  </span>

                  <input
                    id="register-password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    minLength={6}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="auth-submit-button"
                disabled={loading}
              >
                {loading
                  ? "Creating..."
                  : "Create Account"}

                <span>→</span>
              </button>
            </form>

            <div className="auth-divider">
              <span></span>
              <em>or</em>
              <span></span>
            </div>

            <p className="auth-switch-text">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onShowLogin}
              >
                Sign in
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

export default Register;