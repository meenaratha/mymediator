import React from "react";
import {
  HeroSection,
} from "@/components";
import { useMediaQuery } from "react-responsive";
import { RecommendedLaptops } from "../../components";
import ElectronicsDescription from "../../components/electronics/ElectronicsDescription";
const LaptopDetailPage = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  
  return (
    <>
      <HeroSection tittle="Laptop Details" />

      <div className="max-w-screen-xl max-w-[1200px] mx-auto px-4">
        <ElectronicsDescription />
        <RecommendedLaptops />
      </div>
    </>
  );
};

export default LaptopDetailPage;