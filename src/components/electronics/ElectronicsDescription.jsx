import React, { useEffect, useState } from "react";
import IMAGES from "@/utils/images.js";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  LaptopMacOutlined,
  MemoryOutlined,
  StorageOutlined,
  BatteryFullOutlined,
  CalendarTodayOutlined,
  PersonOutlined,
  LocationOnOutlined,
  ReportProblemOutlined,
  ScreenRotationOutlined
} from "@mui/icons-material";
import axios from "axios";
import LaptopDetails from "../electronics/ElectronicsDetails";

const LaptopDescription = () => {
  const [laptop, setLaptop] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with your laptop data API endpoint
        const response = await axios.get(
          "https://raw.githubusercontent.com/yourusername/laptops-data/main/laptops.json"
        );
        const data = response.data;
        setLaptop(data.laptop);
        setIsLoading(false);
      } catch (error) {
        // If API fails, use fallback data
        console.log("Using fallback data due to API error:", error);
        setLaptop({
          id: "L12345",
          brand: "Microsoft",
          model: "Surface Pro 8",
          processor: "Intel Core i5-1135G7",
          ram: "8 GB",
          storage: "256 GB SSD",
          displaySize: "13.0 inches",
          displayResolution: "2880 x 1920",
          graphicsCard: "Intel Iris Xe Graphics",
          batteryLife: "Up to 16 hours",
          operatingSystem: "Windows 11",
          weight: "1.96 lbs",
          condition: "Excellent",
          purchaseYear: 2022,
          warranty: "4 months remaining",
          price: 80000,
          additionalFeatures: ["Touchscreen", "Detachable Keyboard", "Surface Pen Compatible", "USB-C ports"],
          location: {
            address: "West Mambalam, Chennai",
            latitude: 13.0419,
            longitude: 80.2338
          }
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
      <LaptopDetails laptop={laptop} />

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
                  Microsoft Surface Laptop Pro 8 used 8 month old in perfect condition-256GB SSD, 8GB RAM, 
                  Intel Core i5 11th Gen, 13-inch PixelSense Flow display with 120Hz refresh rate. The device 
                  comes with the Surface Pro Type Cover (keyboard), charger, and Surface Pen. Battery life is 
                  still excellent with up to 16 hours of use. Perfect for students or professionals on the go. 
                  Original Microsoft warranty valid until June 24.
                </p>
              </div>

              {/* Key Specs in Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-[#E1E1E1]">
                <div className="flex items-center space-x-2">
                  <LaptopMacOutlined className="text-gray-500" />
                  <div className="text-sm">
                    <span className="font-medium text-gray-600">Processor:</span>
                    <div className="text-gray-700">{laptop.processor}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MemoryOutlined className="text-gray-500" />
                  <div className="text-sm">
                    <span className="font-medium text-gray-600">Memory:</span>
                    <div className="text-gray-700">{laptop.ram}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <StorageOutlined className="text-gray-500" />
                  <div className="text-sm">
                    <span className="font-medium text-gray-600">Storage:</span>
                    <div className="text-gray-700">{laptop.storage}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <ScreenRotationOutlined className="text-gray-500" />
                  <div className="text-sm">
                    <span className="font-medium text-gray-600">Display:</span>
                    <div className="text-gray-700">{laptop.displaySize}</div>
                  </div>
                </div>
              </div>

              {/* Ownership and Purchase Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 border-b border-[#E1E1E1]">
                <div className="flex items-center space-x-2">
                  <PersonOutlined className="text-gray-500" />
                  <div className="text-sm">
                    <span className="font-medium text-gray-600">Condition:</span>
                    <div className="text-gray-700">{laptop.condition}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <LocationOnOutlined className="text-gray-500" />
                  <div className="text-sm">
                    <span className="font-medium text-gray-600">Location:</span>
                    <div className="text-gray-700">{laptop.location.address}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <CalendarTodayOutlined className="text-gray-500" />
                  <div className="text-sm">
                    <span className="font-medium text-gray-600">Purchase Year:</span>
                    <div className="text-gray-700">{laptop.purchaseYear}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <BatteryFullOutlined className="text-gray-500" />
                  <div className="text-sm">
                    <span className="font-medium text-gray-600">Battery Life:</span>
                    <div className="text-gray-700">{laptop.batteryLife}</div>
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
                    src={IMAGES.profile}
                    alt="Profile"
                  />
                  <div className="ml-3">
                    <h2 className="text-lg font-semibold">Jessamyn</h2>
                    <p className="text-sm text-gray-500">Seller</p>
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
                      laptop.location.latitude,
                      laptop.location.longitude,
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
                        laptop.location.latitude,
                        laptop.location.longitude,
                      ]}
                    >
                      <Popup>
                        {laptop.brand} {laptop.model} <br /> {laptop.purchaseYear}
                      </Popup>
                    </Marker>
                  </MapContainer>

                  <div className="flex items-center space-x-2">
                    <LocationOnOutlined className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">
                      {laptop.location.address}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ad ID and Report Section */}
              <div className="flex justify-between items-center text-gray-600 pt-4 border-t">
                <div className="text-sm">
                  <span className="font-semibold">ADS ID :</span> {laptop.id}
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

      {/* Detailed Specifications Table */}
      <div className="p-4 rounded-xl shadow-lg bg-white w-full mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm sm:text-base">
          <div className="grid grid-cols-2">
            <div className="flex gap-[15px] justify-between">
              <span>Processor Type </span>
              <span>:</span>
            </div>
            <span className="px-[10px]">Core i5</span>
          </div>
          <div className="grid grid-cols-2">
            <div className="flex gap-[15px] justify-between">
              <span>Processor Gen </span>
              <span>:</span>
            </div>
            <span className="px-[10px]">11th</span>
          </div>
          <div className="grid grid-cols-2">
            <div className="flex gap-[15px] justify-between">
              <span>RAM </span>
              <span>:</span>
            </div>
            <span className="px-[10px]">8 GB</span>
          </div>
          <div className="grid grid-cols-2">
            <div className="flex gap-[15px] justify-between">
              <span>Storage Type </span>
              <span>:</span>
            </div>
            <span className="px-[10px]">SSD</span>
          </div>
          <div className="grid grid-cols-2">
            <div className="flex gap-[15px] justify-between">
              <span>Storage Size </span>
              <span>:</span>
            </div>
            <span className="px-[10px]">256 GB</span>
          </div>
          <div className="grid grid-cols-2">
            <div className="flex gap-[15px] justify-between">
              <span>Graphics Card </span>
              <span>:</span>
            </div>
            <span className="px-[10px]">Intel Iris Xe</span>
          </div>
          <div className="grid grid-cols-2">
            <div className="flex gap-[15px] justify-between">
              <span>Display Size </span>
              <span>:</span>
            </div>
            <span className="px-[10px]">13.0"</span>
          </div>
          <div className="grid grid-cols-2">
            <div className="flex gap-[15px] justify-between">
              <span>Operating System </span>
              <span>:</span>
            </div>
            <span className="px-[10px]">{laptop.operatingSystem}</span>
          </div>
          <div className="grid grid-cols-2">
            <div className="flex gap-[15px] justify-between">
              <span>Warranty</span>
              <span>:</span>
            </div>
            <span className="px-[10px]">{laptop.warranty}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default LaptopDescription;