import React, { useState } from "react";
import { useStytchB2BClient } from "@stytch/react/b2b";
import { useLocation, useNavigate } from "react-router-dom";

const SelectOrganization = () => {
  const stytchClient = useStytchB2BClient();
  const location = useLocation();
  const navigate = useNavigate();
  const [joiningOrgId, setJoiningOrgId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const { discoveredOrgs, email } = location.state || {};

  const handleSelectOrganization = async (orgId: string) => {
    setJoiningOrgId(orgId);
    setError("");

    try {
      await stytchClient.discovery.intermediateSessions.exchange({
        organization_id: orgId,
        session_duration_minutes: 60,
      });

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to join organization");
    } finally {
      setJoiningOrgId(null);
    }
  };

  const handleCreateOrganization = () => {
    navigate("/create-organization", { state: { email } });
  };

  // If no organizations found at all
  if (!discoveredOrgs || discoveredOrgs.length === 0) {
    return (
      <div style={{ padding: "20px", maxWidth: "600px", margin: "50px auto" }}>
        <h2>Welcome to Grants Portal!</h2>
        <p>Logged in as: {email}</p>
        <p>You don't have access to any organizations yet.</p>

        {error && (
          <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>
        )}

        <button
          onClick={handleCreateOrganization}
          style={{
            padding: "12px 24px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            marginTop: "20px",
          }}
        >
          Create New Organization
        </button>

        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "12px 24px",
            backgroundColor: "transparent",
            color: "#007bff",
            border: "1px solid #007bff",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            marginTop: "10px",
            marginLeft: "10px",
          }}
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "50px auto" }}>
      <h2>Select Organization</h2>
      <p>Logged in as: {email}</p>

      {error && (
        <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>
      )}

      <div style={{ marginTop: "20px" }}>
        {discoveredOrgs.map((org: any) => (
          <div
            key={org.organization.organization_id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "4px",
            }}
          >
            <h3>{org.organization.organization_name}</h3>
            <p>Status: {org.membership.type}</p>
            <button
              onClick={() =>
                handleSelectOrganization(org.organization.organization_id)
              }
              disabled={joiningOrgId === org.organization.organization_id}
              style={{
                padding: "8px 16px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor:
                  joiningOrgId === org.organization.organization_id
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {joiningOrgId === org.organization.organization_id
                ? "Joining..."
                : "Select Organization"}
            </button>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "30px",
          paddingTop: "20px",
          borderTop: "1px solid #ddd",
        }}
      >
        <p>Don't see your organization?</p>
        <button
          onClick={handleCreateOrganization}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Create New Organization
        </button>
      </div>
    </div>
  );
};

export default SelectOrganization;
