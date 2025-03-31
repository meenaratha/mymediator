import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const PropertyCard = ({
  propertyImage,
  propertyName,
  location,
  propertyType,
  bhkType,
  area,
  price,
}) => {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [adsEnabled, setAdsEnabled] = useState(false);
  const [soldOut, setSoldOut] = useState(false);

  const toggleDropdown = () => {
    setShowStatusDropdown(!showStatusDropdown);
  };

  const toggleAds = (e) => {
    e.stopPropagation();
    setAdsEnabled(!adsEnabled);
  };

  const markAsSold = (e) => {
    e.stopPropagation();
    setSoldOut(true);
    setShowStatusDropdown(false);
  };

  return (
    <div className="flex items-center p-2 bg-white rounded-lg shadow-sm border border-gray-100 w-full">
      {/* Property Image */}
      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={propertyImage}
          alt={propertyName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Property Details */}
      <div className="ml-3 flex-1 min-w-0">
        {/* Property Name and Location */}
        <div className="flex items-center">
          <h3 className="font-bold text-gray-900 truncate mr-1">
            {propertyName}
          </h3>
          <div className="flex items-center text-red-500">
            <LocationOnIcon style={{ fontSize: 18 }} />
            <span className="text-sm truncate">{location}</span>
          </div>
        </div>

        {/* Property Type */}
        <div className="flex items-center mt-1 text-gray-600">
          <span className="text-sm">{propertyType}</span>
          <span className="mx-1 text-sm">( {bhkType} )</span>
          <SquareFootIcon
            style={{ fontSize: 16, marginLeft: 4, marginRight: 2 }}
          />
          <span className="text-sm">{area}</span>
        </div>

        {/* Price and Status */}
        <div className="flex items-center mt-1 justify-between">
          <div className="flex items-center">
            <span className="text-lg font-bold">₹</span>
            <span className="text-lg font-bold ml-1">{price}</span>
          </div>
          <div className="relative">
            {soldOut ? (
              <div className="bg-blue-800 text-white px-4 py-1 rounded-md">
                Sold out
              </div>
            ) : (
              <>
                <button
                  onClick={toggleDropdown}
                  className="bg-blue-800 text-white px-4 py-1 rounded-md text-sm flex items-center"
                >
                  Status
                  {showStatusDropdown ? (
                    <KeyboardArrowUpIcon style={{ fontSize: 18 }} />
                  ) : (
                    <KeyboardArrowDownIcon style={{ fontSize: 18 }} />
                  )}
                </button>

                {/* Status Dropdown */}
                {showStatusDropdown && (
                  <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <button
                      onClick={markAsSold}
                      className="block w-full text-left px-4 py-2 text-sm text-blue-800 font-medium hover:bg-blue-50"
                    >
                      Sold out
                    </button>
                    <div className="px-4 py-2 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Ads</span>
                        <div
                          onClick={toggleAds}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            adsEnabled ? "bg-blue-800" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              adsEnabled ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PostDetails = () => {
  const isMobile = useMediaQuery({ maxWidth: 567 });
  const isTablet = useMediaQuery({ minWidth: 568, maxWidth: 899 });

  // Sample properties data
  const properties = [
    {
      id: 1,
      propertyImage:
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=500&q=60",
      propertyName: "Kalai House",
      location: "Anna Nagar",
      propertyType: "Individual",
      bhkType: "2BHK",
      area: "800 Sq. Ft",
      price: "10,000",
    },
    {
      id: 2,
      propertyImage:
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=500&q=60",
      propertyName: "Raju House",
      location: "Anna Nagar",
      propertyType: "Individual",
      bhkType: "2BHK",
      area: "800 Sq. Ft",
      price: "10,000",
    },
    {
      id: 3,
      propertyImage:
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=500&q=60",
      propertyName: "Kalai House",
      location: "Anna Nagar",
      propertyType: "Individual",
      bhkType: "2BHK",
      area: "800 Sq. Ft",
      price: "10,000",
    },
    {
      id: 4,
      propertyImage:
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=500&q=60",
      propertyName: "Kalai House",
      location: "Anna Nagar",
      propertyType: "Individual",
      bhkType: "2BHK",
      area: "800 Sq. Ft",
      price: "10,000",
    },
    {
      id: 5,
      propertyImage:
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=500&q=60",
      propertyName: "Mani House",
      location: "Anna Nagar",
      propertyType: "Individual",
      bhkType: "2BHK",
      area: "800 Sq. Ft",
      price: "10,000",
    },
    {
      id: 6,
      propertyImage:
        "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=500&q=60",
      propertyName: "Dev House",
      location: "Anna Nagar",
      propertyType: "Individual",
      bhkType: "2BHK",
      area: "800 Sq. Ft",
      price: "10,000",
    },
    {
      id: 7,
      propertyImage:
        "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=500&q=60",
      propertyName: "Dev House",
      location: "Anna Nagar",
      propertyType: "Individual",
      bhkType: "2BHK",
      area: "800 Sq. Ft",
      price: "10,000",
    },
    {
      id: 8,
      propertyImage:
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=500&q=60",
      propertyName: "Mani House",
      location: "Anna Nagar",
      propertyType: "Individual",
      bhkType: "2BHK",
      area: "800 Sq. Ft",
      price: "10,000",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4">
      <h1 className="text-xl font-bold text-[#02487C] text-center mb-6">
        My Post Details
      </h1>

      <div className="mb-8">
        <div
          className={`grid gap-4 ${
            isMobile ? "grid-cols-1" : isTablet ? "grid-cols-2" : "grid-cols-2"
          }`}
        >
          {properties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
