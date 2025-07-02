import React from "react";
import {
  LaptopDescription,
  HeroSection,
} from "@/components";
import { useMediaQuery } from "react-responsive";
import { RecommendedLaptops } from "../../components";
const LaptopDetailPage = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  
  return (
    <>
      <HeroSection tittle="Laptop Details" />

      <div className="max-w-screen-xl max-w-[1200px] mx-auto px-4">
        <LaptopDescription />
        <RecommendedLaptops />
      </div>
    </>
  );
};

export default LaptopDetailPage;