import { useState } from "react";
import dataManager from "../utils/dataManager";
import "./Login.css";

const Login = ({ onLogin, onAdminAccess }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email.trim()) {
      setError("Please enter your Walmart email");
      setLoading(false);
      return;
    }

    // Check if this is admin email
    if (email.trim().toLowerCase() === "admin@walmart.com") {
      setLoading(false);
      if (onAdminAccess) {
        onAdminAccess();
        return;
      }
    }

    // Extract name from email (everything before @)
    const userName = email.split("@")[0].replace(/[._]/g, " ");
    const userId = email.toLowerCase();

    try {
      // Use data manager to validate user
      const data = await dataManager.validateUser(email.trim());

      if (data.success) {
        // Pass the user data regardless of pick status
        onLogin({
          name: data.name,
          email: email.trim(),
          userId: data.userId,
          alreadyPicked: data.alreadyPicked,
          pickedRecipient: data.pickedRecipient
        });
      } else {
        setError(data.message || "Unable to validate email. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Unable to process login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🎅 Secret Santa 🎄</h1>
          <p>Enter your Walmart email to pick your Secret Santa</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Walmart Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your Walmart email (e.g., john.doe@walmart.com)"
              disabled={loading}
              autoComplete="email"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Continue to Pick"}
          </button>
        </form>
      </div>
      <div className="snowflakes" aria-hidden="true">
        <div className="snowflake">❅</div>
        <div className="snowflake">❆</div>
        <div className="snowflake">❅</div>
        <div className="snowflake">❆</div>
        <div className="snowflake">❅</div>
        <div className="snowflake">❆</div>
        <div className="snowflake">❅</div>
      </div>
    </div>
  );
};

export default Login;
