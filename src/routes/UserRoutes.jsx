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
  SubscriptionPlan,
} from "@/components";
import BikeDetailPage from "../Pages/UserFlow/BikeDetailPage";
import SellerProfile from "../components/sell/sellerProfile";
import  LaptopDetailPage  from "../Pages/UserFlow/ElectronicsDetailsPage";
import ChatInterface from "../components/common/ChatInterFace";
import LandPlotFormPage from "../Pages/UserFlow/LandPlotFormPage";
import RentShopOfficeFormPage from "../Pages/UserFlow/RentShopOfficeFormPage";
import SaleShopOfficeFormPage from "../Pages/UserFlow/SaleShopOfficeFormPage";
import UploadElectronicFormPage from "../Pages/UserFlow/UploadElectronicFormPage";
import UploadMotercycleFormPage from "../Pages/UserFlow/UploadMotercycleFormPage";
import UploadBicycleFormPage from "../Pages/UserFlow/UploadBicycleFormPage";
import UploadCarFormPage from "../Pages/UploadCarFormPage";

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
        <Route path="/land-plot" element={<LandPlotFormPage />} />
        <Route path="/rent-shop-office" element={<RentShopOfficeFormPage />} />
        <Route path="/sale-shop-office" element={<SaleShopOfficeFormPage />} />

        {/* electronic form */}
        <Route path="/upload-electronics" element={<UploadElectronicFormPage />} />
        {/* cycle forms */}
        <Route path="/upload-motercycle" element={<UploadMotercycleFormPage />} />
        <Route path="/upload-bicycle" element={<UploadBicycleFormPage />} />
        {/* upload car form */}
        <Route path="/upload-car" element={<UploadCarFormPage />} />




        <Route path="/notification" element={<ChatInterface/>} />
        <Route path="/subscription" element={<SubscriptionPlan />} />
      </Route>
    </>
  );
};

export default UserRoutes;
