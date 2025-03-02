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
import { useMediaQuery } from "react-responsive"; // For detecting mobile devices
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const PropertyDetails = ({ property }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });

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
    IMAGES.propertydetails,
    IMAGES.propertydetails,
    IMAGES.propertydetails,
    IMAGES.propertydetails,
  ];
  return (
    <>
      <div className="">
        <div className="flex flex-col md:flex-row  py-10">
          {/* Left Section - Images */}
          <div className="w-full md:w-1/2 p-2">
            <div className="flex flex-col-reverse md:flex-row gap-3">
              {/* Thumbnails */}
              <div className=" md:flex flex-row  md:flex-col space-y-2 mr-2 gap-2">
                <Swiper
                  slidesPerView={3} // Default: 1 slide on small screens
                  spaceBetween={10}
                  direction={isMobile ? "horizontal" : "vertical"} // Horizontal for mobile, vertical for larger screens
                  loop={true}
                  autoplay={false} // Disable autoplay
                  pagination={false} // Disable pagination
                  navigation={false}
                  modules={[Navigation]} // Removed Autoplay and Pagination from modules
                  className="rounded-lg overflow-hidden max-h-[280px]"
                >
                  {thumbnails.map((thumb, index) => (
                    <SwiperSlide
                      key={index}
                      className="w-24 h-16 rounded overflow-hidden cursor-pointer border-2 border-gray-200"
                    >
                      <img
                        src={thumb}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-24 h-full rounded object-cover"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
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

          <div className="w-full md:w-1/2 flex flex-col items-center ">
            <div className="p-4 rounded-lg shadow-lg bg-white w-full  max-w-[440px]">
              {/* Owner profile section */}
              <div className="flex items-center mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={IMAGES.profile}
                    alt="Owner"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-lg">Jayalakshmi</h3>
                  <p className="text-sm text-gray-500">Owner</p>
                </div>
                <div className="ml-auto">
                  <button className="text-blue-600 text-sm font-medium cursor-pointer">
                    See Profile
                  </button>
                </div>
              </div>

              {/* Location and map section */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex items-start">
                  <LocationOnIcon
                    className="text-black mt-1 w-5 h-5"
                    sx={{ color: "red" }}
                  />
                  <div className="ml-2">
                    <p className="text-sm text-gray-500">T.Nagar</p>
                    <p className="font-semibold text-xl">Chennai</p>
                  </div>
                  <div className="ml-auto">
                    <div className="w-[150px] h-[150px] rounded-lg overflow-hidden">
                      <MapContainer
                        center={[
                          property.location.latitude,
                          property.location.longitude,
                        ]}
                        zoom={false}
                        scrollWheelZoom={false}
                        className="w-[150px] h-[150px] rounded-[10px] "
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> meena'
                        />
                        <Marker
                          position={[
                            property.location.latitude,
                            property.location.longitude,
                          ]}
                        >
                          <Popup>
                            {property.type} <br /> {property.facing}
                          </Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="w-full md:w-1/2">
              <div className="flex  items-center py-2">
                <h2 className="md:text-2xl text-[20px] font-bold">
                  DIVIYA HOUSE
                </h2>
                <div className=" w-[fit-content] ml-4 bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center text-xs">
                  <VerifiedIcon fontSize="small" className="mr-1" />
                  VERIFIED SELLER
                </div>
              </div>

              <div className="flex items-center mt-2 mb-2">
                <p className="mr-4">Individual( 3 BHK )</p>
                <p className="mr-4">2021</p>
                <div className="flex items-center">
                  <StarIcon className="text-orange-500" />
                  <span className="ml-1">4.5</span>
                </div>
              </div>

              <div className="flex items-center text-red-500 mt-4 gap-[10px]">
                <LocationOnIcon fontSize="small" />
                <p className="text-sm text-black">West Mambalam, Chennai</p>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col md:items-center md:mt-[10px]">
              <div className="mt-1 md:mt-0">
                <h3 className="md:text-2xl text-[20px] font-bold md:text-center">
                  ₹ 9,90,000
                </h3>
                <div className="flex mt-4 space-x-4 justify-center ">
                  <button className="bg-[#02487C] text-white px-6 py-3 rounded-[25px] cursor-pointer flex items-center justify-center flex-1">
                    <QuestionAnswerIcon fontSize="small" className="mr-2" />
                    Enquiry
                  </button>
                  <button className="bg-[#02487C] text-white px-6 py-3 rounded-[25px] cursor-pointer flex items-center justify-center flex-1">
                    <CallIcon fontSize="small" className="mr-2" />
                    Call
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyDetails;
