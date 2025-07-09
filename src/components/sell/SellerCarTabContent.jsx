import React, { useState, useEffect } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SpeedIcon from "@mui/icons-material/Speed";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import SettingsIcon from "@mui/icons-material/Settings";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DeleteIcon from "@mui/icons-material/Delete";
import { api, apiForFiles } from "../../api/axios.js";
import IMAGES from "../../utils/images.js";
import { useMediaQuery } from "react-responsive";

const SellerCarTabContent = ({ 
  enquiryData = [], 
  loading = false, 
  activeEnquiryType = "post",
  onRefresh = () => {} 
}) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  // State for car cards with expanded state
  const [cars, setCars] = useState([]);

  // Update cars when enquiryData changes
  useEffect(() => {
    if (enquiryData && enquiryData.length > 0) {
      const formattedCars = enquiryData.map((item, index) => {
        const carData = item.enquirable || {};
        
        // Format fuel type
        const formatFuelType = (fuelTypeId) => {
          const fuelTypes = {
            1: "Petrol",
            2: "Diesel", 
            3: "CNG",
            4: "Electric",
            5: "Hybrid"
          };
          return fuelTypes[fuelTypeId] || "Not specified";
        };

        // Format transmission
        const formatTransmission = (transmissionId) => {
          const transmissions = {
            1: "Manual",
            2: "Automatic"
          };
          return transmissions[transmissionId] || "Not specified";
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
          title: carData.title || "Car",
          location: carData.address || "Location not specified",
          year: carData.year || "Not specified",
          kilometers: carData.kilometers || "Not specified",
          fuelType: formatFuelType(carData.fuel_type_id),
          transmission: formatTransmission(carData.transmission_id),
          owners: formatOwners(carData.number_of_owner_id),
          price: parseFloat(carData.price) || 0,
          expanded: index === 0, // First item expanded by default
          image: carData.image,
          carCode: carData.unique_code,
          status: carData.status,
          description: carData.description,
          brandId: carData.brand_id,
          modelId: carData.model_id,
          subcategoryId: carData.subcategory_id,
          customerDetails: {
            name: item.name || "Customer Name",
            mobileNumber: item.mobile_number || "Not provided",
            email: item.email || "Not provided",
            whatsappNumber: item.whatsapp_number || item.mobile_number || "Not provided",
            message: item.message || "No message provided",
          }
        };
      });
      setCars(formattedCars);
    } else {
      // No API data - set empty array
      setCars([]);
    }
  }, [enquiryData]);

  // Toggle expanded state for a car
  const toggleExpand = (id) => {
    setCars(
      cars.map((car) =>
        car.id === id
          ? { ...car, expanded: !car.expanded }
          : car
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
        setCars(cars.filter((car) => car.id !== id));
        
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
          <div className="text-lg">Loading car enquiries...</div>
        </div>
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="mymediator-seller-tab-content">
        <div className="flex flex-col justify-center items-center h-40 text-center">
          <div className="text-xl text-gray-400 mb-2">🚗</div>
          <div className="text-lg text-gray-600 font-medium mb-1">
            No car enquiries found
          </div>
          <div className="text-sm text-gray-500">
            No {activeEnquiryType === "property" ? "property" : "post"} car enquiries available at the moment
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mymediator-seller-tab-content">
        {/* Car Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-1 gap-4 px-2">
          {cars.map((car) => (
            <div key={car.id} className="rounded-lg overflow-hidden">
              <div
                className="p-3 bg-white rounded-lg cursor-pointer"
                style={{
                  boxShadow: "0px 0.96px 3.83px 0px #A9A9A940",
                  border: "1px solid #D7D7D7",
                }}
                onClick={() => toggleExpand(car.id)}
              >
                <div className="flex">
                  <div className="w-20 h-20 flex-shrink-0">
                    <img
                      src={car.image || IMAGES.carcategory}
                      alt={car.title}
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
                        {car.title}
                      </h3>
                      <div
                        className="flex items-center justify-end overflow-hidden w-1/2"
                        style={{
                          maxWidth: isMobile ? "100px" : "150px",
                          minWidth: isMobile ? "90px" : "100px",
                          width: "100%",
                        }}
                        title={car.location}
                      >
                        <LocationOnIcon
                          style={{ fontSize: 16 }}
                          className="mr-1 text-red-500"
                        />
                        <span className="text-sm truncate">
                          {car.location}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm mt-1 flex items-center flex-wrap gap-2">
                     
                      <span className="flex items-center">
                        <SpeedIcon style={{ fontSize: 14 }} className="mr-1" />
                        {car.kilometers} km
                      </span>
                      <span className="flex items-center">
                        <LocalGasStationIcon style={{ fontSize: 14 }} className="mr-1" />
                        {car.fuelType}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 pb-[10px]">
                      <div className="font-bold">
                        ₹ {car.price ? car.price.toLocaleString() : "Not specified"}
                      </div>
                       <span className="flex items-center">
                        <span className="mr-1">📅</span>
                        {car.year}
                      </span>
                      <div className="flex items-center gap-2">
                       
                        <button
                          className="text-sm flex items-center cursor-pointer"
                          onClick={() => toggleExpand(car.id)}
                        >
                          View more
                          {car.expanded ? (
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
              {car.expanded && (
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
                        {car.customerDetails?.name || "Customer Name"}
                      </div>

                      <button className="text-red-500 ml-auto cursor-pointer">
                        <DeleteIcon
                          style={{ fontSize: 20 }}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card expansion toggle
                            handleDelete(car.id);
                          }}
                        />
                      </button>
                    </div>

                    <div className="text-sm pb-[15px]">
                      <strong>Mobile number :</strong> &nbsp;
                      <a href={`tel:${car.customerDetails?.mobileNumber}`} className="text-gray hover:underline">
                        {car.customerDetails?.mobileNumber || "Not provided"}
                      </a>
                    </div>

                    <div className="text-sm pb-[15px]">
                      <strong>E-mail Id :</strong> &nbsp;
                      <a href={`mailto:${car.customerDetails?.email}`} className="text-gray hover:underline">
                        {car.customerDetails?.email || "Not provided"}
                      </a>
                    </div>

                    <div className="pb-[15px] text-sm">
                      <strong>Whatsapp number :</strong>&nbsp;{" "}
                      <a 
                        href={`https://wa.me/${car.customerDetails?.whatsappNumber?.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray hover:underline"
                      >
                        {car.customerDetails?.whatsappNumber || "Not provided"}
                      </a>
                    </div>

                    <div className="text-sm align-top overflow-hidden line-clamp-4">
                      <strong>Message :</strong> &nbsp;{" "}
                      {car.customerDetails?.message || "No message provided"}
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

export default SellerCarTabContent;