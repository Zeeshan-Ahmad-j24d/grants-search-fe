// src/components/RequestPasswordReset.tsx
import React, { useState } from "react";
import { useStytchB2BClient } from "@stytch/react/b2b";
import { useLocation, useNavigate } from "react-router-dom";

const RequestPasswordReset = () => {
  const stytchClient = useStytchB2BClient();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await stytchClient.passwords.discovery.resetByEmailStart({
        email_address: email,
        reset_password_redirect_url: `${window.location.origin}/reset-password`,
        discovery_redirect_url: `${window.location.origin}/authenticate`,
        reset_password_expiration_minutes: 30,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ padding: "20px", maxWidth: "400px", margin: "50px auto" }}>
        <h2>Check Your Email</h2>
        <p>We've sent a password reset link to {email}.</p>
        <p>Click the link in the email to set your new password.</p>
        <button
          onClick={() => navigate("/login")}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "50px auto" }}>
      <h2>Set / Reset Password</h2>
      <p>Enter your email to receive a password reset link.</p>

      <form onSubmit={handleSendResetEmail}>
        <div style={{ marginBottom: "15px" }}>
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        {error && (
          <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>
        )}

        <button
          type="submit"
          disabled={loading || !email}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: "10px",
          }}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/login")}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "transparent",
            color: "#007bff",
            border: "1px solid #007bff",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Back to Login
        </button>
      </form>
    </div>
  );
};

export default RequestPasswordReset;
