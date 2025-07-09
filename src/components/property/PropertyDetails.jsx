import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import { IconButton, Snackbar, Alert } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ShareIcon from "@mui/icons-material/Share";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarIcon from "@mui/icons-material/Star";
import CallIcon from "@mui/icons-material/Call";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import VerifiedIcon from "@mui/icons-material/Verified";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import CloseIcon from "@mui/icons-material/Close";
import { red } from "@mui/material/colors";
import IMAGES from "../../utils/images.js";
import { useMediaQuery } from "react-responsive";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import EnquiryForm from "../../features/EnquiryForm.jsx";
import { Link } from "react-router-dom";
import { api } from "@/api/axios";
import ShareModal from "../../components/common/ShareModal"; // Import reusable ShareModal
import LoginFormModel from "../common/LoginFormModel.jsx";
import SignupFormModel from "../common/SignupFormModel.jsx";
import ForgotPassword from "../common/ForgotPassword.jsx";

const PropertyDetails = ({ property }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [isFavorite, setIsFavorite] = useState(property.is_wishlisted || false);
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
  const mainImageRef = useRef(null);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
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

  const images = property.image_url 
    ? (Array.isArray(property.image_url) ? property.image_url : [property.image_url])
    : dummyImages;

  // Map coordinates
  const mapCenter = {
    lat: property.latitude || defaultLocation.lat,
    lng: property.longtitude || defaultLocation.lng, // Note: API uses 'longtitude'
  };

  // Wishlist functionality
  // const handleWishlistClick = async (e) => {
  //   e.stopPropagation();
  //   setIsWishlistLoading(true);

  //   try {
  //     if (isFavorite) {
  //       // Remove from wishlist
  //       await api.delete('/wishlist', {
  //         data: {
  //           wishable_type: "property",
  //           wishable_id: property.id.toString()
  //         }
  //       });
  //       setIsFavorite(false);
  //       setSnackbar({ open: true, message: 'Removed from wishlist', severity: 'info' });
  //     } else {
  //       // Add to wishlist
  //       await api.post('/wishlist', {
  //         wishable_type: "property",
  //         wishable_id: property.id
  //       });
  //       setIsFavorite(true);
  //       setSnackbar({ open: true, message: 'Added to wishlist', severity: 'success' });
  //     }
  //   } catch (error) {
  //     console.error('Wishlist error:', error);
  //     setSnackbar({ open: true, message: 'Failed to update wishlist', severity: 'error' });
  //   } finally {
  //     setIsWishlistLoading(false);
  //   }
  // };

// Wishlist functionality with authentication check
const handleWishlistClick = async (e) => {
  e.stopPropagation();
  setIsWishlistLoading(true);

  try {
    if (isFavorite) {
      // Remove from wishlist
      await api.delete('/wishlist', {
        data: {
          wishable_type: "property",
          wishable_id: property.id.toString()
        }
      });
      setIsFavorite(false);
      setSnackbar({ open: true, message: 'Removed from wishlist', severity: 'info' });
    } else {
      // Add to wishlist
      await api.post('/wishlist', {
        wishable_type: "property",
        wishable_id: property.id
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

// Alternative approach with more detailed error handling
const handleWishlistClickDetailed = async (e) => {
  e.stopPropagation();
  setIsWishlistLoading(true);

  try {
    if (isFavorite) {
      // Remove from wishlist
      const response = await api.delete('/wishlist', {
        data: {
          wishable_type: "property",
          wishable_id: property.id.toString()
        }
      });
      
      setIsFavorite(false);
      setSnackbar({ 
        open: true, 
        message: response.data?.message || 'Removed from wishlist', 
        severity: 'info' 
      });
    } else {
      // Add to wishlist
      const response = await api.post('/wishlist', {
        wishable_type: "property",
        wishable_id: property.id
      });
      
      setIsFavorite(true);
      setSnackbar({ 
        open: true, 
        message: response.data?.message || 'Added to wishlist', 
        severity: 'success' 
      });
    }
  } catch (error) {
    console.error('Wishlist error:', error);
    
    // Handle different types of errors
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - user needs to login
          setSnackbar({ 
            open: true, 
            message: data?.message || 'Please login to manage your wishlist', 
            severity: 'warning' 
          });
          setLoginFormModel(true);
          break;
          
        case 403:
          // Forbidden - user doesn't have permission
          setSnackbar({ 
            open: true, 
            message: data?.message || 'You don\'t have permission to perform this action', 
            severity: 'error' 
          });
          break;
          
        case 404:
          // Not found - property might not exist
          setSnackbar({ 
            open: true, 
            message: data?.message || 'Property not found', 
            severity: 'error' 
          });
          break;
          
        case 422:
          // Validation error
          setSnackbar({ 
            open: true, 
            message: data?.message || 'Invalid data provided', 
            severity: 'error' 
          });
          break;
          
        case 429:
          // Rate limit exceeded
          setSnackbar({ 
            open: true, 
            message: data?.message || 'Too many requests. Please try again later.', 
            severity: 'warning' 
          });
          break;
          
        case 500:
          // Server error
          setSnackbar({ 
            open: true, 
            message: 'Server error. Please try again later.', 
            severity: 'error' 
          });
          break;
          
        default:
          // Other HTTP errors
          setSnackbar({ 
            open: true, 
            message: data?.message || 'Failed to update wishlist', 
            severity: 'error' 
          });
      }
    } else if (error.request) {
      // Network error - no response received
      setSnackbar({ 
        open: true, 
        message: 'Network error. Please check your connection and try again.', 
        severity: 'error' 
      });
    } else {
      // Other errors
      setSnackbar({ 
        open: true, 
        message: 'An unexpected error occurred. Please try again.', 
        severity: 'error' 
      });
    }
  } finally {
    setIsWishlistLoading(false);
  }
};

// Helper function to check authentication status
const checkAuthBeforeWishlist = () => {
  // Check if user is authenticated (adjust based on your auth system)
  const token = localStorage.getItem('authToken');
  const isLoggedIn = !!token; // or use your auth context: const { isAuthenticated } = useAuth();
  
  if (!isLoggedIn) {
    setSnackbar({ 
      open: true, 
      message: 'Please login to manage your wishlist', 
      severity: 'warning' 
    });
    setLoginFormModel(true);
    return false;
  }
  return true;
};

// Wishlist handler with pre-authentication check
const handleWishlistClickWithPreCheck = async (e) => {
  e.stopPropagation();
  
  // Check authentication before making API call
  if (!checkAuthBeforeWishlist()) {
    return;
  }
  
  setIsWishlistLoading(true);

  try {
    if (isFavorite) {
      // Remove from wishlist
      await api.delete('/wishlist', {
        data: {
          wishable_type: "property",
          wishable_id: property.id.toString()
        }
      });
      setIsFavorite(false);
      setSnackbar({ open: true, message: 'Removed from wishlist', severity: 'info' });
    } else {
      // Add to wishlist
      await api.post('/wishlist', {
        wishable_type: "property",
        wishable_id: property.id
      });
      setIsFavorite(true);
      setSnackbar({ open: true, message: 'Added to wishlist', severity: 'success' });
    }
  } catch (error) {
    console.error('Wishlist error:', error);
    
    if (error.response && error.response.status === 401) {
      // Even with pre-check, token might have expired
      setSnackbar({ 
        open: true, 
        message: 'Session expired. Please login again.', 
        severity: 'warning' 
      });
      setLoginFormModel(true);
      
      // Optional: Clear expired token
      localStorage.removeItem('authToken');
    } else {
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
    
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  };
  
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

   // Function to open Google Maps in new tab
  const openGoogleMaps = () => {
    const { lat, lng } = mapCenter;
    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15`;
    window.open(googleMapsUrl, '_blank');
  };

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
        <EnquiryForm
          onClose={() => {
            setShowEnquiryPopup(false);
          }}
          propertyData={property}
    enquirableType="property"
        />
      )}

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
                  autoplay={{ delay: 5000, disableOnInteraction: false }}
                  pagination={{ clickable: true }}
                  navigation={false}
                  modules={[Navigation, Thumbs]}
                  className="rounded-lg overflow-hidden max-h-[280px]"
                >
                  {images.map((thumb, index) => (
                    <SwiperSlide
                      key={index}
                      style={{
                        height: "40px !important",
                        maxHeight: "40px !important ",
                      }}
                      className={`w-24 h-16 rounded overflow-hidden cursor-pointer  ${
                        activeIndex === index
                          ? "border-2 border-gray-200 rounded-[10px]"
                          : "border-transparent"
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
                  thumbs={{
                    swiper:
                      thumbsSwiper && !thumbsSwiper.destroyed
                        ? thumbsSwiper
                        : null,
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
                          alt={`Property view ${index + 1}`}
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
              </div>
            </div>
          </div>

          {/* Right Section - Details */}
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <div className="p-4 rounded-lg shadow-lg bg-white w-full max-w-[440px]">
              {/* Owner profile section */}
              <div className="flex items-center mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={property.profile_image || IMAGES.placeholderprofile}
                    alt="Owner"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-lg">
                    {property.vendor_name}
                  </h3>
                  <p className="text-sm text-gray-500">Owner</p>
                </div>
                <div className="ml-auto">
                  <Link
                    to= {`/seller-profile/${property.vendor_id}`}
                    className="text-blue-600 text-sm font-medium cursor-pointer"
                  >
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
                    <p className="text-gray-500 text-sm">{property.district}</p>
                    <p className="font-semibold text-xl ">{property.state}</p>

                  </div>
                  <div className="ml-auto">
                    <div className="w-[150px] h-[150px] rounded-lg overflow-hidden cursor-pointer"
                     onClick={openGoogleMaps}
                    >
                      <MapContainer
                        center={[mapCenter.lat, mapCenter.lng]}
                        zoom={13}
                        scrollWheelZoom={false}
                        className="w-[150px] h-[150px] rounded-[10px]"
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={[mapCenter.lat, mapCenter.lng]}>
                          <Popup>
                            {property.subcategory} <br /> {property.city}
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
                  {property.property_name}
                </h2>
                <div className="w-[fit-content] ml-4 bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center text-xs">
                  <VerifiedIcon fontSize="small" className="mr-1" />
                  VERIFIED SELLER
                </div>
              </div>

             
                <div className="flex items-center mt-2 mb-2">
                   {property.bhk && (<p className="mr-4">({property.bhk})</p> )}
                  <p className="mr-4">{property.post_year}</p>
                  <div className="flex items-center">
                    <StarIcon className="text-orange-500" />
                    <span className="ml-1">
                      {property.total_ratings || "4.5"}
                    </span>
                  </div>
                </div>
             

              <div className="flex items-center text-red-500 mt-4 gap-[10px]">
                <LocationOnIcon fontSize="small" />
                <p className="text-sm text-black">
                  {property.district}, {property.state}
                </p>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col md:items-center md:mt-[10px]">
              <div className="mt-1 md:mt-0">
                <h3 className="md:text-2xl text-[20px] font-bold md:text-center">
                  ₹ {property.amount}
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
                      (window.location.href = `tel:${property.mobile_number}`)
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
        title={`Check out this ${property.property_name} in ${property.city} - ₹${property.amount}`}
        description={property.description || `Beautiful ${property.bhk} property in ${property.city}`}
        modalTitle="Share this property"
        showPlatforms={['whatsapp','pinterest', 'twitter', 'instagram', 'facebook', 'telegram', 'linkedin',]}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
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
      {showZoom && (
        <div className="fixed inset-0 bg-[#000000c4] bg-opacity-40 z-999 flex items-center justify-center p-4">
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
                alt="Zoomed property view"
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

export default PropertyDetails;