import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import IMAGES from "@/utils/images.js";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  TwoWheelerOutlined,
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
import axios from "axios";
import BikeDetails from "./BikeDetails";
import L from "leaflet";
import { api } from "../../api/axios";
import ReportAdsModal from "./ReportAdsModal";
import DescriptionSkeleton from "./DescriptionSkelton";
import NotFoundMessage from "./NotFoundMessage";
import ErrorMessage from "./ErrorMessage";

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const BikeDescription = () => {
  const { slug } = useParams();
  const [bike, setBike] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

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
        const response = await api.get(`/gbike/${slug}`);
        setBike(response.data.data);
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

  if (!bike) return <NotFoundMessage/>;

  if (error) {
    return <ErrorMessage error={error} onRetry={fetchData} />;
  }

  // Get map coordinates - use Chennai as default if null
  const mapCenter = {
    lat: bike.latitude || defaultLocation.lat,
    lng: bike.longtitude || defaultLocation.lng, // Note: API uses 'longtitude' (typo)
  };

  // Function to open Google Maps in new tab
  const openGoogleMaps = () => {
    const { lat, lng } = mapCenter;
    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15`;
    window.open(googleMapsUrl, "_blank");
  };

  return (
    <>
      {/* Report Ads Modal */}
      <ReportAdsModal
        isOpen={showReportModal}
        onClose={handleCloseModal}
        adId={bike.id}
        adType={bike.form_type}
        adTitle={bike.property_name}
      />
      <BikeDetails bike={bike} />

      <div className="p-4">
        {/* Container for the two-column layout */}
        <div className="flex flex-col md:flex-row md:items-stretch">
          {/* Left Column (65%) */}
          <div className="md:w-2/3 w-full md:pr-4 mb-4 md:mb-0">
            <div className="bg-white p-6 shadow-lg rounded-lg h-full border border-gray-200">
              {/* Upper section with icons and details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-b border-[#E1E1E1] pb-4">
                {bike.engine_cc !== null ? (
                  <div className="flex items-center space-x-2">
                    <TwoWheelerOutlined className="text-black font-bold" />
                    <span className="text-sm font-medium text-gray-600">
                      {bike.engine_cc}
                    </span>
                  </div>
                ) : (
                  ""
                )}

                {bike.engine_cc !== null ? (
                  <div className="flex items-center space-x-2">
                    <SpeedOutlined className="text-black font-bold" />
                    <span className="text-sm font-medium text-gray-600">
                      {bike.kilometers} km
                    </span>
                  </div>
                ) : (
                  ""
                )}

                {bike.brand !== null ? (
                  <div className="flex items-center space-x-2">
                    <LocalGasStationOutlined className="text-black font-bold" />
                    <span className="text-sm font-medium text-gray-600">
                      {bike.brand}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <LocalGasStationOutlined className="text-black font-bold" />
                    <span className="text-sm font-medium text-gray-600">
                      {bike.brand_name}
                    </span>
                  </div>
                )}
              </div>

              {/* Middle section with owner, location, and date */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 border-b border-[#E1E1E1]">
                <div className="flex items-center space-x-2">
                  <PersonOutlined className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">
                    {bike.number_of_owner}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <LocationOnOutlined className="text-black font-bold" />
                  <span className="text-sm font-medium text-gray-600">
                    {bike.district}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CalendarTodayOutlined className="text-black font-bold" />
                  <span className="text-sm font-medium text-gray-600">
                    {bike.post_year}
                  </span>
                </div>
              </div>

              {/* Description Section */}
              <div className="pt-4">
                <h3 className="text-lg font-bold mb-2">Description</h3>
                <p className="text-gray-700 text-sm">{bike.description}</p>
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
                    src={bike.profile_image || IMAGES.placeholderprofile}
                    alt="Profile"
                  />
                  <div className="ml-3">
                    <h2 className="text-lg font-semibold">
                      {bike.vendor_name}
                    </h2>
                    <p className="text-sm text-gray-500">{bike.listed_by}</p>
                  </div>
                </div>
                <Link
                  to={`/seller-profile/${bike.vendor_id}`}
                  className="text-blue-600 font-semibold text-sm"
                >
                  See Profile
                </Link>
              </div>

              {/* Location Section */}
              <div className="my-4">
                <div className="flex flex-col justify-center items-center max-w-sm mx-auto gap-[10px]">
                  <MapContainer
                    // center={[
                    //   bike.latitude,
                    //   bike.latitude,
                    // ]}
                    center={[mapCenter.lat, mapCenter.lng]}
                    zoom={13}
                    scrollWheelZoom={false}
                    className="w-[150px] h-[150px] rounded-[10px]"
                    onClick={openGoogleMaps}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[mapCenter.lat, mapCenter.lng]}>
                      <Popup>
                        {bike.brand} {bike.model} <br />{" "}
                        {bike.subcategory || "bike"}
                      </Popup>
                    </Marker>
                  </MapContainer>
                  {/* Overlay with Google Maps icon */}
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

                  <div className="flex items-center space-x-2">
                    <LocationOnOutlined className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">
                      {bike.address}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ad ID and Report Section */}
              <div className="flex justify-between items-center text-gray-600 pt-4 border-t">
                <div className="text-sm">
                  <span className="font-semibold">ADS ID :</span>{" "}
                  {bike.unique_code}
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

      <div className="p-4 rounded-xl shadow-lg bg-white w-full mb-6">
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
            <span className="px-[10px]">{bike.post_year}</span>
          </div>

          {bike.engine_cc !== null ? (
            <div className="grid grid-cols-2">
              <div className="flex gap-[15px] justify-between">
                <span>Engine </span>
                <span>:</span>
              </div>
              <span className="px-[10px]">{bike.engine_cc}</span>
            </div>
          ) : (
            ""
          )}

          {bike.kilometers !== null ? (
            <div className="grid grid-cols-2">
              <div className="flex gap-[15px] justify-between">
                <span>Kilometer </span>
                <span>:</span>
              </div>
              <span className="px-[10px]">{bike.kilometers}</span>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default BikeDescription;
