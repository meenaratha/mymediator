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
  HouseSaleFormPage,
  HouseRentFormPage,
  FormLayout,
} from "@/components";
import BikeDetailPage from "../Pages/UserFlow/BikeDetailPage";
import SellerProfile from "../components/sell/sellerProfile";
import  LaptopDetailPage  from "../Pages/UserFlow/ElectronicsDetailsPage";
import ChatInterface from "../components/common/ChatInterFace";

const UserRoutes = () => {
  return (
    <>
      <Route element={<MasterLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/property" element={<PropertyFilterPage />} />
        <Route path="/property-details" element={<ProductDetailPage />} />
        <Route path="/electronics" element={<ElectronicsPage />} />
        <Route path="/car" element={<CarsPage />} />
        <Route path="/bike" element={<BikesPage />} />
        <Route path="/bike-details" element={<BikeDetailPage />} />
        <Route path="/electronics-details" element={<LaptopDetailPage />} />
        <Route path="/car-details" element={<BikeDetailPage />} />
        {/* Authendication Routes */}
      </Route>

      <Route element={<FormLayout />}>
        <Route path="/sell" element={<ProductCategory />} />
        <Route path="/seller-profile" element={<SellerProfile />} />

        <Route path="/sale-house-apartment" element={<HouseSaleFormPage />} />
        <Route path="/rent-house-apartment" element={<HouseRentFormPage />} />
        <Route path="/notification" element={<ChatInterface/>} />
      </Route>
    </>
  );
};

export default UserRoutes;
