import IMAGES from "@/utils/images.js";
import React, { useState } from "react";
import { HeroSection, HouseRentForm } from "@/components";
import { useMediaQuery } from "react-responsive"; // For detecting mobile devices
import UploadBikeForm from "../../features/UploadBikeForm";
const BikeFormPage = () => {
  return (
    <>

    <HeroSection tittle="Bike Upload" />
               <div className="max-w-screen-xl max-w-[1200px] mx-auto px-4 py-12">
               
                    <UploadBikeForm/>
                    
               </div>

    </>
  )
}

export default BikeFormPage