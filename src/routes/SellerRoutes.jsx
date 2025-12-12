import { Route } from "react-router-dom";
import { ProtectedRoute } from "../auth/ProtectedRoute";

// Legacy components that redirect to unified dashboard
import SubscriptionPlan from "../components/common/SubscriptionPlan";
import TermsAndCondition from "../components/sell/TermsAndCondition";
import PrivacyPolicy from "../components/sell/PrivacyPolicy";
import AccountDeleteModel from "../components/sell/AccountDeleteModel";
import { FormLayout, SellerEnquiryList, SellerEnquiryListPage, SellerPostDetailsPage, SubscriptionHistoryPlanPage, UserDashboardLayout } from "../components";
import WishlistPage from "../Pages/wishlist/WishlistPage";
import ProfileEditScreen from "../Pages/SellerFlow/ProfileEditScreen";
import ChangePasswordForm from "../components/common/ChangePasswordForm";

// Simple message component for deprecated routes
const DeprecatedRouteMessage = ({ redirectTo, message }) => (
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
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Route Updated</h2>
      <p className="text-gray-600 mb-6">
        {message || "This route has been moved to your unified dashboard."}
      </p>
      <div className="space-y-3">
        <button
          onClick={() => (window.location.href = redirectTo)}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Go to Dashboard
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

// NOTE: These routes are now deprecated since all users can access everything
// They are kept for backward compatibility and redirect to unified dashboard
const SellerRoutes = () => {
  return (
    <>
      <Route element={<UserDashboardLayout />}>
        {/* Deprecated Seller Routes - Redirect to unified dashboard */}

         <Route
          path="/profile-edit"
          element={
            <ProtectedRoute requireAuth={true}>
              <ProfileEditScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller-enquiry-list"
          element={
            <ProtectedRoute requireAuth={true}>
              <SellerEnquiryListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seller-subscription-history-plan"
          element={
            <ProtectedRoute requireAuth={true}>
              <SubscriptionHistoryPlanPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seller-post-details"
          element={
            <ProtectedRoute requireAuth={true}>
              <SellerPostDetailsPage />
            </ProtectedRoute>
          }
        />

         <Route
          path="/wishlist"
          element={
            <ProtectedRoute requireAuth={true}>
              <WishlistPage />
            </ProtectedRoute>
          }
        />

         <Route
          path="/change-password"
          element={
            <ProtectedRoute requireAuth={true}>
              <ChangePasswordForm />
            </ProtectedRoute>
          }
        />

        {/* Legal pages - accessible to all authenticated users */}
        <Route
          path="/terms-and-conditions"
          element={
            <ProtectedRoute requireAuth={true}>
              <TermsAndCondition />
            </ProtectedRoute>
          }
        />

        <Route
          path="/privacy-policy"
          element={
            <ProtectedRoute requireAuth={true}>
              <PrivacyPolicy />
            </ProtectedRoute>
          }
        />

        <Route
          path="/delete-account"
          element={
            <ProtectedRoute requireAuth={true}>
              <AccountDeleteModel />
            </ProtectedRoute>
          }
        />
      </Route>
    </>
  );
};

export default SellerRoutes;
