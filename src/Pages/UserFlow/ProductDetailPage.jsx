import React, { useState } from "react";
import {
  PropertyDescription,
  HeroSection,
  RecommendedProperty,
  PropertyDetails,
} from "@/components";
import { useMediaQuery } from "react-responsive"; // For detecting mobile devices
import IMAGES from "@/utils/images.js";

const ProductDetailPage = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  return (
    <>
      <HeroSection tittle="Property Details" />
      <div className="max-w-screen-xl max-w-[1200px] mx-auto px-4">
        <PropertyDescription />
        <RecommendedProperty />
      </div>
    </>
  );
};

export default ProductDetailPage;
