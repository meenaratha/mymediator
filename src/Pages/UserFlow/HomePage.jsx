import React, { useState } from "react";
import { BannerSlider, HeroSection, OTPVerificationModal } from "@/components";
import { useMediaQuery } from "react-responsive"; // For detecting mobile devices
import IMAGES from "@/utils/images.js";
import FilterIcon from "@mui/icons-material/FilterList";
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
      <HeroSection />
      <div className="max-w-screen-xl max-w-[1200px] mx-auto px-4">
        <BannerSlider images={images} />
        <OTPVerificationModal />
      </div>
    </>
  );
};

export default HomePage;
