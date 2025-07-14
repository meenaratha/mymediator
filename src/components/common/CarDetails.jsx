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
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";
import CallIcon from "@mui/icons-material/Call";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import VerifiedIcon from "@mui/icons-material/Verified";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import CloseIcon from "@mui/icons-material/Close";
import SpeedIcon from "@mui/icons-material/Speed";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
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
import IMAGES from "../../utils/images.js";
import SignupFormModel from "./SignupFormModel.jsx";
import LoginFormModel from "./LoginFormModel.jsx";

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const CarDetails = ({ car }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [isFavorite, setIsFavorite] = useState(car?.wishlist || false);
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
  const [loginFormModel, setLoginFormModel] = useState(false);
  const [signupFormModel, setSignupFormModel] = useState(false);
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);

  // Default Chennai coordinates
  const defaultLocation = { lat: 13.0827, lng: 80.2707 };

  // Prepare images - handle both single image and array, fallback to dummy images
  const dummyImages = [
    IMAGES.placeholderimg,
    IMAGES.placeholderimg,
    IMAGES.placeholderimg,
    IMAGES.placeholderimg,
    IMAGES.placeholderimg,
    IMAGES.placeholderimg,
    IMAGES.placeholderimg,
  ];

  // Prepare images from API response
  const images = car?.image_url 
    ? (Array.isArray(car.image_url) ? car.image_url : [car.image_url])
    : dummyImages;

  // Get map coordinates
  const mapCenter = {
    lat: car?.latitude || defaultLocation.lat,
    lng: car?.longitude || defaultLocation.lng,
  };

  // Wishlist functionality
  const handleWishlistClick = async (e) => {
    e.stopPropagation();
    setIsWishlistLoading(true);

    try {
      if (isFavorite) {
        await api.delete('/wishlist', {
          data: {
            wishable_type: "car",
            wishable_id: car.id.toString()
          }
        });
        setIsFavorite(false);
        setSnackbar({ open: true, message: 'Removed from wishlist', severity: 'info' });
      } else {
        await api.post('/wishlist', {
          wishable_type: "car",
          wishable_id: car.id
        });
        setIsFavorite(true);
        setSnackbar({ open: true, message: 'Added to wishlist', severity: 'success' });
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      // Check if it's an authentication error (401 Unauthorized)
    if (error.response && error.response.status === 401) {
      // User is not authenticated, show login modal
      setSnackbar({ 
        open: true, 
        message: 'Please login to add items to wishlist', 
        severity: 'warning' 
      });
      
      // Show login modal
      setLoginFormModel(true);
      
      // Optional: You can also close any other modals that might be open
      // setSignupFormModel(false);
      // setForgotPasswordModal(false);
    } else {
      // Other errors (network, server error, etc.)
      const errorMessage = error.response?.data?.message || 'Failed to update wishlist';
      setSnackbar({ 
        open: true, 
        message: errorMessage, 
        severity: 'error' 
      });
    }
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

  if (!car) {
    return <div className="text-center py-8">Car not found</div>;
  }

  return (
    <>
    {loginFormModel && (
  <LoginFormModel
    setSignupFormModel={setSignupFormModel}
    setLoginFormModel={setLoginFormModel}
    setForgotPasswordModal={setForgotPasswordModal}
  />
)}

{signupFormModel && (
  <SignupFormModel
   setSignupFormModel={setSignupFormModel}
    setLoginFormModel={setLoginFormModel}
    setForgotPasswordModal={setForgotPasswordModal}
  />
)}
      {/* Enquiry Modal */}
      {showEnquiryPopup && (
        <EnquiryForm onClose={() => setShowEnquiryPopup(false)}
          propertyData={car}
    enquirableType={car.form_type}/>
      
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
                            alt={`Car view ${index + 1}`}
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
                             {isFavorite ? (
                              <FavoriteIcon
                                sx={{ 
                                  fontSize: 20,
                                  color: red[500]
                                }}
                              />
                            ) : (
                              <FavoriteBorderIcon
                                sx={{ 
                                  fontSize: 20,
                                  color: 'gray'
                                }}
                              />
                            )}
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
                  {car.profile_image ? (
                    <img
                      src={car.profile_image || IMAGES.placeholderprofile}
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
                    {car.vendor_name || "Seller"}
                  </h3>
                  <p className="text-sm text-gray-500">{car.listed_by}</p>
                </div>
                <div className="ml-auto">
                  <Link 
                 to= {`/seller-profile/${car.vendor_id}`}
                  className="text-blue-600 text-sm font-medium cursor-pointer">
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
                    <p className="text-sm text-gray-500">{car.district}</p>
                    <p className="font-semibold text-xl">{car.state}</p>
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
                            {car.brand} {car.model} <br /> {car.subcategory || 'Car'}
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

               
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="w-full md:w-1/2">
              <div className="flex items-center py-2 flex-wrap gap-4">
                <h2 className="md:text-2xl text-[20px] font-bold">
                  {car.title || `${car.brand} ${car.model}`}
                </h2>
                <div className="w-[fit-content] ml-4 bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center text-xs">
                  <VerifiedIcon fontSize="small" className="mr-1" />
                  VERIFIED SELLER
                </div>
              </div>

              <div className="flex items-center mt-2 mb-2">
                <p className="mr-4">
                  { car.year} - {car.kilometers } km
                </p>
                

                 {car.total_ratings !== null ? (
                  <div className="flex items-center">
                    <StarIcon className="text-orange-500" />
                    <span className="ml-1">{car.total_ratings}</span>
                  </div>
                ) : (
                  ""
                )}
              </div>

              <div className="flex items-center text-red-500 mt-4 gap-[10px]">
                <LocationOnIcon fontSize="small" />
                <p className="text-sm text-black">
                  {car.district} {car.state},
                </p>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 flex flex-col md:items-center md:mt-[10px]">
              <div className="mt-1 md:mt-0">
                <h3 className="md:text-2xl text-[20px] font-bold md:text-center text-black">
                  ₹ {car.price ? parseFloat(car.price).toLocaleString() : "N/A"}
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
                      (window.location.href = `tel:${car.mobile_number}`)
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

       
      </div>

      {/* Reusable Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={handleShareClose}
        url={getCurrentUrl()}
        title={`Check out this ${car.brand} ${car.model} - ₹${car.price ? parseFloat(car.price).toLocaleString() : "N/A"}`}
        description={car.description || `${car.subcategory || 'Car'} in excellent condition`}
        modalTitle="Share this car"
        showPlatforms={['whatsapp', 'facebook', 'twitter', 'instagram', 'telegram', ]}
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
        <div className="fixed inset-0 bg-black bg-opacity-75 z-999 flex items-center justify-center p-4">
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
                alt="Zoomed car view"
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

export default CarDetails;