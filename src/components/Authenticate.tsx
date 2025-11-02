import React, { useEffect, useState, useRef } from "react";
import { useStytchB2BClient, useStytchMemberSession } from "@stytch/react/b2b";
import { useNavigate, useSearchParams } from "react-router-dom";

const Authenticate = () => {
  const stytchClient = useStytchB2BClient();
  const { session } = useStytchMemberSession();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  const hasAttempted = useRef(false);

  useEffect(() => {
    // If already authenticated, redirect
    if (session) {
      navigate("/grants");
      return;
    }

    // Prevent double execution
    if (hasAttempted.current) return;

    const token = searchParams.get("token");
    const stytchTokenType = searchParams.get("stytch_token_type");

    console.log("Token:", token);
    console.log("Token Type:", stytchTokenType);

    if (!token || !stytchTokenType) {
      setError("No authentication token found");
      return;
    }

    const authenticate = async () => {
      hasAttempted.current = true;

      try {
        if (stytchTokenType === "discovery_oauth") {
          console.log("Authenticating with Discovery OAuth...");
          const response = await stytchClient.oauth.discovery.authenticate({
            discovery_oauth_token: token,
          });

          console.log("OAuth Response:", response);

          // Always navigate to select-organization, even if no orgs found
          navigate("/select-organization", {
            state: {
              discoveredOrgs: response.discovered_organizations || [],
              email: response.email_address,
            },
          });
        } else if (stytchTokenType === "discovery_magic_links") {
          console.log("Authenticating with Discovery Magic Link...");
          const response = await stytchClient.magicLinks.discovery.authenticate(
            {
              discovery_magic_links_token: token,
            }
          );

          // Always navigate to select-organization, even if no orgs found
          navigate("/select-organization", {
            state: {
              discoveredOrgs: response.discovered_organizations || [],
              email: response.email_address,
            },
          });
        } else {
          setError(`Unknown token type: ${stytchTokenType}`);
        }
      } catch (err: any) {
        console.error("Authentication error:", err);

        // Provide more helpful error messages
        if (err.error_type === "oauth_token_not_found") {
          setError(
            "This authentication link has expired or already been used. Please try logging in again."
          );
        } else {
          setError(err.message || "Authentication failed");
        }
      }
    };

    authenticate();
  }, []); // Empty dependency array - only run once

  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Authentication Error</h2>
        <p style={{ color: "red" }}>{error}</p>
        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Authenticating...</h2>
      <p>Please wait while we log you in.</p>
    </div>
  );
};

export default Authenticate;
