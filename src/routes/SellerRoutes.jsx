import { Route } from "react-router-dom";
import {
  UserDashboardLayout,
  SellerEnquiryListPage,
  SubscriptionHistoryPlanPage,
  SellerPostDetailsPage,
  TermsAndCondition,
  PrivacyPolicy,
  AccountDeleteModel,
} from "@/components";

const SellerRoutes = () => {
  return (
    <>
      <Route element={<UserDashboardLayout />}>
        <Route
          path="/seller-enquiry-list"
          element={<SellerEnquiryListPage />}
        />
        <Route
          path="/seller-subscription-history-plan"
          element={<SubscriptionHistoryPlanPage />}
        />
        <Route
          path="/seller-post-details"
          element={<SellerPostDetailsPage />}
        />
        <Route
          path="/terms-and-conditions"
          element={<TermsAndCondition />}
        />
        <Route
          path="/privacy-policy"
          element={<PrivacyPolicy />}
        />
        <Route path="/delete-account" element={<AccountDeleteModel />} />    
      </Route>
    </>
  );
};

export default SellerRoutes;
