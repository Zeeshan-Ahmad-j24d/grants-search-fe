// src/components/GrantDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiService } from "../services/api";
import { status_mapping, type_mapping } from "../globals";
import "./grants.css";

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
      <div className="grant-detail-page">
        <h2>Loading grant details...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grant-detail-page">
        <h2>Error</h2>
        <p style={{ color: "red" }}>{error}</p>
        <button className="back-button" onClick={() => navigate("/grants")}>
          Back to Grants
        </button>
      </div>
    );
  }

  if (!grant) {
    return (
      <div className="grant-detail-page">
        <h2>Grant not found</h2>
        <button className="back-button" onClick={() => navigate("/grants")}>
          Back to Grants
        </button>
      </div>
    );
  }

  return (
    <div className="grant-detail-page">
      <button className="back-button mb-2" onClick={() => navigate("/grants")}>
        ← Back to Grants
      </button>

      <div className="grant-detail">
        <h1>{grant.title || grant.summary}</h1>

        <div className="grant-section">
          <h3>Details</h3>
          <div className="detail-grid">
            <p>
              <strong>ID:</strong> {grant.id}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {grant?.status_code
                ? status_mapping[String(grant.status_code)] ??
                  String(grant.status_code)
                : "N/A"}
            </p>
            <p>
              <strong>Type:</strong>{" "}
              {grant.type_code
                ? type_mapping[String(grant.type_code)] ??
                  String(grant.type_code)
                : "N/A"}
            </p>
            {grant.framework_programme && (
              <p>
                <strong>Framework Programme:</strong>{" "}
                {grant.framework_programme}
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
          <div className="grant-section">
            <h3>Summary</h3>
            <p>{grant.summary}</p>
          </div>
        )}

        {grant.description && (
          <div className="grant-section">
            <h3>Description</h3>
            <p>{grant.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GrantDetail;
