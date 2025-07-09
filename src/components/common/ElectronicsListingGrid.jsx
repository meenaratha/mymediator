import React from "react";
import { Card, CardContent, Skeleton } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { red } from "@mui/material/colors";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import IMAGES from "@/utils/images.js";

const ElectronicsCard = ({ item }) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const handleCardClick = () => {
    // Use action_slug for navigation
    navigate(`/electronic/${item.action_slug}`);
  };

  // Format price for better display
  const formatPrice = (price) => {
    if (!price) return "Price not specified";
    const numPrice = parseFloat(price);
    if (numPrice >= 100000) {
      return `₹${(numPrice / 100000).toFixed(1)}L`;
    } else if (numPrice >= 1000) {
      return `₹${(numPrice / 1000).toFixed(1)}K`;
    }
    return `₹${numPrice.toLocaleString()}`;
  };

  // Get location string
  const getLocation = () => {
    const locationParts = [];
    if (item.city) locationParts.push(item.city);
    if (item.district) locationParts.push(item.district);
    if (item.state) locationParts.push(item.state);
    
    return locationParts.length > 0 
      ? locationParts.join(', ') 
      : item.address || 'Location not specified';
  };

  return (
    <Card
      onClick={handleCardClick}
      className={`${
        isMobile ? "max-w-[300px]" : ""
      } max-w-[275px] w-full rounded-lg shadow-md overflow-hidden hover:shadow-lg mx-auto cursor-pointer transition-shadow duration-200`}
    >
      <div className="relative">
        <img
          src={item.image_url || IMAGES.placeholderimg}
          alt={item.title}
          className="w-full h-36 object-cover"
          onError={(e) => {
            e.target.src = IMAGES.placeholderimg;
          }}
        />
        
        {/* Category badge */}
        {item.subcategory && (
          <div className="absolute top-2 left-2 bg-blue-900 text-white px-2 py-1 rounded text-xs font-semibold">
            {item.subcategory}
          </div>
        )}
      </div>

      <CardContent className="p-3">
        <h3 className="font-bold text-lg line-clamp-2 mb-2">
          {item.title}
        </h3>

        <div className="flex items-center text-sm text-gray-500 mt-1 mb-2">
          <LocationOnIcon sx={{ color: red[500], fontSize: 16 }} className="mr-1" />
          <span className="line-clamp-1">
            {getLocation()}
          </span>
        </div>

        {/* Brand and Model */}
        {(item.brand || item.model) && (
          <div className="mb-2">
            <span className="text-sm text-gray-600">
              {item.brand && item.model 
                ? `${item.brand} ${item.model}`
                : item.brand || item.model
              }
            </span>
          </div>
        )}

       

        <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {item.post_year || "2025"}
          </span>
          <span className="font-bold text-lg text-black">
            {formatPrice(item.price)}
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

const ElectronicsListingGrid = ({ electronics = [], loading = false }) => {
  const skeletonCount = 6;

  console.log("ElectronicsListingGrid received:", {
    electronics: electronics,
    electronicsLength: electronics?.length,
    loading: loading,
    firstItem: electronics?.[0]
  });

  return (
    <div className="container mx-auto px-4 py-8 pt-[10px]">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 justify-items-center">
        {loading
          ? Array.from({ length: skeletonCount }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          : electronics.map((item) => (
              <ElectronicsCard key={item.id} item={item} />
            ))}
      </div>

      {/* Show message when no electronics found */}
      {!loading && electronics.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg">No electronics found</div>
          <div className="text-gray-400 text-sm mt-2">
            Try adjusting your search filters or location
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectronicsListingGrid;