import React, { useEffect, useState } from "react";
import { apiService } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useStytchMemberSession } from "@stytch/react/b2b";
import "./grants.css";

const SavedGrants = () => {
  const [saved, setSaved] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isInitialized, session } = useStytchMemberSession();

  useEffect(() => {
    const fetchSaved = async () => {
      setLoading(true);
      setError(null);

      try {
        let orgId = null;
        if (isInitialized && session) {
          orgId = session.organization_id;
        }

        if (!orgId) throw new Error("Organization ID not found");

        const resp = await apiService.getSavedSearches(orgId);
        const list = resp?.searches || resp || [];
        setSaved(Array.isArray(list) ? list : []);
      } catch (err: any) {
        console.error("Failed to load saved searches", err);
        setError(err?.message || "Failed to load saved searches");
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, [isInitialized, session]);

  const navigateToSearchResults = (searchId: string) => {
    //  it should navigate to the saved-grants/:id page and there it should display the results of the saved search
    navigate(`/saved-grants/${searchId}`);
  };

  if (loading)
    return <div style={{ padding: 20 }}>Loading saved searches...</div>;
  if (error)
    return (
      <div style={{ padding: 20 }}>
        <h3>Error</h3>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );

  return (
    <div className="grants-page">
      <h1 className="grants-title mb-2">Saved Searches</h1>

      {saved.length === 0 ? (
        <p>No saved searches found for your organization.</p>
      ) : (
        <div className="saved-search-list">
          {saved.map((s: any) => (
            <div
              key={s.id || s._id || s.name || Math.random()}
              className="grant-card"
            >
              <div className="grant-card-header">
                <h3 style={{ margin: 0, textTransform: "capitalize" }}>
                  {s.name || s.query}
                </h3>
                <p>
                  Saved By: <b>{s.user_name}</b>
                </p>
              </div>
              <p>
                user: <b>{s.user_name}</b> saved the searched results for "
                {s.query}" against this same organization:{" "}
                <b>{s.organization_name}</b>
              </p>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button
                  onClick={() => navigateToSearchResults(s.id)}
                  className="grant-search-button"
                >
                  View Search Results
                </button>
                <button
                  onClick={() => navigator.clipboard?.writeText(s.query || "")}
                  className="grant-search-clear"
                >
                  Copy Search Query
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedGrants;
