// src/components/index.js
export { default as Header } from "./common/Header";
export { default as Footer } from "./common/Footer";
export { default as PropertyFilter } from "./common/PropertyFilter";
export { default as PropertyListingGrid } from "@/components/common/PropertyListGrid"; // use @symbol to import from a relative path
export { default as Feedback } from "./common/Feedback";
export { default as BannerSlider } from "./common/BannerSlider";
export { default as HeroSection } from "./common/HeroSection";
export { default as HouseRentForm } from "@/features/HouseRentForm";
export { default as PropertyDescription } from "@/components/property/PropertyDescription";
export { default as HomePage } from "@/Pages/UserFlow/HomePage";
export { default as LoadMoreButton } from "@/components/common/LoadMoreButton";
export { default as MasterLayout } from "@/layouts/MasterLayout";
export { default as PropertyFilterPage } from "@/Pages/UserFlow/PropertyFilterPage";
export { default as OTPVerificationModal } from "@/components/common/OTPVerificationModal";
export { default as FreashRecommendationProducts } from "@/components/common/FreashRecommendationProducts";

// property
export { default as ProductDetailPage } from "@/Pages/UserFlow/ProductDetailPage";
export { default as RecommendedProperty } from "./property/RecommendedProperty";
export { default as PropertyDetails } from "./property/PropertyDetails";
export { default as ProductCategory } from "@/Pages/UserFlow/ProductCategory";
export { default as Sell } from "@/components/common/Sell";

// Add more exports as needed
