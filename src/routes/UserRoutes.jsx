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
import { ProtectedRoute } from "../auth/ProtectedRoute";
import PropertyFormPage from "../Pages/UserFlow/PropertyFormPage";
import ElectronicsFormPage from "../Pages/UserFlow/ElectronicsFormPage";
import BikeFormPage from "../Pages/UserFlow/BikeFormPage";
import CarDetailPage from "../Pages/UserFlow/CarDetailPage";
const UserRoutes = () => {
  return (
    <>
      <Route element={<MasterLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/property" element={<PropertyFilterPage />} />
        <Route path="/properties/:slug" element={<ProductDetailPage />} />
        <Route path="/electronic/:slug" element={<LaptopDetailPage />} />
        <Route path="/car/:slug" element={<CarDetailPage />} />
        <Route path="/bike/:slug" element={<BikeDetailPage />} />
        <Route path="/electronics" element={<ElectronicsPage />} />
        <Route path="/car" element={<CarsPage />} />
        <Route path="/bike" element={<BikesPage />} />
        {/* Authendication Routes */}
      </Route>

      {/* Protected Routes - Authentication required (All logged-in users can access) */}
      <Route element={<FormLayout />}>
        {/* User Dashboard Routes */}

        {/* Selling/Upload Routes - Any authenticated user can sell */}
        <Route
          path="/sell"
          element={
            <ProtectedRoute requireAuth={true}>
              <ProductCategory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seller-profile/:vendorId"
          element={
            <ProtectedRoute requireAuth={true}>
              <SellerProfile />
            </ProtectedRoute>
          }
        />

        {/* Property Upload Routes */}

        <Route
          path="/property/:slug/:id"
          element={
            <ProtectedRoute requireAuth={true}>
              <PropertyFormPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/property/:slug/:id/edit"
          element={
            <ProtectedRoute requireAuth={true}>
              <PropertyFormPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/electronics/:slug/:id"
          element={
            <ProtectedRoute requireAuth={true}>
              <ElectronicsFormPage />
            </ProtectedRoute>
          }
        />
         <Route
          path="/electronics/:slug/:id"
          element={
            <ProtectedRoute requireAuth={true}>
              <ElectronicsFormPage />
            </ProtectedRoute>
          }
        />

         <Route
          path="/electronics/:slug/:id/edit"
          element={
            <ProtectedRoute requireAuth={true}>
              <ElectronicsFormPage />
            </ProtectedRoute>
          }
        />

         <Route
          path="/bike/:slug/:id"
          element={
            <ProtectedRoute requireAuth={true}>
              <BikeFormPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bike/:slug/:id/edit"
          element={
            <ProtectedRoute requireAuth={true}>
              <BikeFormPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/car/:slug/:id"
          element={
            <ProtectedRoute requireAuth={true}>
              <UploadCarFormPage />
            </ProtectedRoute>
          }
        />

         <Route
          path="/car/:slug/:id/edit"
          element={
            <ProtectedRoute requireAuth={true}>
              <UploadCarFormPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sale-house-apartment"
          element={
            <ProtectedRoute requireAuth={true}>
              <HouseSaleFormPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rent-house-apartment"
          element={
            <ProtectedRoute requireAuth={true}>
              <HouseRentFormPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lands-plots"
          element={
            <ProtectedRoute requireAuth={true}>
              <LandPlotFormPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rent-shop-office"
          element={
            <ProtectedRoute requireAuth={true}>
              <RentShopOfficeFormPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sale-shop-office"
          element={
            <ProtectedRoute requireAuth={true}>
              <SaleShopOfficeFormPage />
            </ProtectedRoute>
          }
        />

        {/* Electronics Upload Routes */}
        <Route
          path="/television"
          element={
            <ProtectedRoute requireAuth={true}>
              <UploadElectronicFormPage />
            </ProtectedRoute>
          }
        />

        {/* Vehicle Upload Routes */}
        <Route
          path="/upload-motercycle"
          element={
            <ProtectedRoute requireAuth={true}>
              <UploadMotercycleFormPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload-bicycle"
          element={
            <ProtectedRoute requireAuth={true}>
              <UploadBicycleFormPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload-car"
          element={
            <ProtectedRoute requireAuth={true}>
              <UploadCarFormPage />
            </ProtectedRoute>
          }
        />

        {/* Communication Routes */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute requireAuth={true}>
              <ChatInterface />
            </ProtectedRoute>
          }
        />

        <Route
          path="/subscription"
          element={
            <ProtectedRoute requireAuth={true}>
              <SubscriptionPlan />
            </ProtectedRoute>
          }
        />

        {/* Legacy Routes - Redirect to new unified dashboard */}
        {/* <Route
          path="/seller-enquiry-list"
          element={
            <ProtectedRoute requireAuth={true}>
              <UserEnquiries />
            </ProtectedRoute>
          }
        /> */}

        <Route
          path="/subscription"
          element={
            <ProtectedRoute requireAuth={true}>
              <SubscriptionPlan />
            </ProtectedRoute>
          }
        />
      </Route>
    </>
  );
};

export default UserRoutes;
