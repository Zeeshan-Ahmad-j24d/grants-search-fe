import React, { useState } from "react";
import { useStytchB2BClient } from "@stytch/react/b2b";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";

const Login = () => {
  const stytchClient = useStytchB2BClient();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await stytchClient.passwords.discovery.authenticate({
        email_address: email,
        password: password,
      });

      if (
        response.discovered_organizations &&
        response.discovered_organizations.length > 0
      ) {
        navigate("/select-organization", {
          state: {
            discoveredOrgs: response.discovered_organizations,
            email: email,
          },
        });
      } else {
        setError("No organizations found for this account");
      }
    } catch (err: any) {
      if (err.error_type === "member_password_not_found") {
        setError(
          "No password set for this account. Please click 'Set Password' below or use OAuth."
        );
      } else {
        setError(err.message || "Failed to authenticate");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = (
    provider: "google" | "microsoft" | "github" | "slack" | "hubspot"
  ) => {
    const discoveryRedirectURL = `${window.location.origin}/authenticate`;

    stytchClient.oauth[provider].discovery.start({
      discovery_redirect_url: discoveryRedirectURL,
    });
  };

  const handleForgotPassword = () => {
    navigate("/request-password-reset", { state: { email } });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "50px auto" }}>
      <h2>Login to Grants Portal</h2>

      {/* OAuth Buttons */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => handleOAuthLogin("google")}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#fff",
            color: "#333",
            border: "1px solid #ddd",
            borderRadius: "4px",
            cursor: "pointer",
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          {/* <span> */}
          <FaGoogle />
          {/* </span> */}
          Continue with Google
        </button>
      </div>

      {/* Divider */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          margin: "20px 0",
          color: "#666",
        }}
      >
        <div style={{ flex: 1, height: "1px", backgroundColor: "#ddd" }}></div>
        <span style={{ padding: "0 10px" }}>OR</span>
        <div style={{ flex: 1, height: "1px", backgroundColor: "#ddd" }}></div>
      </div>

      {/* Password Login Form */}
      <form onSubmit={handlePasswordLogin}>
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

        <div style={{ marginBottom: "15px" }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        {error && (
          <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>
        )}

        <button
          type="submit"
          disabled={loading || !email || !password}
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
          {loading ? "Logging in..." : "Login with Password"}
        </button>

        <button
          type="button"
          onClick={handleForgotPassword}
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
          Set Password / Forgot Password
        </button>
      </form>
    </div>
  );
};

export default Login;
