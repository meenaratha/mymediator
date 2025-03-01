import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ShareIcon from "@mui/icons-material/Share";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarIcon from "@mui/icons-material/Star";
import CallIcon from "@mui/icons-material/Call";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import VerifiedIcon from "@mui/icons-material/Verified";
import IMAGES from "../../utils/images.js";
const PropertyDetails = () => {
  const [isFavorite, setIsFavorite] = useState(false);

  const images = [
    IMAGES.propertydetails,
    IMAGES.propertydetails,
    IMAGES.propertydetails,
  ];

  const thumbnails = [
    IMAGES.propertydetails,
    IMAGES.propertydetails,
    IMAGES.propertydetails,
  ];
  return (
    <>
      <div className="">
        <div className="flex flex-col md:flex-row">
          {/* Left Section - Images */}
          <div className="w-full md:w-2/3 p-2">
            <div className="flex">
              {/* Thumbnails */}
              <div className="hidden md:flex flex-col space-y-2 mr-2">
                {thumbnails.map((thumb, index) => (
                  <div
                    key={index}
                    className="w-24 h-16 rounded overflow-hidden cursor-pointer border-2 border-gray-200"
                  >
                    <img
                      src={thumb}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Main Image with Swiper */}
              <div className="flex max-w-[450px] h-[280px] relative">
                <Swiper
                  slidesPerView={1} // Default: 1 slide on small screens
                  spaceBetween={20}
                  loop={true}
                  autoplay={{
                    delay: 3000, // Auto-slide every 3 seconds
                    disableOnInteraction: false,
                  }}
                  pagination={{
                    clickable: true,
                  }}
                  navigation={false}
                  modules={[Autoplay, Pagination, Navigation]}
                  className="rounded-lg overflow-hidden"
                >
                  {images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <div className="relative">
                        <img
                          src={image}
                          alt={`Property view ${index + 1}`}
                          className="w-full h-[300px] object-cover"
                        />
                        <div className="absolute top-2 right-2 flex space-x-2">
                          <button className="bg-white p-2 rounded-full">
                            <ShareIcon className="text-gray-600" />
                          </button>
                          <button
                            className="bg-white p-2 rounded-full"
                            onClick={() => setIsFavorite(!isFavorite)}
                          >
                            <FavoriteBorderIcon
                              className={
                                isFavorite ? "text-red-500" : "text-gray-600"
                              }
                            />
                          </button>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>

          {/* Right Section - Details */}
          <div className="w-full md:w-1/3 p-4">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img
                  src="/api/placeholder/50/50"
                  alt="Owner"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-3">
                <h3 className="font-semibold">Jayalakshmi</h3>
                <p className="text-sm text-gray-500">Owner</p>
              </div>
              <div className="ml-auto">
                <button className="text-blue-600 text-sm">See Profile</button>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-4">
              <div className="flex items-start">
                <LocationOnIcon className="text-gray-600 mt-1" />
                <div className="ml-2">
                  <p className="text-sm text-gray-500">T.Nagar</p>
                  <p className="font-semibold">Chennai</p>
                </div>
                <div className="ml-auto">
                  <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden">
                    <img
                      src="/api/placeholder/64/64"
                      alt="Map"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <div className="flex items-center">
                <h2 className="text-2xl font-bold">DIVIYA HOUSE</h2>
                <div className="ml-4 bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center text-xs">
                  <VerifiedIcon fontSize="small" className="mr-1" />
                  VERIFIED SELLER
                </div>
              </div>

              <div className="flex items-center mt-2">
                <p className="mr-4">Individual( 3 BHK )</p>
                <p className="mr-4">2021</p>
                <div className="flex items-center">
                  <StarIcon className="text-orange-500" />
                  <span className="ml-1">4.5</span>
                </div>
              </div>

              <div className="flex items-center text-red-500 mt-2">
                <LocationOnIcon fontSize="small" />
                <p className="text-sm">West Mambalam, Chennai</p>
              </div>
            </div>

            <div className="mt-4 md:mt-0">
              <h3 className="text-3xl font-bold">₹ 9,90,000</h3>
              <div className="flex mt-4 space-x-2">
                <button className="bg-blue-800 text-white px-4 py-2 rounded-md flex items-center justify-center flex-1">
                  <QuestionAnswerIcon fontSize="small" className="mr-2" />
                  Enquiry
                </button>
                <button className="bg-blue-800 text-white px-4 py-2 rounded-md flex items-center justify-center flex-1">
                  <CallIcon fontSize="small" className="mr-2" />
                  Call
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyDetails;
