import React, { useState } from "react";
import {
  BannerSlider,
  LoadMoreButton,
  FreashRecommendationProducts,
  LoginFormModel,
  SignupFormModel,
} from "@/components";
import { useMediaQuery } from "react-responsive"; // For detecting mobile devices
import IMAGES from "@/utils/images.js";
const HomePage = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const images = [
    IMAGES.propertybanner1,
    IMAGES.propertybanner2,
    IMAGES.propertybanner3,
    IMAGES.propertybanner1,
  ];

  return (
    <>
      <div className="max-w-screen-xl max-w-[1200px] mx-auto px-4">
        <BannerSlider images={images} />
        {/* space div */}
        <div className="h-[10px]"></div>
        <h1 className="text-left text-black text-[24px] font-semibold px-3 py-2">
          Fresh recommendations
        </h1>
        <FreashRecommendationProducts />
        <LoadMoreButton />
      </div>
    </>
  );
};

export default HomePage;
