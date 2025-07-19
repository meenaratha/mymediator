import React, { useState, useEffect } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DeleteIcon from "@mui/icons-material/Delete";
import { api, apiForFiles } from "../../api/axios.js";
import IMAGES from "../../utils/images.js";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
const SellerPropertyTabContent = ({ 
  enquiryData = [], 
  loading = false, 
  activeEnquiryType = "post",
  onRefresh = () => {} 
}) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const navigate = useNavigate();
  // State for property cards with expanded state
  const [properties, setProperties] = useState([]);

  // Update properties when enquiryData changes
  useEffect(() => {
    if (enquiryData && enquiryData.length > 0) {
      const formattedProperties = enquiryData.map((item, index) => {
        const propertyData = item.enquirable || {};

        // Format BHK display
        const formatBHK = (bedrooms, bhkId) => {
          if (bedrooms) return `${bedrooms}BHK`;
          if (bhkId) return `${bhkId}BHK`;
          return "";
        };

        // Format area display
        const formatArea = (superBuiltupArea, carpetArea, plotArea) => {
          if (superBuiltupArea) return superBuiltupArea;
          if (carpetArea) return carpetArea;
          if (plotArea) return plotArea;
          return "";
        };

        // Format property type
        const formatPropertyType = (subcategoryId, plotArea) => {
          if (plotArea && plotArea > 0) return "Plot";
          if (subcategoryId === 2) return "Apartment";
          if (subcategoryId === 3) return "Plot";
          return "";
        };

        return {
          id: item.id,
          title: propertyData.property_name || "Property",
          location:
            propertyData.address ||
            propertyData.state ||
            "Location not specified",
          type: formatPropertyType(
            propertyData.subcategory_id,
            propertyData.plot_area
          ),
          bhk: formatBHK(propertyData.bedrooms, propertyData.bhk_id),
          sqft: formatArea(
            propertyData.super_builtup_area,
            propertyData.carpet_area,
            propertyData.plot_area
          ),
          price: propertyData.amount || 0,
          expanded: index === 0, // First item expanded by default
          image: propertyData.image_url || propertyData.image,
          propertyCode: propertyData.unique_code,
          slug: propertyData.action_slug,
          status: propertyData.status,
          customerDetails: {
            name: item.name || "Customer Name",
            mobileNumber: item.mobile_number || "Not provided",
            email: item.email || "Not provided",
            whatsappNumber:
              item.whatsapp_number || item.mobile_number || "Not provided",
            message: item.message || "No message provided",
          },
        };
      });
      setProperties(formattedProperties);
    } else {
      // No API data - set empty array
      setProperties([]);
    }
  }, [enquiryData]);

  // Handle navigation to property details
  const handlePropertyClick = (slug) => {
    navigate(`/properties/${slug}`);
  };

  // Toggle expanded state for a property
  const toggleExpand = (id, event) => {
    event.stopPropagation(); // Prevent navigation when clicking view more
    setProperties(
      properties.map((property) =>
        property.id === id
          ? { ...property, expanded: !property.expanded }
          : property
      )
    );
  };
  // Handle delete with API call
  const handleDelete = async (id, event) => {
     event.stopPropagation(); 
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
        setProperties(properties.filter((property) => property.id !== id));

        // Refresh data from server
        onRefresh();

        // Show success message
        alert("Enquiry deleted successfully");
      } catch (error) {
        console.error("Error deleting enquiry:", error);
        alert("Failed to delete enquiry. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="mymediator-seller-tab-content">
        <div className="flex justify-center items-center h-40">
          <div className="text-lg">Loading enquiries...</div>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="mymediator-seller-tab-content">
        <div className="flex flex-col justify-center items-center h-40 text-center">
          <div className="text-xl text-gray-400 mb-2">📋</div>
          <div className="text-lg text-gray-600 font-medium mb-1">
            No enquiries found
          </div>
          <div className="text-sm text-gray-500">
            No {activeEnquiryType === "property" ? "property" : "post"}{" "}
            enquiries available at the moment
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mymediator-seller-tab-content">
        {/* Property Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-1 gap-4 px-2">
          {properties.map((property) => (
            <div key={property.id} className="rounded-lg  overflow-hidden ">
              <div
                className="p-3 bg-white rounded-lg cursor-pointer "
                style={{
                  boxShadow: "0px 0.96px 3.83px 0px #A9A9A940",
                  border: "1px solid #D7D7D7",
                }}
                onClick={() => handlePropertyClick(property.slug)}
              >
                <div className="flex">
                  <div className="w-20 h-20 flex-shrink-0">
                    <img
                      src={property.image || IMAGES.placeholderimg}
                      alt={property.title}
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
                        {property.title}
                      </h3>
                      <div
                        className="flex items-center  justify-end  overflow-hidden w-1/2 "
                        style={{
                          maxWidth: isMobile ? "100px" : "150px",
                          minWidth: isMobile ? "90px" : "100px",
                          width: "100%",
                        }}
                        title={property.location}
                      >
                        <LocationOnIcon
                          style={{ fontSize: 16 }}
                          className="mr-1 text-red-500"
                        />
                        <span className="text-sm truncate">
                          {property.location}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm mt-1 flex items-center flex-wrap gap-4">
                      <span className="flex items-center">
                        <AspectRatioIcon
                          style={{ fontSize: 16 }}
                          className="mr-1"
                        />
                        {property.sqft}{" "}
                        {property.type === "Plot" ? "Sq. Ft" : "Sq. Ft"}
                      </span>
                      {property.bhk !== "null" ? (
                        <span className="border border-gray-300 rounded px-1 mr-2">
                          {property.bhk}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-3 pb-[10px]">
                      <div className="font-bold">
                        ₹{" "}
                        {property.price
                          ? property.price.toLocaleString()
                          : "Not specified"}
                      </div>
                      <div className="flex items-center gap-2">
                        {/* {property.status && (
                          <span className={`text-xs px-2 py-1 rounded ${
                            property.status === 'available' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {property.status}
                          </span>
                        )} */}
                        <button
                          className=" text-sm flex items-center cursor-pointer"
                          onClick={(e) => toggleExpand(property.id, e)}
                        >
                          View more
                          {property.expanded ? (
                            <KeyboardArrowUpIcon
                              style={{ fontSize: 22 }}
                              className="ml-1 text-red-500  font-bold "
                            />
                          ) : (
                            <KeyboardArrowDownIcon
                              style={{ fontSize: 22 }}
                              className="ml-1 text-red-500  font-bold"
                            />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Details Box (conditionally rendered based on expanded state) */}
              {property.expanded && (
                <div
                  className="mt-1 border-t border-gray-200 p-4 bg-gray-50 rounded-lg  "
                  style={{
                    boxShadow: "0px 0.96px 3.83px 0px #A9A9A940",
                    border: "1px solid #D7D7D7",
                  }}
                >
                  <div className="">
                    <div className="flex">
                      <div className=" text-sm pb-[15px]">
                        <strong>Name :</strong> &nbsp;{" "}
                        {property.customerDetails?.name || "Customer Name"}
                      </div>

                      <button className="text-red-500 ml-auto cursor-pointer">
                        <DeleteIcon
                          style={{ fontSize: 20 }}
                          onClick={(e) => handleDelete(property.id, e)}
                        />
                      </button>
                    </div>

                    <div className="  text-sm pb-[15px]">
                      <strong>Mobile number :</strong> &nbsp;
                      <a
                        href={`tel:${property.customerDetails?.mobileNumber}`}
                        className="text-gray hover:underline"
                      >
                        {property.customerDetails?.mobileNumber ||
                          "Not provided"}
                      </a>
                    </div>

                    <div className="  text-sm pb-[15px]">
                      <strong>E-mail Id :</strong> &nbsp;
                      <a
                        href={`mailto:${property.customerDetails?.email}`}
                        className="text-gray hover:underline"
                      >
                        {property.customerDetails?.email || "Not provided"}
                      </a>
                    </div>

                    <div className="pb-[15px] text-sm">
                      <strong> Whatsapp number :</strong>&nbsp;{" "}
                      <a
                        href={`https://wa.me/${property.customerDetails?.whatsappNumber?.replace(
                          /[^0-9]/g,
                          ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray hover:underline"
                      >
                        {property.customerDetails?.whatsappNumber ||
                          "Not provided"}
                      </a>
                    </div>

                    <div className=" text-sm align-top overflow-hidden line-clamp-4 ">
                      <strong> Message :</strong> &nbsp;{" "}
                      {property.customerDetails?.message ||
                        "No message provided"}
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

export default SellerPropertyTabContent;