import React, { useRef, useState } from "react";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";

const GOOGLE_MAP_LIBRARIES = ["places"];

const AddressAutocomplete = () => {
  const autocompleteRef = useRef(null);
  const [address, setAddress] = useState("");
  const [autocomplete, setAutocomplete] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAP_LIBRARIES,
  });

   const onLoad = (autocomplete) => {
     setAutocomplete(autocomplete);
     autocomplete.setFields([
       "address_components",
       "geometry",
       "formatted_address",
     ]);
   };


  const onPlaceChanged = () => {
    if (!autocompleteRef.current) return;

    const place = autocompleteRef.current.getPlace();
    if (!place || !place.geometry || !place.formatted_address) {
      console.log("Invalid place data");
      return;
    }

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    setAddress(place.formatted_address);

    const old = JSON.parse(localStorage.getItem("address")) || {};
    localStorage.setItem(
      "address",
      JSON.stringify({
        ...old,
        address: place.formatted_address,
        latitude: lat,
        longitude: lng,
      })
    );
  };

  if (loadError) return <p>Error loading maps</p>;
  if (!isLoaded) return <p>Loading Maps...</p>;

  return (
    <div className="mb-3">
      <div className="relative z-[9999]">
        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
          <input
            type="text"
            className="w-full relative z-[9999] pl-4 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search for area, street name..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
         </Autocomplete>
      </div>
    </div>
  );
};

export default AddressAutocomplete;
