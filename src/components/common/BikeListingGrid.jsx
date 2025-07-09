import React from "react";
import { Card, CardContent, Skeleton } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SpeedIcon from "@mui/icons-material/Speed";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { red } from "@mui/material/colors";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import IMAGES from "../../utils/images";

const BikeCard = ({ item }) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const handleCardClick = () => {
    // Navigate using the action_slug from API response
    navigate(`/bike/${item.action_slug}`);
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
          src={item.image_url || IMAGES.placeholderimg}
          alt={item.title}
          className="w-full h-36 object-cover"
        />
        {/* Status badge */}
        {item.status && (
          <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 text-xs rounded">
            {item.status_label || item.status}
          </div>
        )}
      </div>

      <CardContent className="p-3">
        <h3 className="font-bold text-lg line-clamp-1" title={item.title}>
          {item.title}
        </h3>

        <div className="flex items-center text-sm text-gray-500 mt-1">
          <LocationOnIcon sx={{ color: red[500] }} />
          <span>
            {item.district}, {item.state}
          </span>
        </div>

       

        {/* Additional bike info */}
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          {item.brand !== null ?(
             <div className="flex items-center">
              <SpeedIcon sx={{ fontSize: 14, marginRight: 0.5 }} />
              <span>{item.brand} </span>
            </div>
          ):(
            <div className="flex items-center">
              <SpeedIcon sx={{ fontSize: 14, marginRight: 0.5 }} />
              <span>{item.brand_name} </span>
            </div>
          )

          }
           {item.kilometers && (
            <div className="flex items-center">
              <SpeedIcon sx={{ fontSize: 14, marginRight: 0.5 }} />
              <span>{item.kilometers} km</span>
            </div>
          )}
          
         
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
          {item.year && (
            <div className="flex items-center">
              <CalendarTodayIcon sx={{ fontSize: 14, marginRight: 0.5 }} />
              <span>{item.year}</span>
            </div>
          )}
          
        
          <span className="font-bold text-lg text-black">
            ₹ {parseFloat(item.price).toLocaleString()}
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
      <Skeleton variant="text" width="50%" height={20} />
    </CardContent>
  </Card>
);

const BikeListingGrid = ({ bikes = [], loading = false }) => {
  const skeletonCount = 6;

  return (
    <div className="container mx-auto px-4 py-8 pt-[10px]">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 justify-items-center">
        {loading
          ? Array.from({ length: skeletonCount }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          : bikes.map((item) => (
              <BikeCard key={item.id} item={item} />
            ))}
      </div>

      {/* Show message when no bikes found */}
      {!loading && bikes.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg">No bikes found</div>
          <div className="text-gray-400 text-sm mt-2">
            Try adjusting your search filters or location
          </div>
        </div>
      )}
    </div>
  );
};

export default BikeListingGrid;