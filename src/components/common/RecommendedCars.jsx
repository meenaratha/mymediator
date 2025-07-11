import React, { useState, useEffect } from "react";
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

const RecommendedCars = () => {
  const navigate = useNavigate();
  const [recommendedCars, setRecommendedCars] = useState([]);
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
    const fetchRecommendedCars = async () => {
      try {
        const selectedLocation = JSON.parse(
          localStorage.getItem("selectedLocation")
        );
        const latitude = selectedLocation?.latitude;
        const longitude = selectedLocation?.longitude;

        if (!latitude || !longitude) return;

        const response = await api.get(
          `/gcar/populer/list`,
          { params: { latitude, longitude } }
        );

        setRecommendedCars(response.data.data || []);
        console.log("recommended cars list", response.data.data);
      } catch (error) {
        console.error('Failed to load recommended cars:', error);
        setRecommendedCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedCars();
  }, []);

  const handleCardClick = (car) => {
    // navigate(`/car/${car.action_slug}`);
    window.location.href = `/car/${car.action_slug}`;

  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2">Loading recommended cars...</p>
      </div>
    );
  }

  if (recommendedCars.length === 0) {
    return (
      <div className="text-center py-8">
        <p>No recommended cars available</p>
      </div>
    );
  }

  return (
    <>
      <div className="h-[40px]"></div>
      <h1 className="text-left text-black text-[24px] font-semibold px-3">
        Recommended Cars
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
          {recommendedCars.map((car) => (
            <SwiperSlide key={car.id}>
              <Card 
                onClick={() => handleCardClick(car)}
                className="cursor-pointer max-w-[275px] w-full rounded-lg shadow-md overflow-hidden hover:shadow-lg mx-auto transition-transform hover:scale-[1.02]"
              >
                <div className="relative">
                  <img
                    src={car.image_url || IMAGES.car1}
                    alt={car.title || `${car.brand} ${car.model}`}
                    className="w-full h-36 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-white rounded-md px-1 py-0.5 flex items-center">
                    <span className="text-xs font-semibold mr-0.5">
                      {car.average_rating || "4.5"}
                    </span>
                    <StarIcon sx={{ color: "#FFD700" }} fontSize="small" />
                  </div>
                </div>

                <CardContent className="p-3">
                  <h3 className="font-bold text-lg truncate">
                    {car.title || `${car.brand} ${car.model}`}
                  </h3>

                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <LocationOnIcon sx={{ color: red[500] }} fontSize="small" />
                    <span className="truncate">
                      {car.city}, {car.district}
                    </span>
                  </div>

                  <div className="flex items-center mt-2">
                    <SpeedIcon fontSize="small" className="text-gray-600" />
                    <span className="ml-1 text-sm text-gray-600">
                      {car.kilometers_driven || 'N/A'} km
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {car.post_year ||car.manufacturing_year }
                    </span>
                    <span className="font-bold text-lg">
                      ₹ {car.price ? 
                        (parseFloat(car.price) >= 100000 ? 
                          (parseFloat(car.price) / 100000).toFixed(2) + "L" : 
                          parseFloat(car.price).toLocaleString()
                        ) : 
                        car.amount || "N/A"
                      }
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

export default RecommendedCars;