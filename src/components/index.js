// src/components/index.js

// routes
export { default as UserRoutes } from "@/routes/UserRoutes";
export { default as SellerRoutes } from "@/routes/SellerRoutes";

// layouts
export { default as MasterLayout } from "@/layouts/MasterLayout";
export { default as UserDashboardLayout } from "@/layouts/UserDashboardLayout";

// common layout components
export { default as Header } from "./common/Header";
export { default as Footer } from "./common/Footer";
export { default as AppFooter } from "./common/AppFooter";
export { default as PropertyFilter } from "./common/PropertyFilter";
export { default as PropertyListingGrid } from "@/components/common/PropertyListGrid"; // use @symbol to import from a relative path
export { default as BannerSlider } from "./common/BannerSlider";
export { default as HeroSection } from "./common/HeroSection";
export { default as PropertyDescription } from "@/components/property/PropertyDescription";
export { default as LoadMoreButton } from "@/components/common/LoadMoreButton";
export { default as FreashRecommendationProducts } from "@/components/common/FreashRecommendationProducts";

// models
export { default as Feedback } from "./common/Feedback";
export { default as OTPVerificationModal } from "@/components/common/OTPVerificationModal";

// forms
export { default as HouseRentForm } from "@/features/HouseRentForm";

// property
export { default as RecommendedProperty } from "./property/RecommendedProperty";
export { default as PropertyDetails } from "./property/PropertyDetails";
export { default as ProductCategory } from "@/Pages/UserFlow/ProductCategory";

// seller
export { default as SellerEnquiryList } from "@/components/sell/SellerEnquiryList";
export { default as SellerPropertyTabContent } from "@/components/sell/SellerPropertyTabContent";
export { default as SellerElectronicsTabContent } from "@/components/sell/SellerElectronicsTabContent";

// pages
export { default as HomePage } from "@/Pages/UserFlow/HomePage";
export { default as PropertyFilterPage } from "@/Pages/UserFlow/PropertyFilterPage";
export { default as ProductDetailPage } from "@/Pages/UserFlow/ProductDetailPage";
export { default as Sell } from "@/components/common/Sell";

// form pages
export { default as HousingApartmentFormPage } from "@/features/HouseRentForm";

// seller
export { default as SellerEnquiryListPage } from "@/Pages/SellerFlow/SellerEnquiryListPage";

// Add more exports as needed
