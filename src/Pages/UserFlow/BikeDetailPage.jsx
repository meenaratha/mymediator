import React from "react";
import { HeroSection } from "@/components";
import { useMediaQuery } from "react-responsive";
import BikeDescription from "../../components/common/BikeDescription";
import BikeDetails from "../../components/common/BikeDetails";
import RecommendedBikes from "../../components/common/RecommendedBikes";
import { api } from "../../api/axios";


const BikeDetailPage = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  return (
    <>
      <HeroSection tittle="Bike Details" />

      <div className="max-w-screen-xl max-w-[1200px] mx-auto px-4">
        <BikeDescription />
        <RecommendedBikes />
      </div>
    </>
  );
};

export default BikeDetailPage;
