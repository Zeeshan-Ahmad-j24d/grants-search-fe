// src/components/ResetPassword.tsx
import React, { useState, useEffect } from "react";
import { useStytchB2BClient } from "@stytch/react/b2b";
import { useNavigate, useSearchParams } from "react-router-dom";

const ResetPassword = () => {
  const stytchClient = useStytchB2BClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    // Extract token from URL
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError("Invalid or missing reset token");
    }
  }, [searchParams]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await stytchClient.passwords.discovery.resetByEmail({
        password_reset_token: token,
        password: password,
      });

      // Navigate to organization selection with discovered orgs
      navigate("/select-organization", {
        state: {
          discoveredOrgs: response.discovered_organizations || [],
          email: response.email_address,
        },
      });

      // // Password reset successful, redirect to grants
      // navigate("/grants");
    } catch (err: any) {
      if (err.error_type === "weak_password") {
        setError("Password is too weak. Please use a stronger password.");
      } else if (err.error_type === "breached_password") {
        setError(
          "This password has been found in a data breach. Please use a different password."
        );
      } else {
        setError(err.message || "Failed to reset password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "50px auto" }}>
      <h2>Set Your Password</h2>

      <form onSubmit={handleResetPassword}>
        <div style={{ marginBottom: "15px" }}>
          <label>New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        {error && (
          <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>
        )}

        <button
          type="submit"
          disabled={loading || !password || !confirmPassword || !token}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Resetting..." : "Set Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
