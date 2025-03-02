import { Route } from "react-router-dom";
import { HomePage, MasterLayout, PropertyFilterPage } from "@/components";
const UserRoutes = () => {
  return (
    <>
      <Route element={<MasterLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/property-filter" element={<PropertyFilterPage />} />
      </Route>
    </>
  );
};

export default UserRoutes;
