import IMAGES from "@/utils/images.js";
import React, { useState } from "react";
import { HeroSection, HouseRentForm } from "@/components";
import { useMediaQuery } from "react-responsive"; // For detecting mobile devices
import PropertyForm from "@/features/PropertyForm";

const PropertyFormPage = () => {
   return (
     <>
       <HeroSection tittle="Property Upload" />
       <div className="max-w-screen-xl max-w-[1200px] mx-auto px-4 py-12">
         <PropertyForm />
       </div>
     </>
   );
};

export default PropertyFormPage;
