import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import IMAGES from "@/utils/images.js";
import { useMediaQuery } from "react-responsive"; // For detecting mobile devices
import { Card, CardContent } from "@mui/material";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BedIcon from "@mui/icons-material/Bed";
import { red } from "@mui/material/colors";
import { api } from "@/api/axios"; // Adjust if your axios instance path is different
import { useNavigate } from "react-router-dom";

const RecommendedProperty = () => {
  const navigate = useNavigate();

  const isMobile = useMediaQuery({ maxWidth: 767 });

  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const selectedLocation = JSON.parse(
          localStorage.getItem("selectedLocation")
        );
        const latitude = selectedLocation?.latitude;
        const longitude = selectedLocation?.longitude;

        if (!latitude || !longitude) return;

        const response = await api.get(`/properties/populer/list`, {
          params: { latitude, longitude },
        });

        setProperties(response.data.data || []);
        console.log("reccomended listttt", response.data.data);
      } catch (error) {
        console.error("API error:", error);
      }
    };

    fetchProperties();
  }, []);

  const handleCardClick = (property) => {
    // navigate(`/properties/${property.action_slug}`);
      window.location.href = `/properties/${property.action_slug}`;
  };

  return (
    <>
      <div className="h-[40px]"></div>
      <h1 className="text-left text-black text-[24px] font-semibold px-3">
        Recommended Property
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
          {properties.map((property) => (
            <SwiperSlide key={property.id}>
              <Card
                onClick={() => handleCardClick(property)}
                className="cursor-pointer max-w-[275px] w-full rounded-lg shadow-md overflow-hidden hover:shadow-lg mx-auto"
              >
                <div className="relative">
                  <img
                    src={property.image_url || IMAGES.placeholderimg}
                    alt={property.property_name}
                    className="w-full h-36 object-cover"
                  />
                </div>

                <CardContent className="p-3">
                  <h3 className="font-bold text-lg truncate">
                    {property.property_name}
                  </h3>

                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <LocationOnIcon sx={{ color: red[500] }} />
                    <span  className="truncate">
                      {property.district}, {property.state}
                    </span>
                  </div>

                  <div className="flex items-center mt-2 space-x-4">
                    {property.super_builtup_area !== null ? (
                      <div className="flex items-center">
                        <SquareFootIcon />
                        <span className="ml-1 text-sm">
                          {property.super_builtup_area} Sqr
                        </span>
                      </div>
                    ) : (
                      ""
                    )}

                    {property.bedrooms !== null ? (
                      <div className="flex items-center">
                        <BedIcon />
                        <span className="ml-1 text-sm">
                          {property.bedrooms} 
                        </span>
                      </div>
                    ) : (
                      ""
                    )}


                     

                     {property.wash_room !== null ? (
                      <div className="flex items-center">
                        <BedIcon />
                        <span className="ml-1 text-sm">
                          {property.wash_room} 
                        </span>
                      </div>
                    ) : (
                      ""
                    )}
                

                   
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {property.post_year}
                    </span>
                    <span className="font-bold text-lg">
                      ₹ {property.amount}
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

export default RecommendedProperty;
