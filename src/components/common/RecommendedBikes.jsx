import React, { useState ,useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import IMAGES from "@/utils/images.js";
import { useMediaQuery } from "react-responsive";
import { Card, CardContent } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SpeedIcon from "@mui/icons-material/Speed";
import { red } from "@mui/material/colors";
import StarIcon from "@mui/icons-material/Star";
import { api } from "@/api/axios";
import { useNavigate } from "react-router-dom";

const RecommendedBikes = () => {
    const navigate = useNavigate();
  const [recommendedBikes, setRecommendedBikes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper function to get location from localStorage
  const getLocationFromStorage = () => {
    try {
      const selectedLocationStr = localStorage.getItem('selectedLocation');
      
      if (!selectedLocationStr) {
        return null;
      }
      
      const selectedLocation = JSON.parse(selectedLocationStr);
      
      if (!selectedLocation.latitude || !selectedLocation.longitude) {
        return null;
      }
      
      return {
        latitude: parseFloat(selectedLocation.latitude),
        longitude: parseFloat(selectedLocation.longitude)
      };
    } catch (error) {
      console.error("Error reading selectedLocation from localStorage:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchRecommendedBikes = async () => {
      try {
        const location = getLocationFromStorage();
        
        // Build API parameters
        const params = new URLSearchParams();
        
        if (location) {
          params.append('latitude', location.latitude.toString());
          params.append('longitude', location.longitude.toString());
        }

        const response = await api.get(`/gbike/populer/list?${params.toString()}`);
        const result = response.data?.data;

        setRecommendedBikes(result || []);
      } catch (error) {
        console.error('Failed to load recommended bikes:', error);
        setRecommendedBikes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedBikes();
  }, []);

   const handleCardClick = (bike) => {
    // navigate(`/bike/${bike.action_slug}`);
          window.location.href = `/bike/${bike.action_slug}`;

  };

  if (loading) {
    return <div className="text-center py-8">Loading recommended bikes...</div>;
  }

  if (recommendedBikes.length === 0) {
    return <div className="text-center py-8">No recommended bikes available</div>;
  }

 
  return (
    <>
      <div className="h-[40px]"></div>
      <h1 className="text-left text-black text-[24px] font-semibold px-3">
        Recommended Bikes
      </h1>
      <div className="py-8">
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          spaceBetween={20}
          breakpoints={{
            320: {
              slidesPerView: 1,
            },
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
        >
         {recommendedBikes.map((bike) => (
            <SwiperSlide key={bike.id}>
              <Card 
                onClick={() => handleCardClick(bike)}
              className="cursor-pointer max-w-[275px] w-full rounded-lg shadow-md overflow-hidden hover:shadow-lg mx-auto">
                <div className="relative">
                  <img
                    src={bike.image_url || IMAGES.placeholderimg}
                    alt={bike.title}
                    className="w-full h-36 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-white rounded-md px-1 py-0.5 flex items-center">
                    <span className="text-xs font-semibold mr-0.5">
                      {bike.average_rating || "4.5"}
                    </span>
                    <StarIcon sx={{ color: "#FFD700" }} fontSize="small" />
                  </div>
                </div>

                <CardContent className="p-3">
                  <h3 className="font-bold text-lg truncate">
                    {bike.title || `${bike.brand} ${bike.model}`}
                  </h3>

                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <LocationOnIcon sx={{ color: red[500] }} fontSize="small" />
                    <span className="truncate"> {bike.district},{bike.state}</span>
                  </div>

                  <div className="flex items-center mt-2">
                    <SpeedIcon fontSize="small" className="text-gray-600" />
                    <span className="ml-1 text-sm text-gray-600">
                      {bike.kilometers_driven || 'N/A'} km
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-sm text-gray-500">{bike.year}</span>
                    <span className="font-bold text-lg">
                      ₹ {bike.price ? (parseFloat(bike.price) / 100000).toFixed(2) : "N/A"}L
                    </span>
                  </div>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default RecommendedBikes;
