import React, { useEffect, useState } from "react";
import { useParams , Link } from "react-router-dom";
import IMAGES from "@/utils/images.js";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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
import axios from "axios";
import "leaflet/dist/leaflet.css";
import PropertyDetails from "./PropertyDetails";

const PropertyDescription = () => {
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://raw.githubusercontent.com/Meenadeveloper/json-datas/refs/heads/main/data.json"
        );
        const data = response.data;
        setProperty(data.property);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
                <div className="flex items-center space-x-2">
                  <HomeOutlinedIcon className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">
                    990 Sq. Ft
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CompassCalibrationOutlinedIcon className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">
                    North Facing
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <BedOutlinedIcon className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">
                    3 BHK
                  </span>
                </div>
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
                    T. Nagar, Chennai
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CalendarTodayOutlinedIcon className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">
                    05-Jun-24
                  </span>
                </div>
              </div>

              {/* Description Section */}
              <div className="pt-4">
                <h3 className="text-lg font-bold mb-2">Description</h3>
                <p className="text-gray-700 text-sm">
                  A property description is the written part of the real estate
                  listing that describes the details and noteworthy features of
                  the home. As potential buyers read real estate listings, a
                  well-written description will help pique their interest.
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
                    src={IMAGES.profile}
                    alt="Profile"
                  />
                  <div className="ml-3">
                    <h2 className="text-lg font-semibold">Jayalakshmi</h2>
                    <p className="text-sm text-gray-500">Owner</p>
                  </div>
                </div>
                <Link to="/seller-profile" className="text-blue-600 font-semibold text-sm">
                  See Profile
                </Link>
              </div>

              {/* Location Section */}
              <div className="my-4">
                <div className="flex flex-col justify-center items-center max-w-sm mx-auto gap-[10px]">
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

                  <div className="flex items-center space-x-2">
                    <CompassCalibrationOutlinedIcon className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">
                      T.nagar , chennai
                    </span>
                  </div>
                </div>
              </div>

              {/* Ad ID and Report Section */}
              <div className="flex justify-between items-center text-gray-600 pt-4 border-t">
                <div className="text-sm">
                  <span className="font-semibold">ADS ID :</span> 148562548
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
          <div className="grid grid-cols-2 ">
            <div className="flex gap-[15px] justify-between">
              <span>Type </span>
              <span>:</span>
            </div>

            <span className="px-[10px]">Individual House</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2">
            <div className="flex gap-[15px] justify-between">
              <span>Facing </span>
              <span>:</span>
            </div>

            <span className="px-[10px]">North facing</span>
          </div>
          <div className="grid grid-cols-2 ">
            <div className="flex gap-[15px] justify-between">
              <span>Total Floors </span>
              <span>:</span>
            </div>

            <span className="px-[10px]">03</span>
          </div>
          <div className="grid grid-cols-2 ">
            <div className="flex gap-[15px] justify-between">
              <span>Bedrooms </span>
              <span>:</span>
            </div>

            <span className="px-[10px]">2</span>
          </div>
          <div className="grid grid-cols-2 ">
            <div className="flex gap-[15px] justify-between">
              <span>Bathrooms </span>
              <span>:</span>
            </div>

            <span className="px-[10px]">2</span>
          </div>
          <div className="grid grid-cols-2 ">
            <div className="flex gap-[15px] justify-between">
              <span>Car Parking </span>
              <span>:</span>
            </div>

            <span className="px-[10px]">Yes</span>
          </div>
          <div className="grid grid-cols-2 ">
            <div className="flex gap-[15px] justify-between">
              <span>Construction Status </span>
              <span>:</span>
            </div>

            <span className="px-[10px]">Individual House</span>
          </div>

          <div className="grid grid-cols-2 ">
            <div className="flex gap-[15px] justify-between">
              <span>Maintainers Monthly Fees </span>
              <span>:</span>
            </div>

            <span className="px-[10px]">Rs : 1,500</span>
          </div>

          <div className="grid grid-cols-2 ">
            <div className="flex gap-[15px] justify-between">
              <span>Age of building</span>
              <span>:</span>
            </div>

            <span className="px-[10px]">Build on 2022</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyDescription;
