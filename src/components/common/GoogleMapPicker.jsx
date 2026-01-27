import React, { useState, useCallback, useEffect } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const GOOGLE_MAP_LIBRARIES = ["places"];

const mapContainerStyle = {
    width: "100%",
    height: "100%",
};

const defaultCenter = {
    lat: 28.6139, // Delhi, India
    lng: 77.209,
};

const GoogleMapPicker = ({
    initialLat,
    initialLng,
    onLocationChange,
    height = "400px",
}) => {
    const [markerPosition, setMarkerPosition] = useState({
        lat: initialLat || defaultCenter.lat,
        lng: initialLng || defaultCenter.lng,
    });

    const [mapCenter, setMapCenter] = useState({
        lat: initialLat || defaultCenter.lat,
        lng: initialLng || defaultCenter.lng,
    });

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: GOOGLE_MAP_LIBRARIES,
    });

    // Update marker position when initial coordinates change
    useEffect(() => {
        if (initialLat && initialLng) {
            const newPosition = { lat: parseFloat(initialLat), lng: parseFloat(initialLng) };
            setMarkerPosition(newPosition);
            setMapCenter(newPosition);
        }
    }, [initialLat, initialLng]);

    // Reverse geocoding function
    const reverseGeocode = useCallback(
        async (lat, lng) => {
            try {
                const geocoder = new window.google.maps.Geocoder();
                const latlng = { lat, lng };

                geocoder.geocode({ location: latlng }, (results, status) => {
                    if (status === "OK" && results[0]) {
                        const address = results[0].formatted_address;
                        console.log("Reverse geocoded address:", address);

                        // Call the parent callback with the new location data
                        if (onLocationChange) {
                            onLocationChange({
                                address,
                                latitude: lat,
                                longitude: lng,
                            });
                        }
                    } else {
                        console.error("Geocoder failed:", status);
                        // Still update coordinates even if geocoding fails
                        if (onLocationChange) {
                            onLocationChange({
                                address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
                                latitude: lat,
                                longitude: lng,
                            });
                        }
                    }
                });
            } catch (error) {
                console.error("Error in reverse geocoding:", error);
            }
        },
        [onLocationChange]
    );

    // Handle marker drag end
    const onMarkerDragEnd = useCallback(
        (event) => {
            const newLat = event.latLng.lat();
            const newLng = event.latLng.lng();

            console.log("Marker dragged to:", newLat, newLng);

            setMarkerPosition({ lat: newLat, lng: newLng });
            reverseGeocode(newLat, newLng);
        },
        [reverseGeocode]
    );

    // Handle map click to move marker
    const onMapClick = useCallback(
        (event) => {
            const newLat = event.latLng.lat();
            const newLng = event.latLng.lng();

            console.log("Map clicked at:", newLat, newLng);

            setMarkerPosition({ lat: newLat, lng: newLng });
            reverseGeocode(newLat, newLng);
        },
        [reverseGeocode]
    );

    if (loadError) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                <p className="text-red-500">Error loading Google Maps</p>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-4 text-gray-600">Loading map...</span>
            </div>
        );
    }

    return (
        <div style={{ height }}>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={15}
                center={mapCenter}
                onClick={onMapClick}
                options={{
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: true,
                }}
            >
                <Marker
                    position={markerPosition}
                    draggable={true}
                    onDragEnd={onMarkerDragEnd}
                    animation={window.google.maps.Animation.DROP}
                />
            </GoogleMap>
        </div>
    );
};

export default GoogleMapPicker;
