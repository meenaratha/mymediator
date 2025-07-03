import { Card, CardContent, Skeleton } from "@mui/material";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BedIcon from "@mui/icons-material/Bed";
import { red } from "@mui/material/colors";
import IMAGES from "@/utils/images.js";
import { useMediaQuery } from "react-responsive"; // For detecting mobile devices
import { useEffect, useState } from "react";
import { api } from "@/api/axios"; // Adjust if your axios instance path is different
import { useNavigate } from "react-router-dom";
const PropertyCard = ({ property }) => {
  const navigate = useNavigate();
  // Detect mobile devices
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const handleCardClick = () => {
    navigate(`/properties/${property.action_slug}`);
  };


  return (
    <Card
      onClick={handleCardClick}
      className={`${
        isMobile ? " max-w-[300px]" : ""
      }  max-w-[275px]  w-full rounded-lg shadow-md overflow-hidden hover:shadow-lg mx-auto cursor-pointer`}
    >
      <div className="relative">
        <img
          src={property.image_url}
          alt={property.property_name}
          className="w-full h-36 object-cover"
        />
        {/* <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 text-xs rounded">
          {property.label}
        </div> */}
      </div>

      <CardContent className="p-3">
        <h3 className="font-bold text-lg">{property.property_name}</h3>

        <div className="flex items-center text-sm text-gray-500 mt-1">
          {/* Location icon */}
          <LocationOnIcon sx={{ color: red[500] }} />
          <span>
            {property.city}, {property.district}
          </span>
        </div>

        <div className="flex items-center mt-2 space-x-4">
          <div className="flex items-center">
            {/* Bed icon */}
            <SquareFootIcon />
            <span className="ml-1 text-sm">
              {property.super_builtup_area || "N/A"} Sq.ft
            </span>
          </div>

          <div className="flex items-center">
            {/* Bath icon */}
            <BedIcon />

            <span className="ml-1 text-sm">{property.bhk || "N/A"}</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {property.post_year || "2022"}
          </span>
          <span className="font-bold text-lg">
            ₹ {property.amount?.toLocaleString() || 0}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

const SkeletonCard = () => (
  <Card className="max-w-[275px] w-full rounded-lg shadow-md mx-auto">
    <Skeleton variant="rectangular" width="100%" height={140} />
    <CardContent>
      <Skeleton variant="text" width="60%" height={24} />
      <Skeleton variant="text" width="80%" height={20} />
      <Skeleton variant="text" width="40%" height={20} />
      <Skeleton variant="text" width="60%" height={20} />
    </CardContent>
  </Card>
);

const PropertyListingGrid = ({ properties = [], loading = false }) => {
  const skeletonCount = 6;
  return (
    <div className="container mx-auto px-4 py-8 pt-[10px]">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 justify-items-center">
        {loading
          ? Array.from({ length: skeletonCount }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          : properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
      </div>
    </div>
  );
};

export default PropertyListingGrid;
