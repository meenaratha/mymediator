import React, { useState } from "react";
import IMAGES from "@/utils/images.js";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { red } from "@mui/material/colors";

const BikeDetails = ({ bike }) => {
  const [showFullImage, setShowFullImage] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Sample bike images since we don't have them in props
  const bikeImages = [
    IMAGES.mac1,
    IMAGES.mac2,
    IMAGES.mac3,
    IMAGES.mac4,
  ];

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setShowFullImage(true);
  };

  const closeFullImage = () => {
    setShowFullImage(false);
  };

  const navigationNextRef = React.useRef(null);
  const navigationPrevRef = React.useRef(null);

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Left side - Image gallery with thumbnails */}
        <div className="md:w-2/3 relative">
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            spaceBetween={10}
            navigation={{
              prevEl: navigationPrevRef.current,
              nextEl: navigationNextRef.current,
            }}
            pagination={{ clickable: true }}
            className="rounded-lg overflow-hidden shadow-md"
            onSwiper={(swiper) => {
              // Delay execution for the refs to be defined
              setTimeout(() => {
                // Override prevEl & nextEl now that refs are defined
                swiper.params.navigation.prevEl = navigationPrevRef.current;
                swiper.params.navigation.nextEl = navigationNextRef.current;

                // Re-init navigation
                swiper.navigation.destroy();
                swiper.navigation.init();
                swiper.navigation.update();
              });
            }}
          >
            {bikeImages.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={image}
                  alt={`${bike.name} - Image ${index + 1}`}
                  className="w-full h-[300px] md:h-[400px] object-cover cursor-pointer"
                  onClick={() => handleImageClick(index)}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation buttons */}
          <div 
            ref={navigationPrevRef} 
            className="absolute top-1/2 left-2 z-10 bg-white rounded-full p-1 shadow-md cursor-pointer transform -translate-y-1/2"
          >
            <ArrowBackIosIcon className="text-gray-700" fontSize="small" />
          </div>
          
          <div 
            ref={navigationNextRef} 
            className="absolute top-1/2 right-2 z-10 bg-white rounded-full p-1 shadow-md cursor-pointer transform -translate-y-1/2"
          >
            <ArrowForwardIosIcon className="text-gray-700" fontSize="small" />
          </div>

          {/* Thumbnails */}
          <div className="flex space-x-2 mt-2 overflow-x-auto pb-2">
            {bikeImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className={`w-20 h-20 object-cover cursor-pointer rounded ${
                  selectedImageIndex === index ? "border-2 border-blue-500" : ""
                }`}
                onClick={() => handleImageClick(index)}
              />
            ))}
          </div>
        </div>

        {/* Right side - Bike details */}
        <div className="md:w-1/3 bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{bike.name}</h1>
              <div className="flex items-center mt-1">
                <LocationOnIcon sx={{ color: red[500] }} fontSize="small" />
                <span className="text-sm text-gray-500 ml-1">
                  {bike.location.area}, {bike.location.city}
                </span>
              </div>
            </div>
            <div className="flex items-center bg-green-100 px-2 py-1 rounded">
              <span className="font-bold text-green-800 mr-1">{bike.rating}</span>
              <StarIcon className="text-yellow-500" fontSize="small" />
            </div>
          </div>

          <div className="text-3xl font-bold text-gray-900 mb-4">
            ₹ {bike.price}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Year</p>
              <p className="font-semibold">{bike.year}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">KM Driven</p>
              <p className="font-semibold">{bike.distance}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Owner</p>
              <p className="font-semibold">{bike.owner.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Posted on</p>
              <p className="font-semibold">{bike.postedDate}</p>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
              Enquiry
            </button>
            <button className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors">
              Call
            </button>
          </div>
        </div>
      </div>

      {/* Full image modal */}
      {showFullImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={closeFullImage}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh]">
            <img
              src={bikeImages[selectedImageIndex]}
              alt={`${bike.name} - Image ${selectedImageIndex + 1}`}
              className="max-h-full max-w-full mx-auto object-contain"
            />
            <button 
              className="absolute top-4 right-4 text-white bg-gray-800 bg-opacity-50 rounded-full p-2"
              onClick={closeFullImage}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BikeDetails;