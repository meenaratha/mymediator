import { Route } from "react-router-dom";
import {
  UserDashboardLayout,
  SellerEnquiryListPage,
  SubscriptionHistoryPlanPage,
  SellerPostDetailsPage,
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
      </Route>
    </>
  );
};

export default SellerRoutes;
