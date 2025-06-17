// src/auth/ProtectedRoute.js
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center flex-col gap-[20px] justify-center min-h-screen bg-gray-50">
    <div className="animate-spin rounded-full h-28 w-28 border-b-2 border-blue-500"></div>
    <div className="ml-4 text-gray-600">Loading...</div>
  </div>
);

// Simple Protected Route Component - ONLY checks authentication
export const ProtectedRoute = ({
  children,
  requireAuth = true,
  fallbackPath = "/",
  fallbackComponent: FallbackComponent = null,
}) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner />;
  }

  // Check authentication only
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  return children;
};

// Public Route Component (redirects authenticated users to dashboard)
export const PublicRoute = ({ children, redirectTo = "/profile" }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

// Higher Order Component for simple route protection
export const withAuth = (Component, options = {}) => {
  return function AuthenticatedComponent(props) {
    const {
      requireAuth = true,
      fallbackComponent: FallbackComponent = null,
      loadingComponent: LoadingComponent = null,
    } = options;

    const { isAuthenticated, loading } = useAuth();

    if (loading) {
      return LoadingComponent ? <LoadingComponent /> : <LoadingSpinner />;
    }

    if (requireAuth && !isAuthenticated) {
      return FallbackComponent ? (
        <FallbackComponent />
      ) : (
        <Navigate to="/" />
      );
    }

    return <Component {...props} />;
  };
};

// Simple wrapper for conditional rendering based on auth
export const AuthWrapper = ({
  children,
  fallback = null,
  requireAuth = true,
}) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (requireAuth && !isAuthenticated) {
    return fallback;
  }

  if (!requireAuth && isAuthenticated) {
    return fallback;
  }

  return children;
};

// Login required page component
export const LoginRequiredPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
      <div className="mb-6">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
          <svg
            className="h-6 w-6 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-1a2 2 0 00-2-2H6a2 2 0 00-2 2v1a2 2 0 002 2zM12 7a4 4 0 100 8 4 4 0 000-8z"
            />
          </svg>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
      <p className="text-gray-600 mb-6">
        Please log in to access this feature. You can buy and sell items after
        logging in.
      </p>
      <div className="space-y-3">
        <button
          onClick={() => (window.location.href = "/")}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Login
        </button>
        <button
          onClick={() => (window.location.href = "/")}
          className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
        >
          Go to Home
        </button>
      </div>
    </div>
  </div>
);

// 404 Not Found component
export const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
      <div className="mb-6">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
          <svg
            className="h-6 w-6 text-yellow-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-6">
        The page you're looking for doesn't exist.
      </p>
      <div className="space-y-3">
        <button
          onClick={() => window.history.back()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Go Back
        </button>
        <button
          onClick={() => (window.location.href = "/")}
          className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
        >
          Go to Home
        </button>
      </div>
    </div>
  </div>
);
