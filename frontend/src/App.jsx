import { useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function Logo() {
  return (
    <div className="logo">
      NETFLIX
    </div>
  );
}

function LoginPage({ onLoginSuccess }) {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value
    }));

    setErrors((current) => ({
      ...current,
      [name]: ""
    }));

    setServerError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setServerError("");

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to sign in."
        );
      }

      localStorage.setItem(
        "loggedInUser",
        JSON.stringify(data.user)
      );

      onLoginSuccess(data.user);

    } catch (error) {
      setServerError(
        error.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">

      <header className="topbar">
        <Logo />
      </header>

      <section className="login-card">

        <h1>Sign In</h1>

        {serverError && (
          <div className="server-error">
            {serverError}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
        >

          <div className="field-group">

            <label htmlFor="email">
              Email or mobile number
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              disabled={loading}
            />

            {errors.email && (
              <p className="field-error">
                {errors.email}
              </p>
            )}

          </div>

          <div className="field-group">

            <label htmlFor="password">
              Password
            </label>

            <div className="password-wrapper">

              <input
                id="password"
                name="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                disabled={loading}
              />

              <button
                type="button"
                className="show-button"
                onClick={() =>
                  setShowPassword(
                    (value) => !value
                  )
                }
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>

            </div>

            {errors.password && (
              <p className="field-error">
                {errors.password}
              </p>
            )}

          </div>

          <button
            className="signin-button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>

        </form>

        <div className="login-options">

          <label className="remember-me">
            <input type="checkbox" />
            Remember me
          </label>

          <button
            type="button"
            className="text-button"
          >
            Need help?
          </button>

        </div>

        <div className="signup-copy">
          New to Netflix?
          <button
            type="button"
            className="signup-button"
          >
            Sign up now.
          </button>
        </div>

        <p className="recaptcha-copy">
          This page is protected by reCAPTCHA
          to ensure you're not a bot.
        </p>

      </section>

      <footer className="footer">

        <p>
          Questions? Call 000-800-919-1694
        </p>

        <div className="footer-links">

          <button>FAQ</button>
          <button>Help Center</button>
          <button>Terms of Use</button>
          <button>Privacy</button>

        </div>

      </footer>

    </main>
  );
}


function Dashboard({ user, onLogout }) {
  return (
    <main className="dashboard-page">

      <header className="dashboard-header">

        <Logo />

        <button
          className="logout-button"
          onClick={onLogout}
        >
          Sign out
        </button>

      </header>

      <section className="dashboard-content">

        <p className="eyebrow">
          Welcome back
        </p>

        <h1>Dashboard</h1>

        <p>
          You are successfully logged in as{" "}
          <strong>
            {user.email}
          </strong>.
        </p>

        <div className="dashboard-card">

          <span className="play-icon">
            ▶
          </span>

          <div>

            <h2>
              Your Dashboard
            </h2>

            <p>
              Login was successful!
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}


export default function App() {

  const [user, setUser] = useState(() => {

    try {

      const savedUser =
        localStorage.getItem(
          "loggedInUser"
        );

      return savedUser
        ? JSON.parse(savedUser)
        : null;

    } catch {
      return null;
    }

  });


  const handleLogout = () => {

    localStorage.removeItem(
      "loggedInUser"
    );

    setUser(null);
  };


  if (user) {
    return (
      <Dashboard
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <LoginPage
      onLoginSuccess={setUser}
    />
  );
}
