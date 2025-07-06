import IMAGES from "@/utils/images.js";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import EnquiryForm from "../../features/EnquiryForm";
import { useNavigate, useParams } from 'react-router-dom';
import VendorPropertyPost from "../vendor/VendorPropertyPost";
import VendorElectronicPost from "../vendor/VendorElectronicPost";
import VendorCarPost from "../vendor/VendorCarPost";
import VendorBike from "../vendor/VendorBike";
import { api, apiForFiles } from "../../api/axios";
const SellerProfile = () => {
  const navigate = useNavigate();
  const { vendorId } = useParams();
  const [showEnquryForm, setShowEnquiryForm] = useState(false);

const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  useEffect(() => {
    let isMounted = true;

    const fetchVendorProfile = async () => {
      try {
        const response = await api.get(`/vendor/profile/${vendorId}`);
        console.log("📡 profile", response.data);

        if (isMounted) {
          if (response.data && response.data.id) {
            setVendorData(response.data);
            setError(null);
          } else {
            setError("Vendor not found");
          }
        }
      } catch (error) {
        console.error("Error fetching vendor profile:", error);
        if (isMounted) {
          if (error.response?.status === 404) {
            setError("Vendor not found");
          } else {
            setError("Failed to load vendor profile");
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (vendorId) {
      console.log("Loading vendor profile for ID:", vendorId);
      fetchVendorProfile();
    } else {
      setError("No vendor ID provided");
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [vendorId]);

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
        return <VendorPropertyPost />;
      case "electronics":
        return <VendorElectronicPost />;
      case "car":
        // Add your car tab content component here
        return <VendorCarPost />;
      case "bike":
        // Add your bike tab content component here
        return <VendorBike />;
      default:
        return <PostDetails />;
    }
  };

    const handleCall = () => {
    if (vendorData?.phone) {
      window.location.href = `tel:${vendorData.phone}`;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }



  return (
<>
{
  showEnquryForm && ( 
    <EnquiryForm  onClose={() => setShowEnquiryForm(false)}  vendorData={vendorData}/>
  )
    
}
<div className="max-w-[1200px] w-[100%] mx-auto px-4 py-6 ">
       {/* Vendor Info Section */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left mb-6 gap-[25px]">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative w-20 h-20 overflow-hidden rounded-full">
              <img
                src={vendorData?.profile_image || IMAGES.profile}
                alt={vendorData?.name || "Vendor"}
                className="object-cover w-full h-full"
                onError={(e) => (e.target.src = IMAGES.profile)}
              />
            </div>
            <div>
              <h1 className="text-xl font-bold truncate max-w-xs">
                {vendorData?.name ?? "Vendor"}
              </h1>
              {vendorData?.email && (
                <p className="text-sm text-gray-600 mt-1">{vendorData.email}</p>
              )}
              {vendorData?.phone && (
                <p className="text-sm text-gray-600 mt-1">📞 {vendorData.phone}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-4 md:mt-0 md:ml-[10px]">
            <button
              className="cursor-pointer flex items-center gap-2 bg-[#0f1c5e] text-white px-4 py-2 rounded-md"
              onClick={() => setShowEnquiryForm(true)}
            >
              <svg width="16" height="16" fill="currentColor" className="bi bi-chat-dots-fill" viewBox="0 0 16 16">
                <path d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
              </svg>
              <span className="whitespace-nowrap">Enquiry</span>
            </button>

            {vendorData?.phone && (
              <button
                onClick={handleCall}
                className="cursor-pointer flex items-center gap-2 bg-white text-[#0f1c5e] border border-[#0f1c5e] px-4 py-2 rounded-md"
              >
                <svg width="16" height="16" fill="currentColor" className="bi bi-telephone-fill" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z" />
                </svg>
                <span className="whitespace-nowrap">Call</span>
              </button>
            )}
          </div>
        </div>





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
</>

    
  );
};

export default SellerProfile;