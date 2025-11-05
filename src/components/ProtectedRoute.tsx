// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import {
  useStytchMemberSession,
  useStytchB2BClient,
  useStytchIsAuthorized,
} from "@stytch/react/b2b";
import "./grants.css";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isInitialized } = useStytchMemberSession();
  const stytchClient = useStytchB2BClient();
  const { isAuthorized: canViewGrants } = useStytchIsAuthorized(
    "grants",
    "read"
  );
  const navigate = useNavigate();
  const location = useLocation();

  console.log("is authorized", canViewGrants);
  console.log("member info", stytchClient.self.getInfo());

  const handleLogout = async () => {
    try {
      await stytchClient.session.revoke();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      navigate("/login");
    }
  };

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Prevent direct access to sections the user is not authorized for.
  // If the user navigates to a grants-related URL but isn't authorized, redirect to dashboard.
  if (location.pathname.startsWith("/grants") && !canViewGrants) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="app-layout">
      <nav className="app-nav">
        <div className="nav-left">
          <div className="nav-brand" onClick={() => navigate("/dashboard")}>
            Grants Portal
          </div>
          <div className="nav-links">
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
            {canViewGrants && (
              <Link to="/grants" className="nav-link">
                Grants
              </Link>
            )}
            {canViewGrants && (
              <Link to="/saved-grants" className="nav-link">
                Saved Grants
              </Link>
            )}

            {/* <Link to="/create-organization" className="nav-link">
              Create Org
            </Link> */}
          </div>
        </div>

        <div className="nav-actions">
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <main className="main-container">{children}</main>
    </div>
  );
};

export default ProtectedRoute;
