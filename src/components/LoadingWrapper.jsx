// src/components/LoadingWrapper.js (Optional)
import React from "react";
import { useAuth } from "../auth/AuthContext";
import AppRoutes from "../routes/AppRoutes";

// Loading page component
const LoadingPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading your dashboard...</p>
    </div>
  </div>
);

const LoadingWrapper = () => {
  const { loading } = useAuth();

  // Show loading page while auth is initializing
  if (loading) {
    return <LoadingPage />;
  }

  return <AppRoutes />;
};

export default LoadingWrapper;
