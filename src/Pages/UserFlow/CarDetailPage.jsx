import React from "react";
import { HeroSection } from "@/components";
import { useMediaQuery } from "react-responsive";
import { api } from "../../api/axios";
import CarDescription from "../../components/common/CarDescription";
import RecommendedCars from "../../components/common/RecommendedCars";
const CarDetailPage = () => {
      const isMobile = useMediaQuery({ maxWidth: 767 });
    
  return (
    <>
    <HeroSection tittle="Car Details" />

      <div className="max-w-screen-xl max-w-[1200px] mx-auto px-4">
        <CarDescription />
        <RecommendedCars />
      </div>
    
    </>
  )
}

export default CarDetailPage