import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import IMAGES from "@/utils/images.js";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  DirectionsCarOutlined,
  SpeedOutlined,
  LocalGasStationOutlined,
  CalendarTodayOutlined,
  BuildOutlined,
  ColorLensOutlined,
  PersonOutlined,
  LocationOnOutlined,
  ReportProblemOutlined,
  CheckCircleOutline,
} from "@mui/icons-material";
import CarDetails from "./CarDetails";
import L from "leaflet";
import { api } from "../../api/axios";
import ReportAdsModal from "./ReportAdsModal";
import DescriptionSkeleton from "./DescriptionSkelton";
import NotFoundMessage from "./NotFoundMessage";
import { useAuth } from "../../auth/AuthContext";
import PasswordResetModel from "./PasswordResetModel";
import OTPVerificationModal from "./OTPVerificationModal";
import ForgotPassword from "./ForgotPassword";
import SignupFormModel from "./SignupFormModel";
import LoginFormModel from "./LoginFormModel";

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const CarDescription = () => {
  const { slug } = useParams();
  const [car, setCar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

   const [showReportModal, setShowReportModal] = useState(false);
  const { isAuthenticated, user, logout, loading } = useAuth(); // Get auth state
   const [loginFormModel, setLoginFormModel] = useState(false);
     const [signupFormModel, setSignupFormModel] = useState(false);
    const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  
     const [otpVerificationModal, setOtpVerificationModal] = useState(false);
      const [passwordResetModel, setPasswordResetModel] = useState(false);
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
        const response = await api.get(`/gcar/${slug}`);
        setCar(response.data.data);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug]);
  
  if (isLoading) {
    return (
      <DescriptionSkeleton/>
    );
  }

  if (!car) return <NotFoundMessage/>;

  if (error) {
    return <ErrorMessage error={error} onRetry={fetchData} />;
  }

  // Get map coordinates - use Chennai as default if null
  const mapCenter = {
    lat: car.latitude || defaultLocation.lat,
    lng: car.longitude || defaultLocation.lng,
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



       {forgotPasswordModal && (
        <ForgotPassword
          setForgotPasswordModal={setForgotPasswordModal}
          setLoginFormModel={setLoginFormModel}
          setOtpVerificationModal={setOtpVerificationModal}
        />
      )}

      {otpVerificationModal && (
        <OTPVerificationModal
          setOtpVerificationModal={setOtpVerificationModal}
          setForgotPasswordModal={setForgotPasswordModal}
          setPasswordResetModel={setPasswordResetModel}
        />
      )}

      {passwordResetModel && (
        <PasswordResetModel
          setOtpVerificationModal={setOtpVerificationModal}
          setPasswordResetModel={setPasswordResetModel}
          setLoginFormModel={setLoginFormModel}
        />
      )}

      {/* Report Ads Modal */}
      <ReportAdsModal
        isOpen={showReportModal}
        onClose={handleCloseModal}
        adId={car.id}
        adType={car.form_type}
        adTitle={car.title}
      />

      <CarDetails car={car} />

      <div className="p-4">
        {/* Container for the two-column layout */}
        <div className="flex flex-col md:flex-row md:items-stretch">
          {/* Left Column (65%) */}
          <div className="md:w-2/3 w-full md:pr-4 mb-4 md:mb-0">
            <div className="bg-white p-6 shadow-lg rounded-lg h-full border border-gray-200">
              {/* Upper section with icons and details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-b border-[#E1E1E1] pb-4">
                <div className="flex items-center space-x-2">
                  <DirectionsCarOutlined className="text-black font-bold" />
                  <span className="text-sm font-medium text-gray-600">
                    {car.transmission}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <SpeedOutlined className="text-black font-bold" />
                  <span className="text-sm font-medium text-gray-600">
                    {car.kilometers} km
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <LocalGasStationOutlined className="text-black font-bold" />
                  <span className="text-sm font-medium text-gray-600">
                    {car.fuel_type || car.fuelType || "Petrol"}
                  </span>
                </div>
              </div>

              {/* Middle section with owner, location, and date */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 border-b border-[#E1E1E1]">
                <div className="flex items-center space-x-2">
                  <PersonOutlined className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">
                    {car.number_of_owner}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <LocationOnOutlined className="text-black font-bold" />
                  <span className="text-sm font-medium text-gray-600">
                    {car.district} ,{car.state},
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CalendarTodayOutlined className="text-black font-bold" />
                  <span className="text-sm font-medium text-gray-600">
                    {car.post_year}
                  </span>
                </div>
              </div>

              {/* Description Section */}
              <div className="pt-4">
                <h3 className="text-lg font-bold mb-2">Description</h3>
                <p className="text-gray-700 text-sm">
                  {car.description ||
                    `This ${car.year} ${car.brand} ${car.model} is in excellent condition. Well-maintained and ready for its next owner.`}
                </p>
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
                    src={car.profile_image || IMAGES.placeholderprofile}
                    alt="Profile"
                  />
                  <div className="ml-3">
                    <h2 className="text-lg font-semibold">
                      {car.vendor_name || "Car Owner"}
                    </h2>
                    <p className="text-sm text-gray-500">{car.listed_by}</p>
                  </div>
                </div>
                <div
               

                  onClick={() => {
    if (!isAuthenticated) {
      setLoginFormModel(true);
    } else {
      window.location.href = `/seller-profile/${car.vendor_id}`;
    }
  }}
                  className="text-blue-600 font-semibold text-sm"
                >
                  See Profile
                </div>
              </div>

              {/* Location Section */}
              <div className="my-4">
                <div className="flex flex-col justify-center items-center max-w-sm mx-auto gap-[10px]">
                  <MapContainer
                    center={[mapCenter.lat, mapCenter.lng]}
                    zoom={13}
                    scrollWheelZoom={false}
                    className="w-[150px] h-[150px] rounded-[10px] "
                    onClick={openGoogleMaps}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[mapCenter.lat, mapCenter.lng]}>
                      <Popup>
                        {car.brand} {car.model} <br />{" "}
                        {car.manufacturing_year || car.year}
                      </Popup>
                    </Marker>
                  </MapContainer>

                  <div className="flex items-center space-x-2">
                    <LocationOnOutlined className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">
                      {car.city}, {car.district}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ad ID and Report Section */}
              <div className="flex justify-between items-center text-gray-600 pt-4 border-t">
                <div className="text-sm">
                  <span className="font-semibold">ADS ID :</span>{" "}
                  {car.unique_code || car.id}
                </div>
                <div
                  onClick={handleReportClick}
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

      {/* Car Specifications */}
      <div className="p-4 rounded-xl shadow-lg bg-white w-full mb-6">
        <h3 className="text-lg font-bold mb-4">Car Specifications</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm sm:text-base">
          <div className="grid grid-cols-2">
            <div className="flex gap-[15px] justify-between">
              <span>Brand </span>
              <span>:</span>
            </div>
            <span className="px-[10px]">{car.brand}</span>
          </div>
          <div className="grid grid-cols-2">
            <div className="flex gap-[15px] justify-between">
              <span>Model </span>
              <span>:</span>
            </div>
            <span className="px-[10px]">{car.model}</span>
          </div>
          <div className="grid grid-cols-2">
            <div className="flex gap-[15px] justify-between">
              <span>Year </span>
              <span>:</span>
            </div>
            <span className="px-[10px]">{car.post_year}</span>
          </div>

          <div className="grid grid-cols-2">
            <div className="flex gap-[15px] justify-between">
              <span>Fuel Type </span>
              <span>:</span>
            </div>
            <span className="px-[10px]">
              {car.fuel_type || car.fuelType || "Petrol"}
            </span>
          </div>
          <div className="grid grid-cols-2">
            <div className="flex gap-[15px] justify-between">
              <span>Transmission </span>
              <span>:</span>
            </div>
            <span className="px-[10px]">{car.transmission || "Manual"}</span>
          </div>
          <div className="grid grid-cols-2">
            <div className="flex gap-[15px] justify-between">
              <span>Kilometers </span>
              <span>:</span>
            </div>
            <span className="px-[10px]">{car.kilometers || "N/A"} km</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default CarDescription;