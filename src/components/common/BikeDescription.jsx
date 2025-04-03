import React, { useEffect, useState } from "react";
import IMAGES from "@/utils/images.js";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {
  TwoWheeler,
  Speed,
  LocalGasStation,
  CalendarToday,
  ColorLens,
} from "@mui/icons-material";

import DirectionsBikeOutlinedIcon from "@mui/icons-material/DirectionsBikeOutlined";
import SpeedOutlinedIcon from "@mui/icons-material/SpeedOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import LocalGasStationOutlinedIcon from "@mui/icons-material/LocalGasStationOutlined";
import ReportIcon from "@mui/icons-material/Report";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import BikeDetails from "./BikeDetails";

const BikeDescription = () => {
  const [bike, setBike] = useState({
    id: 1,
    name: "TVS Raider",
    price: "1,50,000",
    year: 2022,
    distance: "3215 - 10,000 km",
    rating: 4.5,
    location: {
      area: "West Mambalam",
      city: "Chennai",
      latitude: 13.0827,
      longitude: 80.2707,
    },
    owner: {
      name: "Jayaprakash",
      type: "1ST Owner",
      profile: IMAGES.profile,
    },
    postedDate: "25-Jun-24",
    model: "125cc",
    brand: "TVS",
    fuel: "Petrol",
    description:
      "This incredible bike is the perfect combination of power and elegance. With its advanced features and top-notch performance, this motorcycle is a joy to ride. The bike has been well-maintained and is in excellent condition. Low mileage and regularly serviced, it performs smoothly on both city roads and highways. Original papers are in place and it's ready for transfer. It's a must-see for any bike enthusiast.",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : (
        <>
          <BikeDetails bike={bike} />

          <div className="p-4">
            {/* Container for the two-column layout */}
            <div className="flex flex-col md:flex-row md:items-stretch">
              {/* Left Column (65%) */}
              <div className="md:w-2/3 w-full md:pr-4 mb-4 md:mb-0">
                <div className="bg-white p-6 shadow-lg rounded-lg h-full border border-gray-200">
                  {/* Upper section with icons and details */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-b border-[#E1E1E1] pb-4">
                    <div className="flex items-center space-x-2">
                      <DirectionsBikeOutlinedIcon className="text-gray-500" />
                      <span className="text-sm font-medium text-gray-600">
                        {bike.model}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <SpeedOutlinedIcon className="text-gray-500" />
                      <span className="text-sm font-medium text-gray-600">
                        {bike.distance}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <LocalGasStationOutlinedIcon className="text-gray-500" />
                      <span className="text-sm font-medium text-gray-600">
                        {bike.fuel}
                      </span>
                    </div>
                  </div>

                  {/* Middle section with owner, location, and date */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 border-b border-[#E1E1E1]">
                    <div className="flex items-center space-x-2">
                      <PersonOutlinedIcon className="text-gray-500" />
                      <span className="text-sm font-medium text-gray-600">
                        {bike.owner.type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <LocationOnOutlinedIcon className="text-gray-500" />
                      <span className="text-sm font-medium text-gray-600">
                        {bike.location.area}, {bike.location.city}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CalendarTodayOutlinedIcon className="text-gray-500" />
                      <span className="text-sm font-medium text-gray-600">
                        {bike.postedDate}
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
                        src={bike.owner.profile}
                        alt="Profile"
                      />
                      <div className="ml-3">
                        <h2 className="text-lg font-semibold">
                          {bike.owner.name}
                        </h2>
                        <p className="text-sm text-gray-500">Owner</p>
                      </div>
                    </div>
                    <a href="#" className="text-blue-600 font-semibold text-sm">
                      See Profile
                    </a>
                  </div>

                  {/* Location Section */}
                  <div className="my-4">
                    <div className="flex flex-col justify-center items-center max-w-sm mx-auto gap-[10px]">
                      <MapContainer
                        center={[
                          bike.location.latitude,
                          bike.location.longitude,
                        ]}
                        zoom={13}
                        scrollWheelZoom={false}
                        className="w-[150px] h-[150px] rounded-[10px]"
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker
                          position={[
                            bike.location.latitude,
                            bike.location.longitude,
                          ]}
                        >
                          <Popup>
                            {bike.name} <br /> {bike.location.area}
                          </Popup>
                        </Marker>
                      </MapContainer>

                      <div className="flex items-center space-x-2">
                        <LocationOnOutlinedIcon className="text-gray-500" />
                        <span className="text-sm font-medium text-gray-600">
                          {bike.location.area}, {bike.location.city}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Ad ID and Report Section */}
                  <div className="flex justify-between items-center text-gray-600 pt-4 border-t">
                    <div className="text-sm">
                      <span className="font-semibold">ADS ID :</span> 148562548
                    </div>
                    <div
                      className="flex items-center text-blue-600 cursor-pointer"
                      aria-label="report"
                    >
                      <ReportIcon className="text-sm" />
                      <span className="ml-1 text-sm">Report Ad</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl shadow-lg bg-white w-full mb-4">
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
                <span className="px-[10px]">{bike.year}</span>
              </div>
              <div className="grid grid-cols-2">
                <div className="flex gap-[15px] justify-between">
                  <span>Engine </span>
                  <span>:</span>
                </div>
                <span className="px-[10px]">125 cc</span>
              </div>
              <div className="grid grid-cols-2">
                <div className="flex gap-[15px] justify-between">
                  <span>Fuel Type </span>
                  <span>:</span>
                </div>
                <span className="px-[10px]">{bike.fuel}</span>
              </div>
              <div className="grid grid-cols-2">
                <div className="flex gap-[15px] justify-between">
                  <span>Mileage </span>
                  <span>:</span>
                </div>
                <span className="px-[10px]">55 kmpl</span>
              </div>
              <div className="grid grid-cols-2">
                <div className="flex gap-[15px] justify-between">
                  <span>Color </span>
                  <span>:</span>
                </div>
                <span className="px-[10px]">Yellow</span>
              </div>
              <div className="grid grid-cols-2">
                <div className="flex gap-[15px] justify-between">
                  <span>Condition </span>
                  <span>:</span>
                </div>
                <span className="px-[10px]">Excellent</span>
              </div>
              <div className="grid grid-cols-2">
                <div className="flex gap-[15px] justify-between">
                  <span>Insurance Valid</span>
                  <span>:</span>
                </div>
                <span className="px-[10px]">June 2025</span>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default BikeDescription;
