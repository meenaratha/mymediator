import React from "react";
import { Card, CardContent, Skeleton } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { red } from "@mui/material/colors";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";

const ElectronicsCard = ({ item }) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const handleCardClick = () => {
    // Adjust the navigation path based on your routing structure
    navigate(`/electronic/${item.action_slug}`);
  };

  return (
    <Card
      onClick={handleCardClick}
      className={`${
        isMobile ? "max-w-[300px]" : ""
      } max-w-[275px] w-full rounded-lg shadow-md overflow-hidden hover:shadow-lg mx-auto cursor-pointer`}
    >
      <div className="relative">
        <img
          src={item.image_url || item.image}
          alt={item.product_name || item.productname}
          className="w-full h-36 object-cover"
        />
      </div>

      <CardContent className="p-3">
        <h3 className="font-bold text-lg">
          {item.product_name || item.productname}
        </h3>

        <div className="flex items-center text-sm text-gray-500 mt-1">
          <LocationOnIcon sx={{ color: red[500] }} />
          <span>
            {item.city && item.district 
              ? `${item.city}, ${item.district}`
              : item.location || 'Location not specified'
            }
          </span>
        </div>

        {/* Additional product details */}
        {item.brand && (
          <div className="mt-2">
            <span className="text-sm text-gray-600">Brand: {item.brand}</span>
          </div>
        )}

        {item.condition && (
          <div className="mt-1">
            <span className="text-sm text-gray-600">
              Condition: {item.status_label}
            </span>
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {item.post_year || item.year || "2022"}
          </span>
          <span className="font-bold text-lg">
            ₹ {typeof item.amount === 'number' 
                ? item.amount.toLocaleString() 
                : typeof item.price === 'string' 
                  ? item.price 
                  : (item.price || 0).toLocaleString()
              }
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