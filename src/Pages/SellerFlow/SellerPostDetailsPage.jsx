// import { PostDetails } from "@/components";
import React, { useState } from "react";
import IMAGES from "../../utils/images.js";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import CarPostDetails from "../../components/sell/CarPostDetails.jsx";
import BikePostDetails from "../../components/sell/BikePostDetails.jsx";
import ElectronicsPostDetails from "../../components/sell/ElectronicsPostDetails.jsx";
import PropertyPostDetails from "../../components/sell/PostDetails.jsx";

const SellerPostDetailsPage = () => {
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
        return <PropertyPostDetails />;
      case "electronics":
        return <ElectronicsPostDetails />;
      case "car":
        // Add your car tab content component here
        return <CarPostDetails />;
      case "bike":
        // Add your bike tab content component here
        return <BikePostDetails />;
      default:
        return <div > No post</div>;
    }
  };

  return (
    <>
      <div className=" min-h-screen pb-6 w-full">
        <div className="max-w-[100%] ">
          {/* Page Title */}
          <h1 className="text-2xl font-bold text-center text-[#0b1645] mb-6 pt-4">
            My Post Details
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

export default SellerPostDetailsPage;
