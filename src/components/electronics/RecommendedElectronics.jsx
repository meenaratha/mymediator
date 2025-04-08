import React from "react";
import { useMediaQuery } from "react-responsive";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import IMAGES from "@/utils/images.js";
import { Link } from "react-router-dom";

const LaptopCard = ({ laptop }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full transition-transform hover:scale-[1.02] cursor-pointer">
      <div className="relative">
        <img 
          src={laptop.image} 
          alt={`${laptop.brand} ${laptop.model}`} 
          className="w-full h-40 object-cover"
        />
        <div className="absolute top-2 right-2 bg-white rounded-lg px-2 py-1 text-xs font-semibold">
          {laptop.year}
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-base truncate">{laptop.brand} {laptop.model}</h3>
          <span className="text-gray-700 font-bold">₹{laptop.price.toLocaleString()}</span>
        </div>
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <LocationOnIcon fontSize="small" className="text-red-500 mr-1" sx={{ fontSize: 14 }} />
          <span className="truncate">{laptop.location}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">{laptop.specs}</span>
          <div className="flex items-center">
            <StarIcon className="text-yellow-400 mr-1" sx={{ fontSize: 14 }} />
            <span>{laptop.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const RecommendedLaptops = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  
  // Sample laptop data - replace with your actual data
  const recommendedLaptops = [
    {
      id: 1,
      brand: "Apple",
      model: "MacBook Air",
      year: 2022,
      specs: "M1, 8GB, 256GB",
      price: 79000,
      rating: 4.8,
      location: "Anna Nagar, Chennai",
      image: IMAGES.mac1,
    },
    {
      id: 2,
      brand: "Acer",
      model: "Nitro 5",
      year: 2021,
      specs: "i5, 16GB, 512GB",
      price: 65000,
      rating: 4.7,
      location: "Adyar, Chennai",
      image: IMAGES.mac2,
    },
    {
      id: 3,
      brand: "ASUS",
      model: "ROG Strix",
      year: 2023,
      specs: "Ryzen 7, 16GB, 1TB",
      price: 115000,
      rating: 4.9,
      location: "T. Nagar, Chennai",
      image: IMAGES.mac3,
    },
    {
      id: 4,
      brand: "Microsoft",
      model: "Surface Laptop",
      year: 2022,
      specs: "i5, 8GB, 256GB",
      price: 82000,
      rating: 4.6,
      location: "Velachery, Chennai",
      image: IMAGES.mac4,
    },
    {
      id: 5,
      brand: "ASUS",
      model: "VivoBook",
      year: 2022,
      specs: "i3, 8GB, 512GB",
      price: 45000,
      rating: 4.5,
      location: "Porur, Chennai",
      image: IMAGES.mac5,
    },
  ];

  return (
    <div className="my-8">
      <h2 className="text-xl font-bold mb-4">Recommended Laptops</h2>
      
      {/* Mobile Swiper */}
      {isMobile ? (
        <Swiper
          slidesPerView={1.2}
          spaceBetween={12}
          pagination={{ clickable: true }}
          modules={[Pagination]}
          className="w-full"
        >
          {recommendedLaptops.map((laptop) => (
            <SwiperSlide key={laptop.id}>
              <Link to="/electronics-details">
                <LaptopCard laptop={laptop} />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        /* Desktop Grid */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {recommendedLaptops.map((laptop) => (
            <Link key={laptop.id} to="/electronics-details">
              <LaptopCard laptop={laptop} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendedLaptops;