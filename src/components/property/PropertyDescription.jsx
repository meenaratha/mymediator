import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import IMAGES from "@/utils/images.js";
import {
  Home,
  Bathtub,
  LocalParking,
  Build,
  Layers,
  CalendarToday,
} from "@mui/icons-material";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CompassCalibrationOutlinedIcon from "@mui/icons-material/CompassCalibrationOutlined";
import BedOutlinedIcon from "@mui/icons-material/BedOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ReportIcon from "@mui/icons-material/Report";
import { api } from "@/api/axios";
import PropertyDetails from "./PropertyDetails";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import ReportAdsModal from "../common/ReportAdsModal";
import axios from "axios";
import DescriptionSkeleton from "../common/DescriptionSkelton";

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const PropertyDescription = () => {
  const { slug } = useParams();
  const [property, setProperty] = useState(null);
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
        const response = await api.get(`/properties/${slug}`);    
        setProperty(response.data.data);
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


  if (!property) return  <NotFoundMessage/>;

  if (error) {
    return <ErrorMessage error={error} onRetry={fetchData} />;
  }

  // Get map coordinates - use Chennai as default if null
  const mapCenter = {
    lat: property.latitude || defaultLocation.lat,
    lng: property.longtitude || defaultLocation.lng, // Note: API uses 'longtitude' (typo)
  };


   // Function to open Google Maps in new tab
  const openGoogleMaps = () => {
    const { lat, lng } = mapCenter;
    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15`;
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <>

 {/* Report Ads Modal */}
      <ReportAdsModal
        isOpen={showReportModal}
        onClose={handleCloseModal}
        adId={property.id}
        adType={ property.form_type }
        adTitle={property.property_name}
      />


      <PropertyDetails property={property} />

      <div className="p-4">
        {/* Container for the two-column layout */}
        <div className="flex flex-col md:flex-row md:items-stretch">
          {/* Left Column (65%) */}
          <div className="md:w-2/3 w-full md:pr-4 mb-4 md:mb-0">
            <div className="bg-white p-6 shadow-lg rounded-lg h-full border border-gray-200">
              {/* Upper section with icons and details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-b border-[#E1E1E1] pb-4">
                {property.super_builtup_area && (
                  <div className="flex items-center space-x-2">
                    <HomeOutlinedIcon className="text-black font-bold" />
                    <span className="text-sm font-medium text-gray-600">
                      {property.super_builtup_area} Sq. Ft
                    </span>
                  </div>
                )}

                {property.plot_area && (
                  <div className="flex items-center space-x-2">
                    <HomeOutlinedIcon className="text-black font-bold" />
                    <span className="text-sm font-medium text-gray-600">
                      {property.plot_area} 
                    </span>
                  </div>
                )}


                {property.building_direction && (
                  <div className="flex items-center space-x-2">
                    <CompassCalibrationOutlinedIcon className="ttext-black font-bold" />
                    <span className="text-sm font-medium text-gray-600">
                      {property.building_direction}
                    </span>
                  </div>
                )}

                {property.bhk && (
                  <div className="flex items-center space-x-2">
                    <BedOutlinedIcon className="text-black font-bold" />
                    <span className="text-sm font-medium text-gray-600">
                      {property.bhk}
                    </span>
                  </div>
                )}
              </div>

              {/* Middle section with owner, location, and date */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 border-b border-[#E1E1E1]">
                <div className="flex items-center space-x-2">
                  <PersonOutlinedIcon className="text-black font-bold" />
                  <span className="text-sm font-medium text-gray-600">
                    Owner | 1ST
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <LocationOnOutlinedIcon className="text-black font-bold" />
                  <span className="text-sm font-medium text-gray-600">
                    {property.district}, {property.state}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CalendarTodayOutlinedIcon className="text-black font-bold" />
                  <span className="text-sm font-medium text-gray-600">
                    {property.post_date}
                  </span>
                </div>
              </div>

              {/* Description Section */}
              <div className="pt-4">
                <h3 className="text-lg font-bold mb-2">Description</h3>
                <p className="text-gray-700 text-sm">{property.description}</p>
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
                    src={property.profile_image || IMAGES.placeholderprofile}
                    alt="Profile"
                  />
                  <div className="ml-3">
                    <h2 className="text-lg font-semibold">{property.vendor_name}</h2>
                    <p className="text-sm text-gray-500">{property.listed_by}</p>
                  </div>
                </div>
                <Link
                   to= {`/seller-profile/${property.vendor_id}`}
                  className="text-blue-600 font-semibold text-sm"
                >
                  See Profile
                </Link>
              </div>

              {/* Location Section with Leaflet Map */}
              <div className="my-4">
                <div className="flex flex-col justify-center items-center max-w-sm mx-auto gap-[10px]">
                  <div className="w-[150px] h-[150px] rounded-lg overflow-hidden"
                   onClick={openGoogleMaps}
                  >
                    <MapContainer
                      center={[mapCenter.lat, mapCenter.lng]}
                      zoom={15}
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
                          {property.subcategory} <br /> {property.district}
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>

                  <div className="flex items-center space-x-2 mt-2">
                    <CompassCalibrationOutlinedIcon className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">
                      {property.district}, {property.state}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ad ID and Report Section */}
              <div className="flex justify-between items-center text-gray-600 pt-4 border-t">
                <div className="text-sm">
                  <span className="font-semibold">ADS ID :</span>{" "}
                  {property.unique_code}
                </div>
                <div
                 onClick={handleReportClick}
                className="text-blue-600 cursor-pointer flex items-center" aria-label="report">
                  <ReportIcon />
                  <span className="ml-1">Report Ad</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl shadow-lg bg-white w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm sm:text-base">
          {property.building_direction !== null ? (
            <div className="grid grid-cols-2 sm:grid-cols-2">
              <div className="flex gap-[15px] justify-between">
                <span>Facing </span>
                <span>:</span>
              </div>
              <span className="px-[10px]">{property.building_direction}</span>
            </div>
          ):("")}

         {property.total_floors !== null ? (
            <div className="grid grid-cols-2">
              <div className="flex gap-[15px] justify-between">
                <span>Total Floors </span>
                <span>:</span>
              </div>
              <span className="px-[10px]">{property.total_floors}</span>
            </div>
          ):("")}

        {property.bedrooms !== null ? (
            <div className="grid grid-cols-2">
              <div className="flex gap-[15px] justify-between">
                <span>Bedrooms </span>
                <span>:</span>
              </div>
              <span className="px-[10px]">{property.bedrooms}</span>
            </div>
          ):("")}

          {property.bathroom !== null ? (
            <div className="grid grid-cols-2">
              <div className="flex gap-[15px] justify-between">
                <span>Bathrooms </span>
                <span>:</span>
              </div>
              <span className="px-[10px]">{property.bathroom}</span>
            </div>
          ):("")}

           {property.furnished !== null ? (
            <div className="grid grid-cols-2">
              <div className="flex gap-[15px] justify-between">
                <span>furnished </span>
                <span>:</span>
              </div>
              <span className="px-[10px]">{property.furnished}</span>
            </div>
          ):("")}

          {property.car_parking !== null ? (
            <div className="grid grid-cols-2">
              <div className="flex gap-[15px] justify-between">
                <span>Car Parking </span>
                <span>:</span>
              </div>
              <span className="px-[10px]">{property.car_parking}</span>
            </div>
          ):("")}

          {property.bike_parking !== null ?(
            <div className="grid grid-cols-2">
              <div className="flex gap-[15px] justify-between">
                <span>Bike Parking </span>
                <span>:</span>
              </div>
              <span className="px-[10px]">{property.bike_parking}</span>
            </div>
          ):("")}

           {property.wash_room !== null ? (
            <div className="grid grid-cols-2">
              <div className="flex gap-[15px] justify-between">
                <span>Washroom </span>
                <span>:</span>
              </div>
              <span className="px-[10px]">{property.wash_room}</span>
            </div>
          ):("")}

           {property.floor_no !== null ? (
            <div className="grid grid-cols-2">
              <div className="flex gap-[15px] justify-between">
                <span>Floor Number </span>
                <span>:</span>
              </div>
              <span className="px-[10px]">{property.floor_no}</span>
            </div>
          ):("")}

           {property.total_floors !== null ? (
            <div className="grid grid-cols-2">
              <div className="flex gap-[15px] justify-between">
                <span>Total Floor </span>
                <span>:</span>
              </div>
              <span className="px-[10px]">{property.total_floors}</span>
            </div>
          ):("")}

          {property.maintenance !== null ? (
            <div className="grid grid-cols-2">
              <div className="flex gap-[15px] justify-between">
                <span>Maintenance Type </span>
                <span>:</span>
              </div>
              <span className="px-[10px]">{property.maintenance}</span>
            </div>
          ):("")}

          {property.length !== null ? (
            <div className="grid grid-cols-2">
              <div className="flex gap-[15px] justify-between">
                <span>Length</span>
                <span>:</span>
              </div>
              <span className="px-[10px]">{property.length}</span>
            </div>
          ):("")}
           {property.bachelor !== null ? (
            <div className="grid grid-cols-2">
              <div className="flex gap-[15px] justify-between">
                <span>Bachelor</span>
                <span>:</span>
              </div>
              <span className="px-[10px]">{property.bachelor}</span>
            </div>
          ):("")}

          {property.breadth !== null ? (
            <div className="grid grid-cols-2">
              <div className="flex gap-[15px] justify-between">
                <span>Breadth</span>
                <span>:</span>
              </div>
              <span className="px-[10px]">{property.breadth}</span>
            </div>
          ):("")}

          {property.plot_area !== null ? (
            <div className="grid grid-cols-2">
              <div className="flex gap-[15px] justify-between">
                <span>Plot Area</span>
                <span>:</span>
              </div>
              <span className="px-[10px]">{property.plot_area}</span>
            </div>
          ):("")}

          {property.post_year !== null ? (
            <div className="grid grid-cols-2">
              <div className="flex gap-[15px] justify-between">
                <span>Year</span>
                <span>:</span>
              </div>
              <span className="px-[10px]">{property.post_year}</span>
            </div>
          ):("")}
        </div>
      </div>
    </>
  );
};

export default PropertyDescription;