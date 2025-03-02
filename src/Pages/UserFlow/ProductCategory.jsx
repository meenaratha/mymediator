import React, { useState } from "react";
import { HeroSection, Sell } from "@/components";
import { useMediaQuery } from "react-responsive"; // For detecting mobile devices
import IMAGES from "@/utils/images.js";

const ProductCategory = () => {
  return (
    <>
      <HeroSection tittle="Sell" />
      <div className="max-w-screen-xl max-w-[1200px] mx-auto px-4">
        <Sell />
      </div>
    </>
  );
};

export default ProductCategory;
