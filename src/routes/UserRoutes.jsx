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

      {/* Protected Routes - Authentication required (All logged-in users can access) */}
      <Route element={<FormLayout />}>
        {/* User Dashboard Routes */}
        {/* <Route
          path="/dashboard"
          element={
            <ProtectedRoute requireAuth={true}>
              <UserDashboard />
            </ProtectedRoute>
          }
        /> */}

        {/* <Route
          path="/my-enquiries"
          element={
            <ProtectedRoute requireAuth={true}>
              <UserEnquiries />
            </ProtectedRoute>
          }
        /> */}

        {/* <Route
          path="/my-listings"
          element={
            <ProtectedRoute requireAuth={true}>
              <UserListings />
            </ProtectedRoute>
          }
        /> */}

        {/* <Route
          path="/my-favorites"
          element={
            <ProtectedRoute requireAuth={true}>
              <UserFavorites />
            </ProtectedRoute>
          }
        /> */}

        {/* <Route
          path="/messages"
          element={
            <ProtectedRoute requireAuth={true}>
              <UserMessages />
            </ProtectedRoute>
          }
        /> */}

        {/* <Route
          path="/profile"
          element={
            <ProtectedRoute requireAuth={true}>
              <UserProfile />
            </ProtectedRoute>
          }
        /> */}

        {/* <Route
          path="/notifications"
          element={
            <ProtectedRoute requireAuth={true}>
              <UserNotifications />
            </ProtectedRoute>
          }
        /> */}

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
          path="/seller-profile"
          element={
            <ProtectedRoute requireAuth={true}>
              <SellerProfile />
            </ProtectedRoute>
          }
        />

        {/* Property Upload Routes */}
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
          path="/land-plot"
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
          path="/upload-electronics"
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
          path="/seller-subscription-history-plan"
          element={
            <ProtectedRoute requireAuth={true}>
              <SubscriptionPlan />
            </ProtectedRoute>
          }
        />

        {/* <Route
          path="/seller-post-details"
          element={
            <ProtectedRoute requireAuth={true}>
              <UserListings />
            </ProtectedRoute>
          }
        /> */}
      </Route>
    </>
  );
};

export default UserRoutes;
