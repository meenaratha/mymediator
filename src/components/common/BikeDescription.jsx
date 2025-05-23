import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

const BikeDescription = () => {
  const [bike, setBike] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with your bike data API endpoint
        const response = await axios.get(
          "https://raw.githubusercontent.com/yourusername/bikes-data/main/bikes.json"
        );
        const data = response.data;
        setBike(data.bike);
        setIsLoading(false);
      } catch (error) {
        // If API fails, use fallback data
        console.log("Using fallback data due to API error:", error);
        setBike({
          id: "B12345",
          brand: "TVS",
          model: "Riders",
          year: 2017,
          kilometers: 15000,
          fuelType: "Petrol",
          engineCapacity: "160 cc",
          maxPower: "15 bhp",
          maxTorque: "12 Nm",
          mileage: "45 kmpl", 
          transmission: "Manual",
          color: "Black",
          condition: "Good",
          ownerNumber: 1,
          price: 150000,
          location: {
            address: "T. Nagar, Chennai",
            latitude: 13.0419,
            longitude: 80.2338
          },
          features: ["Disc Brake", "LED Lights", "Digital Speedometer", "Electric Start"]
        });
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
                  <TwoWheelerOutlined className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">
                    {bike.engineCapacity}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <SpeedOutlined className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">
                    {bike.kilometers} km
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <LocalGasStationOutlined className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">
                    {bike.fuelType}
                  </span>
                </div>
              </div>

              {/* Middle section with owner, location, and date */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 border-b border-[#E1E1E1]">
                <div className="flex items-center space-x-2">
                  <PersonOutlined className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">
                    Owner {bike.ownerNumber}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <LocationOnOutlined className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">
                    {bike.location.address}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CalendarTodayOutlined className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">
                    {bike.year}
                  </span>
                </div>
              </div>

              {/* Description Section */}
              <div className="pt-4">
                <h3 className="text-lg font-bold mb-2">Description</h3>
                <p className="text-gray-700 text-sm">
                  This is a well-maintained {bike.year} {bike.brand} {bike.model} with only {bike.kilometers} km on the odometer. 
                  The bike is in excellent condition and has been regularly serviced. It offers great mileage of {bike.mileage} and 
                  has a powerful {bike.engineCapacity} engine with {bike.maxPower} of maximum power. The bike comes with features like 
                  {bike.features.join(', ')}. This is a perfect ride for daily commuters and weekend warriors alike.
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
                    <p className="text-sm text-gray-500">Seller</p>
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
                      bike.location.latitude,
                      bike.location.longitude,
                    ]}
                    zoom={13}
                    scrollWheelZoom={false}
                    className="w-[150px] h-[150px] rounded-[10px]"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker
                      position={[
                        bike.location.latitude,
                        bike.location.longitude,
                      ]}
                    >
                      <Popup>
                        {bike.brand} {bike.model} <br /> {bike.year}
                      </Popup>
                    </Marker>
                  </MapContainer>

                  <div className="flex items-center space-x-2">
                    <LocationOnOutlined className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">
                      {bike.location.address}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ad ID and Report Section */}
              <div className="flex justify-between items-center text-gray-600 pt-4 border-t">
                <div className="text-sm">
                  <span className="font-semibold">ADS ID :</span> {bike.id}
                </div>
                <div className="flex items-center text-blue-600 cursor-pointer" aria-label="report">
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
            <span className="px-[10px]">{bike.year}</span>
          </div>
          <div className="grid grid-cols-2">
            <div className="flex gap-[15px] justify-between">
              <span>Engine </span>
              <span>:</span>
            </div>
            <span className="px-[10px]">{bike.engineCapacity}</span>
          </div>
          <div className="grid grid-cols-2">
            <div className="flex gap-[15px] justify-between">
              <span>Mileage </span>
              <span>:</span>
            </div>
            <span className="px-[10px]">{bike.mileage}</span>
          </div>
          <div className="grid grid-cols-2">
            <div className="flex gap-[15px] justify-between">
              <span>Fuel Type </span>
              <span>:</span>
            </div>
            <span className="px-[10px]">{bike.fuelType}</span>
          </div>
          <div className="grid grid-cols-2">
            <div className="flex gap-[15px] justify-between">
              <span>Condition </span>
              <span>:</span>
            </div>
            <span className="px-[10px]">{bike.condition}</span>
          </div>
          <div className="grid grid-cols-2">
            <div className="flex gap-[15px] justify-between">
              <span>Kilometers </span>
              <span>:</span>
            </div>
            <span className="px-[10px]">{bike.kilometers} km</span>
          </div>
          <div className="grid grid-cols-2">
            <div className="flex gap-[15px] justify-between">
              <span>Color</span>
              <span>:</span>
            </div>
            <span className="px-[10px]">{bike.color}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default BikeDescription;