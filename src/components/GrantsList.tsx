// src/components/GrantsList.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../services/api";
import "./grants.css";
import { status_mapping, type_mapping } from "../globals";
import { useStytchMemberSession } from "@stytch/react/b2b";

interface SearchResult {
  grantId: string;
  score: number;
  grant: any; // TODO: Add proper grant type
}

const GrantsList = () => {
  const navigate = useNavigate();
  const [grants, setGrants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [inputQuery, setInputQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const { isInitialized, session } = useStytchMemberSession();

  const loadGrants = async (query?: string) => {
    try {
      setLoading(true);
      setError("");

      if (query && query.trim().length > 0) {
        const resp = await apiService.semanticSearch(query.trim(), 10);
        const searchResults = (resp?.results || []) as SearchResult[];
        // Map search results to include score in grant object
        const grantsWithScores = searchResults.map((result) => ({
          ...result.grant,
          searchScore: result.score,
        }));
        setGrants(grantsWithScores);
      } else {
        const data = await apiService.getGrants({ limit: 20 });
        const results = data?.data || data || [];
        setGrants(Array.isArray(results) ? results : []);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load grants");
    } finally {
      setLoading(false);
    }
  };

  // Load initial grants
  useEffect(() => {
    // If a saved search was applied from SavedGrants page, read it and run that search
    const savedQuery = localStorage.getItem("saved_search_query");
    if (savedQuery) {
      setInputQuery(savedQuery);
      setSearchQuery(savedQuery);
      loadGrants(savedQuery);
      localStorage.removeItem("saved_search_query");
      return;
    }

    loadGrants();
  }, []);

  const handleSearch = () => {
    setSearchQuery(inputQuery);
    loadGrants(inputQuery);
  };

  const clearSearch = () => {
    setInputQuery("");
    setSearchQuery("");
    loadGrants();
  };

  const handleSaveSearch = async () => {
    if (!searchQuery || grants.length === 0) return;

    setSaving(true);
    setSaveMessage(null);

    try {
      const results = grants.map((g: any) => ({
        grantId: g.id || g.grant_id || g._id,
        relevance: g.searchScore ?? null,
      }));

      const payload: any = { query: searchQuery, results };
      await apiService.saveSearch(payload);
      setSaveMessage("Saved search successfully.");
      navigate("/saved-grants");
    } catch (err: any) {
      console.error("Save search failed", err);
      setSaveMessage(err?.message || "Failed to save search");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(null), 4000);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>{searchQuery ? "Searching grants..." : "Loading grants..."}</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Error</h2>
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={() => loadGrants()}>Retry</button>
        {/* <button onClick={debugCookies}>Debug Cookies</button> */}
      </div>
    );
  }

  return (
    <div className="grants-page">
      <div className="grants-header">
        <h1 className="grants-title">EU Grants</h1>
        <div className="user-actions">
          {/* Show Save Search button only when there is a search performed and results present */}
          {searchQuery && grants.length > 0 && (
            <>
              <button
                className="save-search-button"
                onClick={handleSaveSearch}
                disabled={saving}
                aria-label="Save this search"
                title="Save this search"
              >
                {saving ? "Saving..." : "Save search"}
              </button>
              {saveMessage && (
                <div className="save-search-msg" role="status">
                  {saveMessage}
                </div>
              )}
            </>
          )}
        </div>
        <div className="grants-search">
          <input
            type="text"
            placeholder="Search grants by title or description..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="grant-search-input"
            aria-label="Search grants"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <button
            onClick={handleSearch}
            className="grant-search-button"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
          {searchQuery && (
            <button onClick={clearSearch} className="grant-search-clear">
              Clear
            </button>
          )}
        </div>
      </div>

      {grants.length === 0 ? (
        <p>No grants found.</p>
      ) : (
        <div className="grants-grid">
          {grants.map((grant: any) => (
            <div
              key={grant.id}
              onClick={() => navigate(`/grants/${grant.id}`)}
              className="grant-card"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") navigate(`/grants/${grant.id}`);
              }}
            >
              <h3 className="grant-title">{grant.title || grant.summary}</h3>
              <div className="grant-meta">
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
                {grant.deadline_date && (
                  <p>
                    <strong>Deadline:</strong> {grant.deadline_date}
                  </p>
                )}
                {grant.searchScore !== undefined && (
                  <p className="search-score">
                    <strong>Relevance:</strong>{" "}
                    {Math.round(grant.searchScore * 100)}%
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GrantsList;
