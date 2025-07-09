import React, { useState, useEffect } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DevicesIcon from "@mui/icons-material/Devices";
import StarIcon from "@mui/icons-material/Star";
import MemoryIcon from "@mui/icons-material/Memory";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DeleteIcon from "@mui/icons-material/Delete";
import { api, apiForFiles } from "../../api/axios.js";
import IMAGES from "../../utils/images.js";
import { useMediaQuery } from "react-responsive";

const SellerElectronicsTabContent = ({ 
  enquiryData = [], 
  loading = false, 
  activeEnquiryType = "post",
  onRefresh = () => {} 
}) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  // State for electronics cards with expanded state
  const [electronics, setElectronics] = useState([]);

  // Update electronics when enquiryData changes
  useEffect(() => {
    if (enquiryData && enquiryData.length > 0) {
      const formattedElectronics = enquiryData.map((item, index) => {
        const electronicsData = item.enquirable || {};
        
        // Format condition
        const formatCondition = (condition) => {
          if (condition === 'new') return 'New';
          if (condition === 'used') return 'Used';
          if (condition === 'refurbished') return 'Refurbished';
          return condition || 'Not specified';
        };

        // Format brand and model
        const formatBrandModel = (brand, model) => {
          if (brand && model) return `${brand} ${model}`;
          if (brand) return brand;
          if (model) return model;
          return 'Not specified';
        };

        // Format warranty
        const formatWarranty = (warranty) => {
          if (warranty) return `${warranty} warranty`;
          return 'No warranty info';
        };

        return {
          id: item.id,
          title: electronicsData.title || electronicsData.product_name || "Electronics Item",
          location: electronicsData.address || electronicsData.location || "Location not specified",
          brand: electronicsData.brand_name || electronicsData.brand || "Unknown brand",
          model: electronicsData.model_name || electronicsData.model || "Unknown model",
          condition: formatCondition(electronicsData.condition),
          warranty: formatWarranty(electronicsData.warranty_period),
          specifications: electronicsData.specifications || electronicsData.specs,
          price: parseFloat(electronicsData.price) || parseFloat(electronicsData.amount) || 0,
          expanded: index === 0, // First item expanded by default
          image: electronicsData.image,
          productCode: electronicsData.unique_code,
          status: electronicsData.status,
          description: electronicsData.description,
          category: electronicsData.category || electronicsData.subcategory_name,
          customerDetails: {
            name: item.name || "Customer Name",
            mobileNumber: item.mobile_number || "Not provided",
            email: item.email || "Not provided",
            whatsappNumber: item.whatsapp_number || item.mobile_number || "Not provided",
            message: item.message || "No message provided",
          }
        };
      });
      setElectronics(formattedElectronics);
    } else {
      // No API data - set empty array
      setElectronics([]);
    }
  }, [enquiryData]);

  // Toggle expanded state for an electronics item
  const toggleExpand = (id) => {
    setElectronics(
      electronics.map((item) =>
        item.id === id
          ? { ...item, expanded: !item.expanded }
          : item
      )
    );
  };

  // Handle delete with API call
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this enquiry?")) {
      try {
        let endpoint;
        
        if (activeEnquiryType === "property") {
          // Property enquiry - delete from user API
          endpoint = `/enquiries/${id}`;
        } else {
          // Post enquiry - delete from vendor API
          endpoint = `/enquiries/${id}`;
        }

        await api.delete(endpoint);

        // Remove from local state
        setElectronics(electronics.filter((item) => item.id !== id));
        
        // Refresh data from server
        onRefresh();
        
        // Show success message
        alert('Enquiry deleted successfully');
      } catch (error) {
        console.error('Error deleting enquiry:', error);
        alert('Failed to delete enquiry. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="mymediator-seller-tab-content">
        <div className="flex justify-center items-center h-40">
          <div className="text-lg">Loading electronics enquiries...</div>
        </div>
      </div>
    );
  }

  if (electronics.length === 0) {
    return (
      <div className="mymediator-seller-tab-content">
        <div className="flex flex-col justify-center items-center h-40 text-center">
          <div className="text-xl text-gray-400 mb-2">📱</div>
          <div className="text-lg text-gray-600 font-medium mb-1">
            No electronics enquiries found
          </div>
          <div className="text-sm text-gray-500">
            No {activeEnquiryType === "property" ? "property" : "post"} electronics enquiries available at the moment
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mymediator-seller-tab-content">
        {/* Electronics Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-1 gap-4 px-2">
          {electronics.map((item) => (
            <div key={item.id} className="rounded-lg overflow-hidden">
              <div
                className="p-3 bg-white rounded-lg cursor-pointer"
                style={{
                  boxShadow: "0px 0.96px 3.83px 0px #A9A9A940",
                  border: "1px solid #D7D7D7",
                }}
                onClick={() => toggleExpand(item.id)}
              >
                <div className="flex">
                  <div className="w-20 h-20 flex-shrink-0">
                    <img
                      src={item.image || IMAGES.electronicscategory}
                      alt={item.title}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between pb-[10px]">
                      <h3
                        className="font-bold w-1/2 overflow-hidden truncate"
                        style={{
                          maxWidth: isMobile ? "100px" : "100px",
                          minWidth: isMobile ? "80px" : "100px",
                          width: "100%",
                        }}
                      >
                        {item.title}
                      </h3>
                      <div
                        className="flex items-center justify-end overflow-hidden w-1/2"
                        style={{
                          maxWidth: isMobile ? "100px" : "150px",
                          minWidth: isMobile ? "90px" : "100px",
                          width: "100%",
                        }}
                        title={item.location}
                      >
                        <LocationOnIcon
                          style={{ fontSize: 16 }}
                          className="mr-1 text-red-500"
                        />
                        <span className="text-sm truncate">
                          {item.location}
                        </span>
                      </div>
                    </div>
                    {/* <div className="text-sm mt-1 flex items-center flex-wrap gap-2">
                      <span className="flex items-center">
                        <DevicesIcon style={{ fontSize: 14 }} className="mr-1" />
                        {item.brand}
                      </span>
                      {item.model !== "Unknown model" && (
                        <span className="text-xs text-gray-600">
                          {item.model}
                        </span>
                      )}
                     
                    </div> */}
                   
                    <div className="flex items-center justify-between mt-3 pb-[10px]">
                      <div className="font-bold">
                        ₹ {item.price ? item.price.toLocaleString() : "Not specified"}
                      </div>
                      <div className="flex items-center gap-2">
                        {item.year && (
                          <span className="text-xs px-2 py-1 ">
                            {item.year}
                          </span>
                        )}
                        <button
                          className="text-sm flex items-center cursor-pointer"
                          onClick={() => toggleExpand(item.id)}
                        >
                          View more
                          {item.expanded ? (
                            <KeyboardArrowUpIcon
                              style={{ fontSize: 22 }}
                              className="ml-1 text-red-500 font-bold"
                            />
                          ) : (
                            <KeyboardArrowDownIcon
                              style={{ fontSize: 22 }}
                              className="ml-1 text-red-500 font-bold"
                            />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Details Box (conditionally rendered based on expanded state) */}
              {item.expanded && (
                <div
                  className="mt-1 border-t border-gray-200 p-4 bg-gray-50 rounded-lg"
                  style={{
                    boxShadow: "0px 0.96px 3.83px 0px #A9A9A940",
                    border: "1px solid #D7D7D7",
                  }}
                >
                  <div className="">
                    <div className="flex">
                      <div className="text-sm pb-[15px]">
                        <strong>Name :</strong> &nbsp;
                        {item.customerDetails?.name || "Customer Name"}
                      </div>

                      <button className="text-red-500 ml-auto cursor-pointer">
                        <DeleteIcon
                          style={{ fontSize: 20 }}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card expansion toggle
                            handleDelete(item.id);
                          }}
                        />
                      </button>
                    </div>

                    <div className="text-sm pb-[15px]">
                      <strong>Mobile number :</strong> &nbsp;
                      <a href={`tel:${item.customerDetails?.mobileNumber}`} className="text-black hover:underline">
                        {item.customerDetails?.mobileNumber || "Not provided"}
                      </a>
                    </div>

                    <div className="text-sm pb-[15px]">
                      <strong>E-mail Id :</strong> &nbsp;
                      <a href={`mailto:${item.customerDetails?.email}`} className="text-black hover:underline">
                        {item.customerDetails?.email || "Not provided"}
                      </a>
                    </div>

                    <div className="pb-[15px] text-sm">
                      <strong>Whatsapp number :</strong>&nbsp;{" "}
                      <a 
                        href={`https://wa.me/${item.customerDetails?.whatsappNumber?.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black hover:underline"
                      >
                        {item.customerDetails?.whatsappNumber || "Not provided"}
                      </a>
                    </div>

                    {item.specifications && (
                      <div className="pb-[15px] text-sm">
                        <strong>Specifications :</strong> &nbsp;
                        {item.specifications}
                      </div>
                    )}

                    {/* {item.warranty && item.warranty !== "No warranty info" && (
                      <div className="pb-[15px] text-sm">
                        <strong>Warranty :</strong> &nbsp;
                        {item.warranty}
                      </div>
                    )} */}

                    <div className="text-sm align-top overflow-hidden line-clamp-4">
                      <strong>Message :</strong> &nbsp;{" "}
                      {item.customerDetails?.message || "No message provided"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SellerElectronicsTabContent;