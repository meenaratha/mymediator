import React, { useState } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FilterListIcon from "@mui/icons-material/FilterList";
import HomeIcon from "@mui/icons-material/Home";
import DevicesIcon from "@mui/icons-material/Devices";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import DeleteIcon from "@mui/icons-material/Delete";
import IMAGES from "../../utils/images.js";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import {
  SellerPropertyTabContent,
  SellerElectronicsTabContent,
} from "@/components";

const SellerEnquiryList = () => {
  // State to manage active tab
  const [activeTab, setActiveTab] = useState("property");

  // Property types for filter buttons
  const [propertyTypes, setPropertyTypes] = useState([
    {
      id: "property",
      name: "PROPERTY",
      img: IMAGES.sellerproperty,
      selected: true,
    },
    {
      id: "electronics",
      name: "ELECTRONICS",
      img: IMAGES.electronicscategory,
      selected: false,
    },
    {
      id: "car",
      name: "CAR",
      img: IMAGES.carcategory,
      selected: false,
    },
    {
      id: "bike",
      name: "BIKE",
      img: IMAGES.sellerbike,
      selected: false,
    },
  ]);

  // Function to handle tab click
  const handleTabClick = (tabId) => {
    // Update the active tab
    setActiveTab(tabId);

    // Update the selected state of property types
    const updatedPropertyTypes = propertyTypes.map((type) => ({
      ...type,
      selected: type.id === tabId,
    }));

    setPropertyTypes(updatedPropertyTypes);
  };

  // Function to render the appropriate tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "property":
        return <SellerPropertyTabContent />;
      case "electronics":
        return <SellerElectronicsTabContent />;
      case "car":
        // Add your car tab content component here
        return <div>Car Tab Content</div>;
      case "bike":
        // Add your bike tab content component here
        return <div>Bike Tab Content</div>;
      default:
        return <SellerPropertyTabContent />;
    }
  };

  return (
    <>
      <div className=" min-h-screen pb-6 w-full">
        <div className="max-w-[100%] ">
          {/* Page Title */}
          <h1 className="text-2xl font-bold text-center text-[#0b1645] mb-6 pt-4">
            Enquiry list
          </h1>

          {/* Property Type Filter */}
          <div className="border-b border-[#EAEAEA] mb-10">
            <div className="mx-auto max-w-[800px] pb-6 ">
              <Swiper
                slidesPerView={2}
                spaceBetween={10}
                breakpoints={{
                  640: {
                    slidesPerView: 4,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 5,
                    spaceBetween: 30,
                  },
                }}
              >
                {propertyTypes.map((type) => (
                  <SwiperSlide key={type.id}>
                    <div
                      className={`mymediator-seller-tab-item  flex flex-col items-center p-3  border-gray-100  cursor-pointer${
                        type.selected
                          ? " shadow-md  rounded-md bg-white border-1 border-gray-200"
                          : ""
                      }`}
                      onClick={() => handleTabClick(type.id)}
                    >
                      <div
                        className={` p-1  mb-2 w-16 h-16 flex items-center justify-center 
              ${type.selected ? "" : ""}`}
                      >
                        <img src={type.img} alt="img" />
                      </div>
                      <span className="text-xs font-semibold">{type.name}</span>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* Render the active tab content */}
          {renderTabContent()}
        </div>
      </div>
    </>
  );
};

export default SellerEnquiryList;
