import React, { useState } from "react";
import { useStytchB2BClient } from "@stytch/react/b2b";
import { useLocation, useNavigate } from "react-router-dom";

const CreateOrganization = () => {
  const stytchClient = useStytchB2BClient();
  const location = useLocation();
  const navigate = useNavigate();
  const [organizationName, setOrganizationName] = useState("");
  const [organizationSlug, setOrganizationSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { email } = location.state || {};

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await stytchClient.discovery.organizations.create({
        organization_name: organizationName,
        organization_slug: organizationSlug,
        session_duration_minutes: 60,
      });

      // Successfully created organization and logged in
      navigate("/grants");
    } catch (err: any) {
      setError(err.message || "Failed to create organization");
    } finally {
      setLoading(false);
    }
  };

  const handleSlugChange = (name: string) => {
    // Auto-generate slug from organization name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setOrganizationSlug(slug);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "50px auto" }}>
      <h2>Create Your Organization</h2>
      <p>Logged in as: {email}</p>

      <form onSubmit={handleCreateOrganization}>
        <div style={{ marginBottom: "15px" }}>
          <label>Organization Name *</label>
          <input
            type="text"
            value={organizationName}
            onChange={(e) => {
              setOrganizationName(e.target.value);
              handleSlugChange(e.target.value);
            }}
            placeholder="Acme Corporation"
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Organization Slug *</label>
          <input
            type="text"
            value={organizationSlug}
            onChange={(e) => setOrganizationSlug(e.target.value)}
            placeholder="acme-corporation"
            required
            pattern="[a-z0-9-]+"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
          <small style={{ color: "#666" }}>
            Lowercase letters, numbers, and hyphens only. This will be used in
            URLs.
          </small>
        </div>

        {error && (
          <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>
        )}

        <button
          type="submit"
          disabled={loading || !organizationName || !organizationSlug}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: "10px",
          }}
        >
          {loading ? "Creating..." : "Create Organization"}
        </button>

        <button
          type="button"
          onClick={() =>
            navigate("/select-organization", {
              state: { discoveredOrgs: [], email },
            })
          }
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
          Back
        </button>
      </form>
    </div>
  );
};

export default CreateOrganization;
