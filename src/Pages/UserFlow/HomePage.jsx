import React, { useState } from "react";
import {
  Header,
  Footer,
  PropertyFilter,
  PropertyListingGrid,
  BannerSlider,
  HeroSection,
  PropertyDescription,
} from "@/components";

import FilterIcon from "@mui/icons-material/FilterList";
import { useMediaQuery } from "react-responsive"; // For detecting mobile devices
const HomePage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // Detect mobile devices
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <>
      <Header />
      <HeroSection />

      <div className="max-w-screen-xl max-w-[1200px] mx-auto px-4">
        <PropertyDescription />
        <BannerSlider />

        {/* space div */}
        <div className="h-[10px]"></div>
        <h1 className="text-left text-black text-[24px] font-semibold">
          Property sale & Rent in Chennai
        </h1>
        {/* Main content area with filter and listings */}
        <div className="flex flex-col md:flex-row my-6">
          {/* Filter button for mobile view */}
          <div className="md:hidden mb-4">
            <button
              onClick={toggleFilter}
              className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center"
            >
              <FilterIcon />
              {isFilterOpen ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {/* Property filter - 30% on desktop, full width but hidden by default on mobile */}
          <div
            className={`fixed md:static inset-0 w-full md:w-3/12 ${
              isMobile
                ? "transform transition-transform duration-300 ease-in-out z-40 top-[17%]  my-[10px] bottom-[5px]"
                : ""
            } ${
              isFilterOpen
                ? "translate-x-0"
                : "-translate-x-full md:translate-x-0"
            }`}
          >
            {/* Close button for mobile */}
            {isMobile && (
              <button
                onClick={toggleFilter}
                className="fixed top-1 right-4 p-2 bg-red-600 text-white rounded-full z-50 w-[35px] h-[35px] flex items-center justify-center text-2xl"
              >
                &times; {/* Close icon (X) */}
              </button>
            )}

            <PropertyFilter isFilterOpen={isFilterOpen} isMobile={isMobile} />
          </div>

          {/* Overlay background - only on mobile when filter is open */}
          {isMobile && isFilterOpen && (
            <div
              className="fixed inset-0 bg-[#000000c2] bg-opacity-70 z-30"
              onClick={toggleFilter}
            />
          )}

          {/* Property listings - 70% on desktop, full width on mobile */}
          <div className="w-full md:w-9/12">
            <PropertyListingGrid />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default HomePage;
