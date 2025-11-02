import React from "react";
import { Navigate } from "react-router-dom";
import { useStytchMemberSession } from "@stytch/react/b2b";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isInitialized } = useStytchMemberSession();

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
