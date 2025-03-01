import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {
  Home,
  Bathtub,
  LocalParking,
  Build,
  Layers,
  CalendarToday,
} from "@mui/icons-material";
import axios from "axios";
import "leaflet/dist/leaflet.css";

const PropertyDescription = () => {
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/data.json");
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
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Property Description</h1>
      <p className="mb-6">
        A property description is the written part of the real estate listing
        that describes the details and noteworthy features of the home. As
        potential buyers read real estate listings, a well-written description
        will help pique their interest.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center">
            <Home className="mr-2" />
            <span>Type: {property.type}</span>
          </div>
          <div className="flex items-center">
            <Layers className="mr-2" />
            <span>Facing: {property.facing}</span>
          </div>
          <div className="flex items-center">
            <Layers className="mr-2" />
            <span>Total Floors: {property.totalFloors}</span>
          </div>
          <div className="flex items-center">
            <Bathtub className="mr-2" />
            <span>Bathrooms: {property.bathrooms}</span>
          </div>
          <div className="flex items-center">
            <LocalParking className="mr-2" />
            <span>Car Parking: {property.carParking}</span>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center">
            <CalendarToday className="mr-2" />
            <span>Age of building: {property.ageOfBuilding}</span>
          </div>
          <div className="flex items-center">
            <Build className="mr-2" />
            <span>Builder: {property.builder}</span>
          </div>
          <div className="flex items-center">
            <Layers className="mr-2" />
            <span>Floor No: {property.floorNo}</span>
          </div>
          <div className="flex items-center">
            <Home className="mr-2" />
            <span>Carpet Area: {property.carpetArea} FT²</span>
          </div>
          <div className="flex items-center">
            <Home className="mr-2" />
            <span>Super Builtup Area: {property.superBuiltupArea} FT²</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center">
          <span className="font-semibold">Maintenance Monthly Fees:</span>
          <span className="ml-2">Rs {property.maintenanceFees}</span>
        </div>
      </div>

      {/* Map Section */}
      <div className="mt-8 h-96">
        <h2 className="text-xl font-bold mb-4">Location</h2>
        <MapContainer
          center={[property.location.latitude, property.location.longitude]}
          zoom={13}
          scrollWheelZoom={false}
          className="h-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker
            position={[property.location.latitude, property.location.longitude]}
          >
            <Popup>
              {property.type} <br /> {property.facing}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default PropertyDescription;
