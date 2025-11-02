// src/components/GrantDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiService } from "../services/api";

const GrantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [grant, setGrant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      loadGrant(id);
    }
  }, [id]);

  const loadGrant = async (grantId: string) => {
    try {
      setLoading(true);
      const data = await apiService.getGrantById(grantId);
      setGrant(data);
    } catch (err: any) {
      setError(err.message || "Failed to load grant details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Loading grant details...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Error</h2>
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={() => navigate("/grants")}>Back to Grants</button>
      </div>
    );
  }

  if (!grant) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Grant not found</h2>
        <button onClick={() => navigate("/grants")}>Back to Grants</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <button
        onClick={() => navigate("/grants")}
        style={{ marginBottom: "20px" }}
      >
        ← Back to Grants
      </button>

      <h1>{grant.title || grant.summary}</h1>

      <div style={{ marginTop: "20px" }}>
        <h3>Details</h3>
        <div style={{ display: "grid", gap: "10px" }}>
          <p>
            <strong>ID:</strong> {grant.id}
          </p>
          <p>
            <strong>Status:</strong> {grant.status}
          </p>
          <p>
            <strong>Type:</strong> {grant.type}
          </p>
          {grant.framework_programme && (
            <p>
              <strong>Framework Programme:</strong> {grant.framework_programme}
            </p>
          )}
          {grant.deadline_date && (
            <p>
              <strong>Deadline:</strong> {grant.deadline_date}
            </p>
          )}
          {grant.call_title && (
            <p>
              <strong>Call Title:</strong> {grant.call_title}
            </p>
          )}
        </div>
      </div>

      {grant.summary && (
        <div style={{ marginTop: "20px" }}>
          <h3>Summary</h3>
          <p>{grant.summary}</p>
        </div>
      )}

      {grant.description && (
        <div style={{ marginTop: "20px" }}>
          <h3>Description</h3>
          <p>{grant.description}</p>
        </div>
      )}
    </div>
  );
};

export default GrantDetail;
