import React, { useState, useEffect } from "react";
import GoogleMapPicker from "./GoogleMapPicker";
import ClearIcon from "@mui/icons-material/Clear";

const MapPickerModal = ({
    isOpen,
    onClose,
    onConfirm,
    initialLat,
    initialLng,
}) => {
    const [selectedLocation, setSelectedLocation] = useState({
        address: "",
        latitude: initialLat || 28.6139,
        longitude: initialLng || 77.209,
    });

    // Update selected location when initial coordinates change
    useEffect(() => {
        if (initialLat && initialLng) {
            setSelectedLocation((prev) => ({
                ...prev,
                latitude: initialLat,
                longitude: initialLng,
            }));
        }
    }, [initialLat, initialLng]);

    // Handle location change from map
    const handleLocationChange = (locationData) => {
        setSelectedLocation(locationData);
    };

    // Handle confirm button click
    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm(selectedLocation);
        }
    };

    // Don't render if not open
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-999 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4  overflow-y-auto h-[500px] ">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                    <h2 className="text-xl font-semibold text-gray-800">
                        📍 Select Location on Map
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-white"
                        aria-label="Close"
                    >
                        <ClearIcon />
                    </button>
                </div>

                {/* Map Container */}
                <div className="p-4">
                    <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                        <GoogleMapPicker
                            initialLat={selectedLocation.latitude}
                            initialLng={selectedLocation.longitude}
                            onLocationChange={handleLocationChange}
                            height="500px"
                        />
                    </div>

                    {/* Selected Address Display */}
                    {selectedLocation.address && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-gray-600 mb-1">Selected Address:</p>
                            <p className="text-gray-800 font-medium">
                                {selectedLocation.address}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                                Coordinates: {selectedLocation.latitude.toFixed(6)},{" "}
                                {selectedLocation.longitude.toFixed(6)}
                            </p>
                        </div>
                    )}

                    {/* Instructions */}
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                            💡 <strong>Tip:</strong> Drag the marker or click anywhere on the
                            map to select a location
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-100 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedLocation.address}
                        className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Confirm Location
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MapPickerModal;
