import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import IMAGES from "@/utils/images.js";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@mui/material";
import { red } from "@mui/material/colors";
import { api } from "@/api/axios"; // Adjust if your axios instance path is different

const LaptopCard = ({ laptop, onClick }) => {
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer max-w-[275px] w-full rounded-lg shadow-md overflow-hidden hover:shadow-lg mx-auto transition-transform hover:scale-[1.02]"
    >
      <div className="relative">
        <img 
          src={laptop.image_url || IMAGES.placeholderimg} 
          alt={`${laptop.title} ${laptop.model}`} 
          className="w-full h-36 object-cover"
        />
        <div className="absolute top-2 right-2 bg-white rounded-lg px-2 py-1 text-xs font-semibold">
          {laptop.year || laptop.post_year}
        </div>
      </div>
      <CardContent className="p-3">
        <h3 className="font-bold text-lg truncate">
          { laptop.title || laptop.brand} 
        </h3>
        
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <LocationOnIcon sx={{ color: red[500] }} />
          <span className="truncate">
            {laptop.city}, {laptop.district}
          </span>
        </div>
        
        <div className="flex items-center mt-2">
          <span className="text-sm text-gray-600 truncate">
            {laptop.brand }
          </span>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-sm">{laptop.post_year || 4.5}</span>
          </div>
          <span className="font-bold text-lg">
            ₹ {laptop.price || laptop.amount}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

const RecommendedLaptops = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [laptops, setLaptops] = useState([]);

  useEffect(() => {
    const fetchLaptops = async () => {
      try {
        const selectedLocation = JSON.parse(
          localStorage.getItem("selectedLocation")
        );
        const latitude = selectedLocation?.latitude;
        const longitude = selectedLocation?.longitude;

        if (!latitude || !longitude) return;

        const response = await api.get(
          `/gelectronics/populer/list`,
          { params: { latitude, longitude } }
        );

        setLaptops(response.data.data || []);
        console.log("recommended electronics list", response.data.data);
      } catch (error) {
        console.error("API error:", error);
      }
    };

    fetchLaptops();
  }, []);

  const handleCardClick = (laptop) => {
    // navigate(`/electronic/${laptop.action_slug}`);
          window.location.href = `/electronic/${laptop.action_slug}`;

  };

  return (
    <>
      <div className="h-[40px]"></div>
      <h1 className="text-left text-black text-[24px] font-semibold px-3">
        Recommended Electronics
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
          {laptops.map((laptop) => (
            <SwiperSlide key={laptop.id}>
              <LaptopCard 
                laptop={laptop} 
                onClick={() => handleCardClick(laptop)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default RecommendedLaptops;