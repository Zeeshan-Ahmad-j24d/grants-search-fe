import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiService } from "../services/api";
import "./grants.css";

const SavedGrantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<any | null>(null);
  const [resultsWithGrants, setResultsWithGrants] = useState<any[]>([]);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);

      try {
        const resp = await apiService.getSavedSearchById(id);
        const savedObj = resp?.data || resp || null;
        setSaved(savedObj);

        const results = savedObj?.expanded || [];

        setResultsWithGrants(results);
      } catch (err: any) {
        console.error("Failed to load saved search details", err);
        setError(err?.message || "Failed to load saved search details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading)
    return <div style={{ padding: 20 }}>Loading saved search...</div>;
  if (error)
    return (
      <div style={{ padding: 20 }}>
        <h3>Error</h3>
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={() => navigate(-1)} className="grant-search-clear">
          Back
        </button>
      </div>
    );

  return (
    <div className="grants-page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 className="grants-title">
          {saved?.name || "Saved Search Details"}
        </h1>
        <div>
          <button onClick={() => navigate(-1)} className="grant-search-clear">
            Back
          </button>
        </div>
      </div>

      {saved?.query && (
        <div style={{ marginTop: 8, marginBottom: 16, color: "#374151" }}>
          <strong>Query:</strong> {saved.query}
        </div>
      )}
      {saved?.user_name && (
        <div
          style={{
            marginTop: 8,
            marginBottom: 16,
            color: "#374151",
            textTransform: "capitalize",
          }}
        >
          <strong>Saved By:</strong> {saved.user_name}
        </div>
      )}

      <div className="saved-search-list">
        {resultsWithGrants.length === 0 && (
          <p>No results recorded for this saved search.</p>
        )}

        {resultsWithGrants.map((r, idx) => (
          <div key={r.grant?.id || r.grant?._id || idx} className="grant-card">
            <h3 className="grant-title">
              {r.grant?.call_title || r.grant?.summary || "Untitled grant"}
            </h3>
            <div className="grant-meta">
              {r.grant?.deadline_date && (
                <p>
                  <strong>Deadline:</strong> {r.grant.deadline_date}
                </p>
              )}
              {r.relevance !== undefined && r.relevance !== null && (
                <p className="search-score">
                  <strong>Relevance:</strong> {Math.round(r.relevance * 100)}%
                </p>
              )}
            </div>
            <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
              <button
                onClick={() =>
                  navigate(
                    `/grants/${
                      r.grant?.id || r.grant?._id || r.grant?._guid || ""
                    }`
                  )
                }
                className="grant-search-button"
              >
                View Grant
              </button>
              <button
                onClick={() =>
                  navigator.clipboard?.writeText(r.grant?.call_title || "")
                }
                className="grant-search-clear"
              >
                Copy Title
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedGrantDetails;
