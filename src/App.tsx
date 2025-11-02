// src/App.tsx
import React from "react";
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

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/request-password-reset"
            element={<RequestPasswordReset />}
          />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/select-organization" element={<SelectOrganization />} />
          <Route path="/create-organization" element={<CreateOrganization />} />
          <Route path="/authenticate" element={<Authenticate />} />
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
          <Route path="/" element={<Navigate to="/grants" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
