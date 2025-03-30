import { Route } from "react-router-dom";
import { UserDashboardLayout, SellerEnquiryListPage } from "@/components";
const SellerRoutes = () => {
  return (
    <>
      <Route element={<UserDashboardLayout />}>
        <Route
          path="/seller-enquiry-list"
          element={<SellerEnquiryListPage />}
        />
      </Route>
    </>
  );
};

export default SellerRoutes;
