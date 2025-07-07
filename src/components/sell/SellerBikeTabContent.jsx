import React, { useState, useEffect } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SpeedIcon from "@mui/icons-material/Speed";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DeleteIcon from "@mui/icons-material/Delete";
import { api, apiForFiles } from "../../api/axios.js";
import IMAGES from "../../utils/images.js";
import { useMediaQuery } from "react-responsive";

const SellerBikeTabContent = ({ 
  enquiryData = [], 
  loading = false, 
  activeEnquiryType = "post",
  onRefresh = () => {} 
}) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  // State for bike cards with expanded state
  const [bikes, setBikes] = useState([]);

  // Update bikes when enquiryData changes
  useEffect(() => {
    if (enquiryData && enquiryData.length > 0) {
      const formattedBikes = enquiryData.map((item, index) => {
        const bikeData = item.enquirable || {};
        
        // Format fuel type
        const formatFuelType = (fuelTypeId) => {
          const fuelTypes = {
            1: "Petrol",
            2: "Electric", 
            3: "Diesel",
            4: "CNG"
          };
          return fuelTypes[fuelTypeId] || "Not specified";
        };

        // Format bike type/category
        const formatBikeType = (subcategoryId) => {
          const bikeTypes = {
            1: "Sports Bike",
            2: "Cruiser",
            3: "Scooter",
            4: "Standard",
            5: "Adventure",
            6: "Electric"
          };
          return bikeTypes[subcategoryId] || "Motorcycle";
        };

        // Format engine capacity
        const formatEngineCC = (engineCC) => {
          if (engineCC) return `${engineCC}cc`;
          return "Not specified";
        };

        // Format number of owners
        const formatOwners = (ownerId) => {
          const owners = {
            1: "1st Owner",
            2: "2nd Owner",
            3: "3rd Owner",
            4: "4th Owner"
          };
          return owners[ownerId] || "Not specified";
        };

        return {
          id: item.id,
          title: bikeData.title || bikeData.bike_name || "Bike",
          location: bikeData.address || bikeData.location || "Location not specified",
          year: bikeData.year || bikeData.model_year || "Not specified",
          kilometers: bikeData.kilometers || bikeData.mileage || "Not specified",
          fuelType: formatFuelType(bikeData.fuel_type_id),
          bikeType: formatBikeType(bikeData.subcategory_id),
          engineCC: formatEngineCC(bikeData.engine_capacity),
          owners: formatOwners(bikeData.number_of_owner_id),
          brand: bikeData.brand_name || bikeData.brand || "Unknown",
          model: bikeData.model_name || bikeData.model || "Unknown",
          price: parseFloat(bikeData.price) || parseFloat(bikeData.amount) || 0,
          expanded: index === 0, // First item expanded by default
          image: bikeData.image,
          bikeCode: bikeData.unique_code,
          status: bikeData.status,
          description: bikeData.description,
          customerDetails: {
            name: item.name || "Customer Name",
            mobileNumber: item.mobile_number || "Not provided",
            email: item.email || "Not provided",
            whatsappNumber: item.whatsapp_number || item.mobile_number || "Not provided",
            message: item.message || "No message provided",
          }
        };
      });
      setBikes(formattedBikes);
    } else {
      // No API data - set empty array
      setBikes([]);
    }
  }, [enquiryData]);

  // Toggle expanded state for a bike
  const toggleExpand = (id) => {
    setBikes(
      bikes.map((bike) =>
        bike.id === id
          ? { ...bike, expanded: !bike.expanded }
          : bike
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
          endpoint = `/enquiries/user/${id}`;
        } else {
          // Post enquiry - delete from vendor API
          endpoint = `/enquiries/vendor/${id}`;
        }

        await api.delete(endpoint);

        // Remove from local state
        setBikes(bikes.filter((bike) => bike.id !== id));
        
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
          <div className="text-lg">Loading bike enquiries...</div>
        </div>
      </div>
    );
  }

  if (bikes.length === 0) {
    return (
      <div className="mymediator-seller-tab-content">
        <div className="flex flex-col justify-center items-center h-40 text-center">
          <div className="text-xl text-gray-400 mb-2">🏍️</div>
          <div className="text-lg text-gray-600 font-medium mb-1">
            No bike enquiries found
          </div>
          <div className="text-sm text-gray-500">
            No {activeEnquiryType === "property" ? "property" : "post"} bike enquiries available at the moment
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mymediator-seller-tab-content">
        {/* Bike Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-1 gap-4 px-2">
          {bikes.map((bike) => (
            <div key={bike.id} className="rounded-lg overflow-hidden">
              <div
                className="p-3 bg-white rounded-lg cursor-pointer"
                style={{
                  boxShadow: "0px 0.96px 3.83px 0px #A9A9A940",
                  border: "1px solid #D7D7D7",
                }}
                onClick={() => toggleExpand(bike.id)}
              >
                <div className="flex">
                  <div className="w-20 h-20 flex-shrink-0">
                    <img
                      src={bike.image || IMAGES.sellerbike}
                      alt={bike.title}
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
                        {bike.title}
                      </h3>
                      <div
                        className="flex items-center justify-end overflow-hidden w-1/2"
                        style={{
                          maxWidth: isMobile ? "100px" : "150px",
                          minWidth: isMobile ? "90px" : "100px",
                          width: "100%",
                        }}
                        title={bike.location}
                      >
                        <LocationOnIcon
                          style={{ fontSize: 16 }}
                          className="mr-1 text-red-500"
                        />
                        <span className="text-sm truncate">
                          {bike.location}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm mt-1 flex items-center flex-wrap gap-2">
                      <span className="flex items-center">
                        <TwoWheelerIcon style={{ fontSize: 14 }} className="mr-1" />
                        {bike.brand}
                      </span>
                      {bike.model !== "Unknown" && (
                        <span className="text-xs text-gray-600">
                          {bike.model}
                        </span>
                      )}
                      <span className="flex items-center">
                        <span className="mr-1">📅</span>
                        {bike.year}
                      </span>
                    </div>
                    <div className="text-sm mt-1 flex items-center flex-wrap gap-2">
                      <span className="flex items-center">
                        <SpeedIcon style={{ fontSize: 14 }} className="mr-1" />
                        {bike.kilometers} km
                      </span>
                      <span className="flex items-center">
                        <LocalGasStationIcon style={{ fontSize: 14 }} className="mr-1" />
                        {bike.fuelType}
                      </span>
                      {bike.engineCC !== "Not specified" && (
                        <span className="text-xs text-gray-600">
                          {bike.engineCC}
                        </span>
                      )}
                    </div>
                    <div className="text-sm mt-1 flex items-center flex-wrap gap-2">
                      <span className="text-xs text-gray-600">
                        {bike.bikeType}
                      </span>
                      <span className="text-xs text-gray-600">
                        {bike.owners}
                      </span>
                      {bike.bikeCode && (
                        <span className="text-xs text-gray-500">
                          #{bike.bikeCode}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-3 pb-[10px]">
                      <div className="font-bold">
                        ₹ {bike.price ? bike.price.toLocaleString() : "Not specified"}
                      </div>
                      <div className="flex items-center gap-2">
                        {bike.status && (
                          <span className={`text-xs px-2 py-1 rounded ${
                            bike.status === 'available' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {bike.status}
                          </span>
                        )}
                        <button
                          className="text-sm flex items-center cursor-pointer"
                          onClick={() => toggleExpand(bike.id)}
                        >
                          View more
                          {bike.expanded ? (
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
              {bike.expanded && (
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
                        {bike.customerDetails?.name || "Customer Name"}
                      </div>

                      <button className="text-red-500 ml-auto cursor-pointer">
                        <DeleteIcon
                          style={{ fontSize: 20 }}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card expansion toggle
                            handleDelete(bike.id);
                          }}
                        />
                      </button>
                    </div>

                    <div className="text-sm pb-[15px]">
                      <strong>Mobile number :</strong> &nbsp;
                      <a href={`tel:${bike.customerDetails?.mobileNumber}`} className="text-blue-600 hover:underline">
                        {bike.customerDetails?.mobileNumber || "Not provided"}
                      </a>
                    </div>

                    <div className="text-sm pb-[15px]">
                      <strong>E-mail Id :</strong> &nbsp;
                      <a href={`mailto:${bike.customerDetails?.email}`} className="text-blue-600 hover:underline">
                        {bike.customerDetails?.email || "Not provided"}
                      </a>
                    </div>

                    <div className="pb-[15px] text-sm">
                      <strong>Whatsapp number :</strong>&nbsp;{" "}
                      <a 
                        href={`https://wa.me/${bike.customerDetails?.whatsappNumber?.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline"
                      >
                        {bike.customerDetails?.whatsappNumber || "Not provided"}
                      </a>
                    </div>

                    <div className="text-sm align-top overflow-hidden line-clamp-4">
                      <strong>Message :</strong> &nbsp;{" "}
                      {bike.customerDetails?.message || "No message provided"}
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

export default SellerBikeTabContent;