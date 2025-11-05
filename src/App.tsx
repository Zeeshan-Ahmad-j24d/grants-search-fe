// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Authenticate from "./components/Authenticate";
import GrantsList from "./components/GrantsList";
import GrantDetail from "./components/GrantDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import SelectOrganization from "./components/SelectOrganization";
import RequestPasswordReset from "./components/RequestPasswordReset";
import ResetPassword from "./components/ResetPassword";
import CreateOrganization from "./components/CreateOrganization";
import PublicRoute from "./components/PublicRoute";
import Dashboard from "./components/Dashboard";
import SavedGrants from "./components/SavedGrants";
import SavedGrantDetails from "./components/SavedGrantDetails";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/request-password-reset"
            element={
              <PublicRoute>
                <RequestPasswordReset />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />
          <Route path="/select-organization" element={<SelectOrganization />} />
          <Route
            path="/create-organization"
            element={
              <PublicRoute>
                <CreateOrganization />
              </PublicRoute>
            }
          />
          <Route path="/authenticate" element={<Authenticate />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/grants"
            element={
              <ProtectedRoute>
                <GrantsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/grants/:id"
            element={
              <ProtectedRoute>
                <GrantDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved-grants"
            element={
              <ProtectedRoute>
                <SavedGrants />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved-grants/:id"
            element={
              <ProtectedRoute>
                <SavedGrantDetails />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
