import React from "react";
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

const RecommendedBikes = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
let  bikes = [];
  
   
   // Fixed path detection - use includes() method properly
    if (location.pathname.includes('/car-details')) {
      console.log('Loading car images');
      bikes = [
        {
          id: 1,
          name: "Toyota Innova Crysta",
          image: IMAGES.car5,
          location: "T. Nagar, Chennai",
          distance: "25000 km",
          year: "2022",
          rating: 4.8,
          price: "18.5",
        },
        {
          id: 2,
          name: "Hyundai Creta",
          image: IMAGES.car4,
          location: "Adyar, Chennai",
          distance: "18200 km",
          year: "2021",
          rating: 4.5,
          price: "12.5",
        },
        {
          id: 3,
          name: "Maruti Swift",
          image: IMAGES.car3,
          location: "Anna Nagar, Chennai",
          distance: "16100 km",
          year: "2020",
          rating: 4.3,
          price: "8.5",
        },
        {
          id: 4,
          name: "Honda City",
          image: IMAGES.car2,
          location: "Velachery, Chennai",
          distance: "13500 km",
          year: "2023",
          rating: 4.6,
          price: "16.5",
        },
        {
          id: 5,
          name: "Mahindra XUV700",
          image: IMAGES.car1,
          location: "Guindy, Chennai",
          distance: "17200 km",
          year: "2022",
          rating: 4.4,
          price: "21.0",
        },
      ];
     
    } else if (location.pathname.includes('/bike-details')) {
      console.log('Loading bike images');
      bikes = [
        {
          id: 1,
          name: "Royal Enfield Classic 350",
          image: IMAGES.bike5,
          location: "T. Nagar, Chennai",
          distance: "5500 km",
          year: "2022",
          rating: 4.8,
          price: "1.85",
        },
        {
          id: 2,
          name: "Bajaj RS 200",
          image: IMAGES.bike4,
          location: "Adyar, Chennai",
          distance: "8200 km",
          year: "2021",
          rating: 4.5,
          price: "1.25",
        },
        {
          id: 3,
          name: "Pulsar 220 FI",
          image: IMAGES.bike3,
          location: "Anna Nagar, Chennai",
          distance: "6100 km",
          year: "2020",
          rating: 4.3,
          price: "0.85",
        },
        {
          id: 4,
          name: "Yamaha R15 V4",
          image: IMAGES.bike2,
          location: "Velachery, Chennai",
          distance: "3500 km",
          year: "2023",
          rating: 4.6,
          price: "1.65",
        },
        {
          id: 5,
          name: "KTM 250 Duke",
          image: IMAGES.bike1,
          location: "Guindy, Chennai",
          distance: "7200 km",
          year: "2022",
          rating: 4.4,
          price: "2.10",
        },
      ];
    } else {
      console.log('Default path, loading car images');
     
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
          {bikes.map((bike) => (
            <SwiperSlide key={bike.id}>
              <Card className="max-w-[275px] w-full rounded-lg shadow-md overflow-hidden hover:shadow-lg mx-auto">
                <div className="relative">
                  <img
                    src={bike.image}
                    alt={bike.name}
                    className="w-full h-36 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-white rounded-md px-1 py-0.5 flex items-center">
                    <span className="text-xs font-semibold mr-0.5">
                      {bike.rating}
                    </span>
                    <StarIcon sx={{ color: "#FFD700" }} fontSize="small" />
                  </div>
                </div>

                <CardContent className="p-3">
                  <h3 className="font-bold text-lg truncate">{bike.name}</h3>

                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <LocationOnIcon sx={{ color: red[500] }} fontSize="small" />
                    <span className="truncate">{bike.location}</span>
                  </div>

                  <div className="flex items-center mt-2">
                    <SpeedIcon fontSize="small" className="text-gray-600" />
                    <span className="ml-1 text-sm text-gray-600">
                      {bike.distance}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-sm text-gray-500">{bike.year}</span>
                    <span className="font-bold text-lg">₹ {bike.price}L</span>
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
