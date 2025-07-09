import React, { useState, useEffect } from "react";
import SellerBikeTabContent from "./SellerBikeTabContent"; // Import the bike component, { useState, useEffect } from "react";
import { api, apiForFiles } from "../../api/axios.js";
import IMAGES from "../../utils/images.js";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import {
  SellerPropertyTabContent,
  SellerElectronicsTabContent,
} from "@/components";
import SellerCarTabContent from "./SellerCarTabContent"; // Import the new component

const SellerEnquiryList = () => {
  // State to manage active tab (only visible when "Post enquiry" is active)
  const [activeTab, setActiveTab] = useState("property");
  
  // State to manage active enquiry type (property enquiry is default)
  const [activeEnquiryType, setActiveEnquiryType] = useState("property");
  
  // State to manage loading
  const [loading, setLoading] = useState(false);
  
  // State to manage enquiry data
  const [enquiryData, setEnquiryData] = useState([]);

  // Property types for filter buttons (only shown when "Post enquiry" is active)
  const [propertyTypes, setPropertyTypes] = useState([
    {
      id: "property",
      name: "PROPERTY",
      img: IMAGES.sellerproperty,
      selected: true,
    },
    {
      id: "electronic",
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

  // Function to fetch enquiry data from API
  const fetchEnquiryData = async (type = "property", formType = "property") => {
    setLoading(true);
    try {
      let endpoint;
      
      if (formType === "property") {
        // Property enquiry - call user API
        endpoint = `/enquiries/user?type=${type}`;
      } else {
        // Post enquiry - call vendor API
        endpoint = `/enquiries/vendor?type=${type}`;
      }

      const response = await api.get(endpoint);
      setEnquiryData(response.data?.data || response.data || []);
    } catch (error) {
      console.error('Error fetching enquiry data:', error);
      setEnquiryData([]);
      // Handle error (show notification, etc.)
    } finally {
      setLoading(false);
    }
  };

  // Function to handle tab click (works for both enquiry types)
  const handleTabClick = (tabId) => {
    // Update the active tab
    setActiveTab(tabId);

    // Update the selected state of property types
    const updatedPropertyTypes = propertyTypes.map((type) => ({
      ...type,
      selected: type.id === tabId,
    }));

    setPropertyTypes(updatedPropertyTypes);
    
    // Fetch data for the new tab based on current enquiry type
    fetchEnquiryData(tabId, activeEnquiryType);
  };

  // Function to handle enquiry type button click
  const handleEnquiryTypeClick = (type) => {
    setActiveEnquiryType(type);
    
    // Fetch data based on current active tab and new enquiry type
    fetchEnquiryData(activeTab, type);
  };

  // Initial data load - default to property enquiry
  useEffect(() => {
    fetchEnquiryData("property", "property");
  }, []);

  // Function to render the appropriate tab content
  const renderTabContent = () => {
    const props = {
      enquiryData,
      loading,
      activeEnquiryType,
      onRefresh: () => fetchEnquiryData(activeTab, activeEnquiryType)
    };

    // Show content based on selected tab for both enquiry types
    switch (activeTab) {
      case "property":
        return <SellerPropertyTabContent {...props} />;
      case "electronics":
        return <SellerElectronicsTabContent {...props} />;
      case "car":
        return <SellerCarTabContent {...props} />;
      case "bike":
        return <SellerBikeTabContent {...props} />;
      default:
        return <SellerPropertyTabContent {...props} />;
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

          {/* Action Buttons - Centered */}
          <div className="flex justify-center gap-4 mb-6 flex-wrap">
            <button 
              className={`py-2 px-4 rounded-md font-medium ${
                activeEnquiryType === "post"
                  ? "bg-[#0b1645] text-white"
                  : "bg-white text-gray-700 border border-gray-300"
              }`}
              onClick={() => handleEnquiryTypeClick("post")}
              disabled={loading}
            >
              {loading && activeEnquiryType === "post" ? "Loading..." : "Post enquiry"}
            </button>
            <button 
              className={`py-2 px-4 rounded-md font-medium ${
                activeEnquiryType === "property"
                  ? "bg-[#0b1645] text-white"
                  : "bg-white text-gray-700 border border-gray-300"
              }`}
              onClick={() => handleEnquiryTypeClick("property")}
              disabled={loading}
            >
              {loading && activeEnquiryType === "property" ? "Loading..." : "Property enquiry"}
            </button>
          </div>

          {/* Property Type Filter - Shown for both Post enquiry and Property enquiry */}
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