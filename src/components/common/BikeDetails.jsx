import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import { IconButton, Snackbar, Alert, Card, CardContent } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ShareIcon from "@mui/icons-material/Share";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarIcon from "@mui/icons-material/Star";
import CallIcon from "@mui/icons-material/Call";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import VerifiedIcon from "@mui/icons-material/Verified";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import CloseIcon from "@mui/icons-material/Close";
import SpeedIcon from "@mui/icons-material/Speed";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import PersonIcon from "@mui/icons-material/Person";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { red } from "@mui/material/colors";
import { useMediaQuery } from "react-responsive";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import EnquiryForm from "../../features/EnquiryForm.jsx";
import { Link } from "react-router-dom";
import { api } from "@/api/axios";
import ShareModal from "../../components/common/ShareModal";
import { HeroSection } from "@/components";

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const BikeDetails = ({ bike }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [isFavorite, setIsFavorite] = useState(bike?.is_wishlisted || false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [mainSwiper, setMainSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomedImageSrc, setZoomedImageSrc] = useState("");
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [zoomLevel, setZoomLevel] = useState(2);
  const [showEnquiryPopup, setShowEnquiryPopup] = useState(false);

  // Default Chennai coordinates
  const defaultLocation = { lat: 13.0827, lng: 80.2707 };

  // Prepare images from API response
  const images = bike?.image_url 
    ? (Array.isArray(bike.image_url) ? bike.image_url : [bike.image_url])
    : [];

  // Get map coordinates
  const mapCenter = {
    lat: bike?.latitude || defaultLocation.lat,
    lng: bike?.longitude || defaultLocation.lng,
  };

  // Wishlist functionality
  const handleWishlistClick = async (e) => {
    e.stopPropagation();
    setIsWishlistLoading(true);

    try {
      if (isFavorite) {
        await api.delete('/wishlist', {
          data: {
            wishable_type: "bike",
            wishable_id: bike.id.toString()
          }
        });
        setIsFavorite(false);
        setSnackbar({ open: true, message: 'Removed from wishlist', severity: 'info' });
      } else {
        await api.post('/wishlist', {
          wishable_type: "bike",
          wishable_id: bike.id
        });
        setIsFavorite(true);
        setSnackbar({ open: true, message: 'Added to wishlist', severity: 'success' });
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      setSnackbar({ open: true, message: 'Failed to update wishlist', severity: 'error' });
    } finally {
      setIsWishlistLoading(false);
    }
  };

  // Share functionality
  const handleShareClick = (e) => {
    e.stopPropagation();
    setShowShareModal(true);
  };

  const handleShareClose = () => {
    setShowShareModal(false);
  };

  const getCurrentUrl = () => {
    return window.location.href;
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Function to open Google Maps
  const openGoogleMaps = () => {
    const { lat, lng } = mapCenter;
    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15`;
    window.open(googleMapsUrl, '_blank');
  };

  // Zoom functionality
  const handleZoomIn = (imageSrc, index) => {
    setZoomedImageSrc(imageSrc);
    setShowZoom(true);
    
    if (mainSwiper && !mainSwiper.destroyed) {
      mainSwiper.slideToLoop(index);
    }
  };

  const handleZoomOut = () => {
    setShowZoom(false);
  };

  const handleZoomMouseMove = (e) => {
    if (!showZoom) return;
    
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  };

  const handleSlideChange = (swiper) => {
    const newIndex = swiper.realIndex;
    setActiveIndex(newIndex);

    if (thumbsSwiper && !thumbsSwiper.destroyed) {
      thumbsSwiper.slideToLoop(newIndex);
    }

    if (showZoom) {
      setZoomedImageSrc(images[newIndex]);
    }
  };

  if (!bike) {
    return <div className="text-center py-8">Bike not found</div>;
  }

  return (
    <>
      {/* Enquiry Modal */}
      {showEnquiryPopup && (
        <EnquiryForm onClose={() => setShowEnquiryPopup(false)} />
      )}

      <div className="">
        <div className="flex flex-col md:flex-row py-10">
          {/* Left Section - Images */}
          <div className="w-full md:w-1/2 p-2">
            <div className="flex flex-col-reverse md:flex-row gap-3">
              {/* Thumbnails */}
              {images.length > 0 && (
                <div className="md:flex flex-row md:flex-col space-y-2 mr-2 gap-2">
                  <Swiper
                    onSwiper={setThumbsSwiper}
                    slidesPerView={3}
                    spaceBetween={10}
                    direction={isMobile ? "horizontal" : "vertical"}
                    loop={true}
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
              )}

              {/* Main Image with Swiper */}
              <div className="flex max-w-[450px] h-[280px] relative">
                {images.length > 0 ? (
                  <Swiper
                    onSwiper={setMainSwiper}
                    slidesPerView={1}
                    spaceBetween={20}
                    loop={true}
                    thumbs={{
                      swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
                    }}
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
                            alt={`Bike view ${index + 1}`}
                            className="w-full h-[300px] object-cover"
                          />
                          <div className="absolute top-2 right-2 flex flex-col gap-2">
                            <IconButton
                              size="small"
                              onClick={handleShareClick}
                              className="bg-white bg-opacity-80 hover:bg-opacity-100"
                              sx={{ 
                                width: 36, 
                                height: 36,
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 255, 255, 1)',
                                }
                              }}
                            >
                              <ShareIcon sx={{ fontSize: 20, color: 'gray' }} />
                            </IconButton>

                            <IconButton
                              size="small"
                              onClick={handleWishlistClick}
                              disabled={isWishlistLoading}
                              className="bg-white bg-opacity-80 hover:bg-opacity-100"
                              sx={{ 
                                width: 36, 
                                height: 36,
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 255, 255, 1)',
                                }
                              }}
                            >
                              <FavoriteBorderIcon
                                sx={{ 
                                  fontSize: 20,
                                  color: isFavorite ? red[500] : 'gray'
                                }}
                              />
                            </IconButton>

                            <IconButton
                              size="small"
                              onClick={() => handleZoomIn(image, index)}
                              className="bg-white bg-opacity-80 hover:bg-opacity-100"
                              sx={{ 
                                width: 36, 
                                height: 36,
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 255, 255, 1)',
                                }
                              }}
                            >
                              <ZoomInIcon sx={{ fontSize: 20, color: 'gray' }} />
                            </IconButton>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <div className="w-full h-[300px] bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">No images available</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Section - Details */}
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <div className="p-4 rounded-lg shadow-lg bg-white w-full max-w-[440px]">
              {/* Seller profile section */}
              <div className="flex items-center mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300">
                  {bike.profile_image ? (
                    <img
                      src={bike.profile_image}
                      alt="Seller"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PersonIcon className="text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-lg">
                    {bike.vendor_name || "Seller"}
                  </h3>
                  <p className="text-sm text-gray-500">Owner</p>
                </div>
                <div className="ml-auto">
                  <Link to="/seller-profile" className="text-blue-600 text-sm font-medium cursor-pointer">
                    See Profile
                  </Link>
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
                    <p className="text-sm text-gray-500">{bike.city}</p>
                    <p className="font-semibold text-xl">{bike.district}</p>
                  </div>
                  <div className="ml-auto">
                    <div 
                      className="w-[150px] h-[150px] rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity duration-200 relative group"
                      onClick={openGoogleMaps}
                      title="Click to open in Google Maps"
                    >
                      <MapContainer
                        center={[mapCenter.lat, mapCenter.lng]}
                        zoom={13}
                        scrollWheelZoom={false}
                        className="w-[150px] h-[150px] rounded-[10px]"
                        style={{ height: "150px", width: "150px" }}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={[mapCenter.lat, mapCenter.lng]}>
                          <Popup>
                            {bike.brand} {bike.model} <br /> {bike.subcategory}
                          </Popup>
                        </Marker>
                      </MapContainer>

                      {/* Overlay with Google Maps icon */}
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="text-white text-center">
                          <svg className="w-8 h-8 mx-auto mb-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                          </svg>
                          <span className="text-xs">Open in Google Maps</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ad ID and Report Section */}
                <div className="flex justify-between items-center text-gray-600 pt-4 mt-4 border-t">
                  <div className="text-sm">
                    <span className="font-semibold">ADS ID:</span> {bike.unique_code}
                  </div>
                  <div className="flex items-center text-blue-600 cursor-pointer" aria-label="report">
                    <ReportProblemIcon fontSize="small" />
                    <span className="ml-1 text-sm">Report Ad</span>
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
                  {bike.title || `${bike.brand} ${bike.model}`}
                </h2>
                <div className="w-[fit-content] ml-4 bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center text-xs">
                  <VerifiedIcon fontSize="small" className="mr-1" />
                  VERIFIED SELLER
                </div>
              </div>

              <div className="flex items-center mt-2 mb-2">
                <p className="mr-4">
                  {bike.manufacturing_year} - {bike.kilometers_driven || 'N/A'} km
                </p>
                <div className="flex items-center">
                  <StarIcon className="text-orange-500" />
                  <span className="ml-1">{bike.average_rating || "4.5"}</span>
                </div>
              </div>

              <div className="flex items-center text-red-500 mt-4 gap-[10px]">
                <LocationOnIcon fontSize="small" />
                <p className="text-sm text-black">
                  {bike.city}, {bike.district}
                </p>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 flex flex-col md:items-center md:mt-[10px]">
              <div className="mt-1 md:mt-0">
                <h3 className="md:text-2xl text-[20px] font-bold md:text-center text-green-600">
                  ₹ {bike.price ? parseFloat(bike.price).toLocaleString() : "N/A"}
                </h3>
                <div className="flex mt-4 space-x-4 justify-center">
                  <button
                    onClick={() => setShowEnquiryPopup(true)}
                    className="bg-[#02487C] text-white px-6 py-3 rounded-[25px] cursor-pointer flex items-center justify-center flex-1"
                  >
                    <QuestionAnswerIcon fontSize="small" className="mr-2" />
                    Enquiry
                  </button>
                  <button
                    className="bg-[#02487C] text-white px-6 py-3 rounded-[25px] 
                  cursor-pointer flex items-center justify-center flex-1"
                    onClick={() =>
                      (window.location.href = `tel:${bike.mobile_number}`)
                    }
                  >
                    <CallIcon fontSize="small" className="mr-2" />
                    Call
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bike Description and Details */}
        <div className="p-4">
          <div className="flex flex-col md:flex-row md:items-stretch">
            {/* Left Column (65%) */}
            <div className="md:w-2/3 w-full md:pr-4 mb-4 md:mb-0">
              <div className="bg-white p-6 shadow-lg rounded-lg h-full border border-gray-200">
                {/* Upper section with icons and details */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-b border-[#E1E1E1] pb-4">
                  <div className="flex items-center space-x-2">
                    <TwoWheelerIcon className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">
                      {bike.engine_capacity || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <SpeedIcon className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">
                      {bike.kilometers_driven || 'N/A'} km
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <LocalGasStationIcon className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">
                      {bike.fuel_type || 'Petrol'}
                    </span>
                  </div>
                </div>

                {/* Middle section with owner, location, and date */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 border-b border-[#E1E1E1]">
                  <div className="flex items-center space-x-2">
                    <PersonIcon className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">
                      Owner {bike.owner_number || '1'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <LocationOnIcon className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">
                      {bike.city}, {bike.district}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CalendarTodayIcon className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">
                      {bike.manufacturing_year}
                    </span>
                  </div>
                </div>

                {/* Description Section */}
                <div className="pt-4">
                  <h3 className="text-lg font-bold mb-2">Description</h3>
                  <p className="text-gray-700 text-sm">
                    {bike.description || `This ${bike.manufacturing_year} ${bike.brand} ${bike.model} is in excellent condition. Well-maintained and ready for its next owner.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bike Specifications */}
        <div className="p-4 rounded-xl shadow-lg bg-white w-full mb-6">
          <h3 className="text-lg font-bold mb-4">Specifications</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm sm:text-base">
            <div className="grid grid-cols-2">
              <div className="flex gap-[15px] justify-between">
                <span>Brand </span>
                <span>:</span>
              </div>
              <span className="px-[10px]">{bike.brand}</span>
            </div>
            <div className="grid grid-cols-2">
              <div className="flex gap-[15px] justify-between">
                <span>Model </span>
                <span>:</span>
              </div>
              <span className="px-[10px]">{bike.model}</span>
            </div>
            <div className="grid grid-cols-2">
              <div className="flex gap-[15px] justify-between">
                <span>Year </span>
                <span>:</span>
              </div>
              <span className="px-[10px]">{bike.manufacturing_year}</span>
            </div>
            <div className="grid grid-cols-2">
              <div className="flex gap-[15px] justify-between">
                <span>Engine </span>
                <span>:</span>
              </div>
              <span className="px-[10px]">{bike.engine_capacity || 'N/A'}</span>
            </div>
            <div className="grid grid-cols-2">
              <div className="flex gap-[15px] justify-between">
                <span>Fuel Type </span>
                <span>:</span>
              </div>
              <span className="px-[10px]">{bike.fuel_type || 'Petrol'}</span>
            </div>
            <div className="grid grid-cols-2">
              <div className="flex gap-[15px] justify-between">
                <span>Subcategory </span>
                <span>:</span>
              </div>
              <span className="px-[10px]">{bike.subcategory}</span>
            </div>
            <div className="grid grid-cols-2">
              <div className="flex gap-[15px] justify-between">
                <span>Kilometers </span>
                <span>:</span>
              </div>
              <span className="px-[10px]">{bike.kilometers_driven || 'N/A'} km</span>
            </div>
            <div className="grid grid-cols-2">
              <div className="flex gap-[15px] justify-between">
                <span>Status</span>
                <span>:</span>
              </div>
              <span className="px-[10px]">{bike.status || 'Available'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reusable Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={handleShareClose}
        url={getCurrentUrl()}
        title={`Check out this ${bike.brand} ${bike.model} - ₹${bike.price ? parseFloat(bike.price).toLocaleString() : "N/A"}`}
        description={bike.description || `${bike.subcategory} in excellent condition`}
        modalTitle="Share this bike"
        showPlatforms={['whatsapp', 'facebook', 'twitter', 'instagram', 'telegram', 'linkedin']}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Zoom Modal */}
      {showZoom && images.length > 0 && (
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
            >
              <img
                src={zoomedImageSrc}
                alt="Zoomed bike view"
                className={`w-full h-full ${
                  isMobile ? "object-contain" : "object-cover"
                }`}
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  transition: "transform-origin 0.1s ease-out",
                }}
              />
            </div>

            {/* Thumbnail navigation in zoom view */}
            <div className="absolute bottom-4 left-0 right-0 px-4">
              <div className="overflow-x-auto pb-2 max-w-full scrollbar-hide">
                <div
                  className="flex space-x-2 justify-center md:justify-center min-w-max mx-auto"
                  style={{ scrollbarWidth: "none" }}
                >
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`w-12 h-12 md:w-16 md:h-16 rounded-md overflow-hidden cursor-pointer border-2 flex-shrink-0 ${
                        zoomedImageSrc === img
                          ? "border-blue-500"
                          : "border-gray-200"
                      }`}
                      onClick={() => {
                        setZoomedImageSrc(img);
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

export default BikeDetails;