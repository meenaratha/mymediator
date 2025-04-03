import { Route } from "react-router-dom";
import {
  HomePage,
  MasterLayout,
  PropertyFilterPage,
  ProductDetailPage,
  ProductCategory,
  ElectronicsPage,
  ElectronicsFilterPage,
  CarsPage,
  CarsFilterPage,
  BikesPage,
  BikesFilterPage,
} from "@/components";
import BikeDetailPage from "../Pages/UserFlow/BikeDetailPage";

const UserRoutes = () => {
  return (
    <>
      <Route element={<MasterLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/property" element={<PropertyFilterPage />} />
        <Route path="/property-details" element={<ProductDetailPage />} />
        <Route path="/sell" element={<ProductCategory />} />

        <Route path="/electronics" element={<ElectronicsPage />} />
        <Route path="/car" element={<CarsPage />} />
        <Route path="/bike" element={<BikesPage />} />
        <Route path="/bike-details" element={<BikeDetailPage />} />
        {/* Authendication Routes */}
      </Route>
    </>
  );
};

export default UserRoutes;
