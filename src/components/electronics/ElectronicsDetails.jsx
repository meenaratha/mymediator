import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ShareIcon from "@mui/icons-material/Share";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarIcon from "@mui/icons-material/Star";
import CallIcon from "@mui/icons-material/Call";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import VerifiedIcon from "@mui/icons-material/Verified";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import CloseIcon from "@mui/icons-material/Close";
import LaptopIcon from "@mui/icons-material/Laptop";
import MemoryIcon from "@mui/icons-material/Memory";
import StorageIcon from "@mui/icons-material/Storage";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import IMAGES from "../../utils/images.js";
import { useMediaQuery } from "react-responsive";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const LaptopDetails = ({ laptop }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [isFavorite, setIsFavorite] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [mainSwiper, setMainSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomedImageSrc, setZoomedImageSrc] = useState("");
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [zoomLevel, setZoomLevel] = useState(2);
  const mainImageRef = useRef(null);
  
  // For touch support on mobile devices
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });

  // Image arrays - replace with your laptop images
  const images = [
    IMAGES.laptop1,
    IMAGES.laptop2,
    IMAGES.laptop3,
    IMAGES.laptop4,
    IMAGES.laptop5,
  ];

  // Handle touch events for mobile zoom
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };
  
  const handleTouchMove = (e) => {
    if (!showZoom) return;
    
    const touch = e.touches[0];
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    
    // Calculate position in percentage
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  };
  
  const handleZoomIn = (imageSrc, index) => {
    setZoomedImageSrc(imageSrc);
    setShowZoom(true);
    
    // Make sure we're showing the same index in both main swiper and thumbnails
    if (mainSwiper && !mainSwiper.destroyed) {
      mainSwiper.slideToLoop(index);
    }
  };

  const handleZoomOut = () => {
    setShowZoom(false);
  };

  // Handle zoom mouse movement for the zoom modal
  const handleZoomMouseMove = (e) => {
    if (!showZoom) return;
    
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    
    // Calculate position in percentage
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  };

  // Synchronize the main image with thumbnails
  const handleSlideChange = (swiper) => {
    const newIndex = swiper.realIndex;
    setActiveIndex(newIndex);

    // Ensure the active thumbnail is scrolled into view
    if (thumbsSwiper && !thumbsSwiper.destroyed) {
      thumbsSwiper.slideToLoop(newIndex);
    }

    // Update zoomed image to match current main image if zoom is open
    if (showZoom) {
      setZoomedImageSrc(images[newIndex]);
    }
  };

  const handleImageLeave = () => {
    setIsZooming(false);
  };

  return (
    <>
      <div className="">
        <div className="flex flex-col md:flex-row py-10">
          {/* Left Section - Images */}
          <div className="w-full md:w-1/2 p-2">
            <div className="flex flex-col-reverse md:flex-row gap-3">
              {/* Thumbnails */}
              <div className="md:flex flex-row md:flex-col space-y-2 mr-2 gap-2">
                <Swiper
                  onSwiper={setThumbsSwiper}
                  slidesPerView={3}
                  spaceBetween={10}
                  direction={isMobile ? "horizontal" : "vertical"}
                  loop={true}
                  initialSlide={activeIndex}
                  watchSlidesProgress={true}
                  centeredSlides={true}
                  slideToClickedSlide={true}
                  navigation={false}
                  modules={[Navigation, Thumbs]}
                  className="rounded-lg overflow-hidden max-h-[280px]"
                >
                  {images.map((thumb, index) => (
                    <SwiperSlide
                      key={index}
                      className={`w-24 h-16 rounded overflow-hidden cursor-pointer border-2 ${
                        activeIndex === index ? "border-blue-500" : "border-gray-200"
                      }`}
                      onClick={() => {
                        if (mainSwiper) {
                          mainSwiper.slideToLoop(index);
                        }
                      }}
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
                  onSwiper={setMainSwiper}
                  slidesPerView={1}
                  spaceBetween={20}
                  loop={true}
                  thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  pagination={{
                    clickable: true,
                  }}
                  navigation={false}
                  onSlideChange={handleSlideChange}
                  modules={[Autoplay, Pagination, Navigation, Thumbs]}
                  className="rounded-lg overflow-hidden"
                >
                  {images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <div className="relative">
                        <img
                          src={image}
                          alt={`Laptop view ${index + 1}`}
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
                              className={isFavorite ? "text-red-500" : "text-gray-600"}
                            />
                          </button>
                          <button 
                            className="bg-white p-2 rounded-full"
                            onClick={() => handleZoomIn(image, index)}
                          >
                            <ZoomInIcon className="text-gray-600" />
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
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <div className="p-4 rounded-lg shadow-lg bg-white w-full max-w-[440px]">
              {/* Seller profile section */}
              <div className="flex items-center mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={IMAGES.profile}
                    alt="Seller"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-lg">Jessamyn</h3>
                  <p className="text-sm text-gray-500">Seller</p>
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
                          laptop.location.latitude,
                          laptop.location.longitude,
                        ]}
                        zoom={13}
                        scrollWheelZoom={false}
                        className="w-[150px] h-[150px] rounded-[10px]"
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker
                          position={[
                            laptop.location.latitude,
                            laptop.location.longitude,
                          ]}
                        >
                          <Popup>
                            {laptop.brand} {laptop.model}
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
              <div className="flex items-center py-2">
                <h2 className="md:text-2xl text-[20px] font-bold">
                  MICROSOFT SURFACE
                </h2>
                <div className="w-[fit-content] ml-4 bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center text-xs">
                  <VerifiedIcon fontSize="small" className="mr-1" />
                  VERIFIED SELLER
                </div>
              </div>

              <div className="flex items-center mt-2 mb-2">
                <p className="mr-4">Surface Pro 8</p>
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
                  ₹ 80,000
                </h3>
                <div className="flex mt-4 space-x-4 justify-center">
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

      {/* Zoom Modal */}
      {showZoom && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl h-[80vh] bg-white rounded-lg overflow-hidden">
            <button 
              onClick={handleZoomOut}
              className="absolute top-4 right-4 bg-white rounded-full z-10 w-[30px] h-[30px] flex items-center justify-center cursor-pointer"
            >
              <CloseIcon className="text-gray-600" />
            </button>
            <div 
              className="w-full h-full overflow-hidden"
              onMouseMove={handleZoomMouseMove}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
            >
              <img
                src={zoomedImageSrc}
                alt="Zoomed laptop view"
                className={`w-full h-full ${isMobile ? "object-contain" : "object-cover"}`}
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  transition: 'transform-origin 0.1s ease-out'
                }}
              />
            </div>
            
            {/* Thumbnail navigation in zoom view - responsive for mobile */}
            <div className="absolute bottom-4 left-0 right-0 px-4">
              <div className="overflow-x-auto pb-2 max-w-full scrollbar-hide">
                <div className="flex space-x-2 justify-center md:justify-center min-w-max mx-auto" style={{ scrollbarWidth: 'none' }}>
                  {images.map((img, idx) => (
                    <div 
                      key={idx} 
                      className={`w-12 h-12 md:w-16 md:h-16 rounded-md overflow-hidden cursor-pointer border-2 flex-shrink-0 ${
                        zoomedImageSrc === img ? "border-blue-500" : "border-gray-200"
                      }`}
                      onClick={() => {
                        setZoomedImageSrc(img);
                        // Also synchronize main swiper to this image
                        if (mainSwiper && !mainSwiper.destroyed) {
                          mainSwiper.slideToLoop(idx);
                        }
                      }}
                    >
                      <img 
                        src={img} 
                        alt={`Thumbnail ${idx}`}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LaptopDetails;