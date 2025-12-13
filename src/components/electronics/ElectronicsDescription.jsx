import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import IMAGES from "@/utils/images.js";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  TvOutlined,
  MemoryOutlined,
  StorageOutlined,
  BatteryFullOutlined,
  CalendarTodayOutlined,
  PersonOutlined,
  LocationOnOutlined,
  ReportProblemOutlined,
  ScreenRotationOutlined,
  PhoneAndroidOutlined,
  ComputerOutlined
} from "@mui/icons-material";
import { api } from "@/api/axios";
import ElectronicsDetails from "./ElectronicsDetails";
import ReportAdsModal from "../common/ReportAdsModal";

import DescriptionSkeleton from "../common/DescriptionSkelton";
import { ErrorMessage } from "formik";
import { useAuth } from "../../auth/AuthContext";
import PasswordResetModel from "../common/PasswordResetModel";
import OTPVerificationModal from "../common/OTPVerificationModal";
import ForgotPassword from "../common/ForgotPassword";
import SignupFormModel from "../common/SignupFormModel";
import LoginFormModel from "../common/LoginFormModel";

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ElectronicsDescription = () => {
  const { slug } = useParams();
  const [electronics, setElectronics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

     const [showReportModal, setShowReportModal] = useState(false);
   const { isAuthenticated, user, logout, loading } = useAuth(); // Get auth state
   const [loginFormModel, setLoginFormModel] = useState(false);
     const [signupFormModel, setSignupFormModel] = useState(false);
    const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  
     const [otpVerificationModal, setOtpVerificationModal] = useState(false);
      const [passwordResetModel, setPasswordResetModel] = useState(false);
          const [forgotPhone, setForgotPhone] = useState("");
      
   const handleReportClick = () => {
    setShowReportModal(true);
  };

  const handleCloseModal = () => {
    setShowReportModal(false);
  };

  // Default Chennai coordinates
  const defaultLocation = { lat: 13.0827, lng: 80.2707 };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/gelectronics/${slug}`);
        setElectronics(response.data.data);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (isLoading) {
    return <DescriptionSkeleton/>;
  }

  if (!electronics) return  <NotFoundMessage/>;

  if (error) {
    return <ErrorMessage error={error} onRetry={fetchData} />;
  }

  // Get map coordinates - use Chennai as default if null
  const mapCenter = {
    lat: electronics.latitude || defaultLocation.lat,
    lng: electronics.longitude || defaultLocation.lng,
  };

  // Function to open Google Maps in new tab
  const openGoogleMaps = () => {
    const { lat, lng } = mapCenter;
    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15`;
    window.open(googleMapsUrl, '_blank');
  };

  // Get appropriate icon based on subcategory
  const getCategoryIcon = () => {
    switch (electronics.subcategory?.toLowerCase()) {
      case 'tv':
        return <TvOutlined className="text-black font-bold" />;
      case 'laptop':
      case 'computer':
        return <ComputerOutlined className="text-black font-bold" />;
      case 'mobile':
      case 'phone':
        return <PhoneAndroidOutlined className="text-black font-bold" />;
      default:
        return <TvOutlined className="text-black font-bold" />;
    }
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



       {forgotPasswordModal && (
        <ForgotPassword
          setForgotPasswordModal={setForgotPasswordModal}
          setLoginFormModel={setLoginFormModel}
          setOtpVerificationModal={setOtpVerificationModal}
           setForgotPhone={setForgotPhone}
        />
      )}

      {otpVerificationModal && (
        <OTPVerificationModal
          setOtpVerificationModal={setOtpVerificationModal}
          setForgotPasswordModal={setForgotPasswordModal}
          setPasswordResetModel={setPasswordResetModel}
          phone={forgotPhone} 
        />
      )}

      {passwordResetModel && (
        <PasswordResetModel
          setOtpVerificationModal={setOtpVerificationModal}
          setPasswordResetModel={setPasswordResetModel}
          setLoginFormModel={setLoginFormModel}
            phone={forgotPhone}
        />
      )}


      {/* Report Ads Modal */}
      <ReportAdsModal
        isOpen={showReportModal}
        onClose={handleCloseModal}
        adId={electronics.id}
        adType={electronics.form_type}
        adTitle={electronics.title}
      />

      <ElectronicsDetails electronics={electronics} />

      <div className="p-4">
        {/* Container for the two-column layout */}
        <div className="flex flex-col md:flex-row md:items-stretch">
          {/* Left Column (65%) */}
          <div className="md:w-2/3 w-full md:pr-4 mb-4 md:mb-0">
            <div className="bg-white p-6 shadow-lg rounded-lg h-full border border-gray-200">
              {/* Description Section */}
              <div className="mb-4">
                <h3 className="text-lg font-bold mb-2">Description</h3>
                <p className="text-gray-700 text-sm">
                  {electronics.description || "No description available."}
                </p>
              </div>

              {/* Key Specs in Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-[#E1E1E1]">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon()}
                  <div className="text-sm">
                    <span className="font-medium text-gray-600">Brand:</span>
                    <div className="text-gray-700">{electronics.brand}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MemoryOutlined className="text-black font-bold" />
                  <div className="text-sm">
                    <span className="font-medium text-gray-600">Model:</span>
                    <div className="text-gray-700">{electronics.model}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <StorageOutlined className="text-black font-bold" />
                  <div className="text-sm">
                    <span className="font-medium text-gray-600">Category:</span>
                    <div className="text-gray-700">
                      {electronics.subcategory}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <ScreenRotationOutlined className="text-black font-bold" />
                  <div className="text-sm">
                    <span className="font-medium text-gray-600">Price:</span>
                    <div className="text-gray-700">₹ {electronics.price}</div>
                  </div>
                </div>
              </div>

              {/* Features and Specifications */}
              {electronics.features && (
                <div className="py-4 border-b border-[#E1E1E1]">
                  <h4 className="font-semibold text-gray-600 mb-2">
                    Features:
                  </h4>
                  <p className="text-gray-700 text-sm">
                    {electronics.features}
                  </p>
                </div>
              )}

              {electronics.specifications && (
                <div className="pt-4">
                  <h4 className="font-semibold text-gray-600 mb-2">
                    Specifications:
                  </h4>
                  <p className="text-gray-700 text-sm">
                    {electronics.specifications}
                  </p>
                </div>
              )}

              {/* Location and Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 border-t border-[#E1E1E1] mt-4">
                <div className="flex items-center space-x-2">
                  <PersonOutlined className="text-black font-bold" />
                  <div className="text-sm">
                    <span className="font-medium text-gray-600">Status:</span>
                    <div className="text-gray-700 capitalize">
                      {electronics.status}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <LocationOnOutlined className="text-black font-bold" />
                  <div className="text-sm">
                    <span className="font-medium text-gray-600">Location:</span>
                    <div className="text-gray-700">
                      {" "}
                      {electronics.district},{electronics.state}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (35%) */}
          <div className="md:w-1/3 w-full">
            <div className="bg-white p-6 shadow-lg rounded-lg h-full">
              {/* Profile Section */}
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center">
                  <img
                    className="w-10 h-10 rounded-full object-cover"
                    src={electronics.profile_image || IMAGES.placeholderprofile}
                    alt="Profile"
                  />
                  <div className="ml-3">
                    <h2 className="text-lg font-semibold">{electronics.vendor_name}</h2>
                    <p className="text-sm text-gray-500">{electronics.listed_by}</p>
                  </div>
                </div>
                <div
                     onClick={() => {
    if (!isAuthenticated) {
      setLoginFormModel(true);
    } else {
      window.location.href = `/seller-profile/${electronics.vendor_id}`;
    }
  }}
                    className="text-blue-600 text-sm font-medium cursor-pointer"
                  >
                    See Profile
                  </div>
              </div>

              {/* Location Section with Clickable Map */}
              <div className="my-4">
                <div className="flex flex-col justify-center items-center max-w-sm mx-auto gap-[10px]">
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
                          {electronics.brand} {electronics.model} <br />{" "}
                          {electronics.subcategory}
                        </Popup>
                      </Marker>
                    </MapContainer>

                    {/* Overlay with Google Maps icon - appears on hover */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="text-white text-center">
                        <svg
                          className="w-8 h-8 mx-auto mb-1"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        <span className="text-xs">Open in Google Maps</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <LocationOnOutlined className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">
                      {electronics.district}, {electronics.state}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ad ID and Report Section */}
              <div className="flex justify-between items-center text-gray-600 pt-4 border-t">
                <div className="text-sm">
                  <span className="font-semibold">ADS ID :</span>{" "}
                  {electronics.unique_code}
                </div>
                <div
                    onClick={() => {
    if (!isAuthenticated) {
      setLoginFormModel(true);
    } else {
      handleReportClick()
    }
  }}
                  className="flex items-center text-blue-600 cursor-pointer"
                  aria-label="report"
                >
                  <ReportProblemOutlined fontSize="small" />
                  <span className="ml-1 text-sm">Report Ad</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Specifications Table */}
      <div className="p-4 rounded-xl shadow-lg bg-white w-full mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm sm:text-base">
          {electronics.brand && (
            <div className="grid grid-cols-2">
              <div className="flex gap-[15px] justify-between">
                <span>Brand </span>
                <span>:</span>
              </div>
              <span className="px-[10px]">{electronics.brand}</span>
            </div>
          )}

          {electronics.model && (
            <div className="grid grid-cols-2">
              <div className="flex gap-[15px] justify-between">
                <span>Model </span>
                <span>:</span>
              </div>
              <span className="px-[10px]">{electronics.model}</span>
            </div>
          )}

          {electronics.subcategory && (
            <div className="grid grid-cols-2">
              <div className="flex gap-[15px] justify-between">
                <span>Category </span>
                <span>:</span>
              </div>
              <span className="px-[10px]">{electronics.subcategory}</span>
            </div>
          )}

          {electronics.state && (
            <div className="grid grid-cols-2">
              <div className="flex gap-[15px] justify-between">
                <span>State </span>
                <span>:</span>
              </div>
              <span className="px-[10px]">{electronics.state}</span>
            </div>
          )}

          {electronics.district && (
            <div className="grid grid-cols-2">
              <div className="flex gap-[15px] justify-between">
                <span>District </span>
                <span>:</span>
              </div>
              <span className="px-[10px]">{electronics.district}</span>
            </div>
          )}

          {electronics.view_count && (
            <div className="grid grid-cols-2">
              <div className="flex gap-[15px] justify-between">
                <span>Views </span>
                <span>:</span>
              </div>
              <span className="px-[10px]">{electronics.view_count}</span>
            </div>
          )}

          {electronics.status && (
            <div className="grid grid-cols-2">
              <div className="flex gap-[15px] justify-between">
                <span>Status </span>
                <span>:</span>
              </div>
              <span className="px-[10px] capitalize">{electronics.status}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ElectronicsDescription;