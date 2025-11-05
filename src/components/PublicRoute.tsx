import React from "react";
import { Navigate } from "react-router-dom";
import { useStytchMemberSession } from "@stytch/react/b2b";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isInitialized } = useStytchMemberSession();

  if (!isInitialized) {
    // Wait for auth initialization to avoid flicker
    return <div>Loading...</div>;
  }

  // If already signed in, redirect to grants
  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
