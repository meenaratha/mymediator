import React, { useEffect, useState } from "react";
import { useParams , Link } from "react-router-dom";
import IMAGES from "@/utils/images.js";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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
import { api } from "@/api/axios"; // Adjust if your axios instance path is different
// import "leaflet/dist/leaflet.css";
import PropertyDetails from "./PropertyDetails";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

const PropertyDescription = () => {
  const { slug } = useParams();
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/properties/${slug}`);
        setProperty(response.data.data); // assuming your API returns { success, message, data }
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug]);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!property) return <div>Property not found.</div>;

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <>
      <PropertyDetails property={property} />

      <div className=" p-4">
        {/* Container for the two-column layout */}
        <div className="flex flex-col md:flex-row md:items-stretch">
          {/* Left Column (65%) */}
          <div className="md:w-2/3 w-full md:pr-4 mb-4 md:mb-0">
            <div className="bg-white p-6 shadow-lg rounded-lg h-full border border-gray-200 ">
              {/* Upper section with icons and details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-b border-[#E1E1E1] pb-4">
                {property.super_builtup_area !== "" ? (
                  <div className="flex items-center space-x-2">
                    <HomeOutlinedIcon className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">
                      {property.super_builtup_area} Sq. Ft
                    </span>
                  </div>
                ) : (
                  ""
                )}

                <div className="flex items-center space-x-2">
                  <CompassCalibrationOutlinedIcon className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">
                    {property.building_direction}
                  </span>
                </div>

                {property.bhk !== null ? (
                  <div className="flex items-center space-x-2">
                    <BedOutlinedIcon className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">
                      {property.bhk}
                    </span>
                  </div>
                ) : (
                  ""
                )}
              </div>

              {/* Middle section with owner, location, and date */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 border-b border-[#E1E1E1]">
                <div className="flex items-center space-x-2">
                  <PersonOutlinedIcon className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">
                    Owner | 1ST
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <LocationOnOutlinedIcon className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">
                    {property.city}, {property.district}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CalendarTodayOutlinedIcon className="text-gray-500" />
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
                    src={IMAGES.profile}
                    alt="Profile"
                  />
                  <div className="ml-3">
                    <h2 className="text-lg font-semibold">Jayalakshmi</h2>
                    <p className="text-sm text-gray-500">Owner</p>
                  </div>
                </div>
                <Link
                  to="/seller-profile"
                  className="text-blue-600 font-semibold text-sm"
                >
                  See Profile
                </Link>
              </div>

              {/* Location Section */}
              <div className="my-4">
                <div className="flex flex-col justify-center items-center max-w-sm mx-auto gap-[10px]">
                  <LoadScript
                    googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                  >
                    <GoogleMap
                      mapContainerStyle={{
                        width: "150px",
                        height: "150px",
                        borderRadius: "10px",
                      }}
                      center={{
                        lat: property.latitude ?? 13.0827,
                        lng: property.longitude ?? 80.2707,
                      }}
                      zoom={15}
                      options={{
                        disableDefaultUI: true,
                        scrollwheel: false,
                      }}
                    >
                      <Marker
                        position={{
                          lat: property.latitude ?? 13.0827,
                          lng: property.longitude ?? 80.2707,
                        }}
                      >
                        <InfoWindow>
                          <div>
                            <p>{property.subcategory}</p>
                            <p>{property.city}</p>
                          </div>
                        </InfoWindow>
                      </Marker>
                    </GoogleMap>
                  </LoadScript>

                  <div className="flex items-center space-x-2 mt-2">
                    <CompassCalibrationOutlinedIcon className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">
                      {property.city}, {property.district}
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
                <div className="text-blue-600" aria-label="report">
                  <ReportIcon />
                  <span className="ml-1">Report Ad</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl shadow-lg bg-white w-full ">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm sm:text-base">
          {/* <div className="grid grid-cols-2 ">
            <div className="flex gap-[15px] justify-between">
              <span>Type </span>
              <span>:</span>
            </div>

            <span className="px-[10px]">Individual House</span>
          </div> */}

          {property.building_direction !== null ? (
            <div className="grid grid-cols-2 sm:grid-cols-2">
              <div className="flex gap-[15px] justify-between">
                <span>Facing </span>
                <span>:</span>
              </div>

              <span className="px-[10px]">{property.building_direction}</span>
            </div>
          ) : (
            ""
          )}
          {property.total_floors !== null ? (
            <div className="grid grid-cols-2 ">
              <div className="flex gap-[15px] justify-between">
                <span>Total Floors </span>
                <span>:</span>
              </div>

              <span className="px-[10px]">{property.total_floors}</span>
            </div>
          ) : (
            ""
          )}

          {property.bedrooms !== null ? (
            <div className="grid grid-cols-2 ">
              <div className="flex gap-[15px] justify-between">
                <span>Bedrooms </span>
                <span>:</span>
              </div>

              <span className="px-[10px]">{property.bedrooms}</span>
            </div>
          ) : (
            ""
          )}

          {property.bathroom !== null ? (
            <div className="grid grid-cols-2 ">
              <div className="flex gap-[15px] justify-between">
                <span>Bathrooms </span>
                <span>:</span>
              </div>

              <span className="px-[10px]">{property.bathroom}</span>
            </div>
          ) : (
            ""
          )}

          {property.car_parking !== null ? (
            <div className="grid grid-cols-2 ">
              <div className="flex gap-[15px] justify-between">
                <span>Car Parking </span>
                <span>:</span>
              </div>

              <span className="px-[10px]">{property.car_parking}</span>
            </div>
          ) : (
            ""
          )}

          {property.maintenance !== null ? (
            <div className="grid grid-cols-2 ">
              <div className="flex gap-[15px] justify-between">
                <span>Maintenance Type </span>
                <span>:</span>
              </div>

              <span className="px-[10px]">{property.maintenance}</span>
            </div>
          ) : (
            ""
          )}

          {property.length !== null ? (
            <div className="grid grid-cols-2 ">
              <div className="flex gap-[15px] justify-between">
                <span>Length</span>
                <span>:</span>
              </div>

              <span className="px-[10px]">{property.length}</span>
            </div>
          ) : (
            ""
          )}

          {property.breadth !== null ? (
            <div className="grid grid-cols-2 ">
              <div className="flex gap-[15px] justify-between">
                <span>breadth</span>
                <span>:</span>
              </div>

              <span className="px-[10px]">{property.breadth}</span>
            </div>
          ) : (
            ""
          )}

          {property.plot_area !== null ? (
            <div className="grid grid-cols-2 ">
              <div className="flex gap-[15px] justify-between">
                <span>Plot Area</span>
                <span>:</span>
              </div>

              <span className="px-[10px]">{property.plot_area}</span>
            </div>
          ) : (
            ""
          )}

          {property.post_year !== null ? (
            <div className="grid grid-cols-2 ">
              <div className="flex gap-[15px] justify-between">
                <span>Year</span>
                <span>:</span>
              </div>

              <span className="px-[10px]">{property.post_year}</span>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default PropertyDescription;
