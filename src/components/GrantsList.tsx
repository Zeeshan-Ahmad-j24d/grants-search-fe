// src/components/GrantsList.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStytchB2BClient, useStytchMember } from "@stytch/react/b2b";
import { apiService } from "../services/api";
import { config } from "../config";

const GrantsList = () => {
  const navigate = useNavigate();
  const stytchClient = useStytchB2BClient();
  const { member } = useStytchMember();
  const [grants, setGrants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadGrants();
  }, []);

  const loadGrants = async () => {
    try {
      setLoading(true);
      const data = await apiService.getGrants({ limit: 20 });
      setGrants(data.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load grants");
    } finally {
      setLoading(false);
    }
  };

  const debugCookies = async () => {
    const response = await fetch(`${config.apiBaseUrl}/debug-cookies`, {
      credentials: "include",
    });
    const data = await response.json();
    console.log("Debug cookies:", data);
  };

  const handleLogout = async () => {
    try {
      await stytchClient.session.revoke();
      navigate("/login");
    } catch (err: any) {
      console.error("Logout failed:", err);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Loading grants...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Error</h2>
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={loadGrants}>Retry</button>
        <button onClick={debugCookies}>Debug Cookies</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>EU Grants</h1>
        <div>
          <span style={{ marginRight: "15px" }}>
            Welcome, {member?.email_address}
          </span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {grants.length === 0 ? (
        <p>No grants found.</p>
      ) : (
        <div style={{ display: "grid", gap: "15px" }}>
          {grants.map((grant) => (
            <div
              key={grant.id}
              onClick={() => navigate(`/grants/${grant.id}`)}
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <h3>{grant.title || grant.summary}</h3>
              <p>
                <strong>Status:</strong> {grant.status}
              </p>
              <p>
                <strong>Type:</strong> {grant.type}
              </p>
              {grant.deadline_date && (
                <p>
                  <strong>Deadline:</strong> {grant.deadline_date}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GrantsList;
