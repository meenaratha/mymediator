import { useState } from "react";

const Location = () => {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fullAddress, setFullAddress] = useState("");
  const [coordinates, setCoordinates] = useState("");
  const [accuracy, setAccuracy] = useState("");

  const handleCurrentLocation = () => {
    setIsLoading(true);
    setSelectedLocation("");
    setFullAddress("");
    setCoordinates("");
    setAccuracy("");

    if ("geolocation" in navigator) {
      // First, try to get a quick position, then get a more accurate one
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const {
            latitude,
            longitude,
            accuracy: positionAccuracy,
          } = position.coords;

          setCoordinates(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          setAccuracy(`±${Math.round(positionAccuracy)}m`);

          // If accuracy is not good enough, try to get a better position
          if (positionAccuracy > 10) {
            console.log(
              `Initial accuracy: ${positionAccuracy}m, trying for better...`
            );

            // Try to get a more accurate position
            navigator.geolocation.getCurrentPosition(
              (betterPosition) => {
                const {
                  latitude: lat2,
                  longitude: lng2,
                  accuracy: acc2,
                } = betterPosition.coords;

                if (acc2 < positionAccuracy) {
                  console.log(`Better accuracy achieved: ${acc2}m`);
                  setCoordinates(`${lat2.toFixed(6)}, ${lng2.toFixed(6)}`);
                  setAccuracy(`±${Math.round(acc2)}m`);
                  fetchAddress(lat2, lng2);
                } else {
                  fetchAddress(latitude, longitude);
                }
              },
              (error) => {
                console.log("Second attempt failed, using first position");
                fetchAddress(latitude, longitude);
              },
              {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0,
              }
            );
          } else {
            fetchAddress(latitude, longitude);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          let errorMessage = "Location access denied or unavailable";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                "Location permission denied. Please enable location access.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out.";
              break;
          }

          setSelectedLocation(errorMessage);
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0, // Don't use cached position
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setIsLoading(false);
    }
  };

  const fetchAddress = async (latitude, longitude) => {
    try {
      // Note: You'll need to replace this with your actual API key
      const apiKey = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your actual API key

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}&result_type=street_address|premise`
      );

      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        const components = data.results[0].address_components;
        const formattedAddress = data.results[0].formatted_address;

        const getComponent = (type) =>
          components.find((c) => c.types.includes(type))?.long_name || "";

        const streetNumber = getComponent("street_number");
        const route = getComponent("route");
        const city =
          getComponent("locality") ||
          getComponent("sublocality") ||
          getComponent("administrative_area_level_2");
        const state = getComponent("administrative_area_level_1");
        const country = getComponent("country");

        const streetAddress = `${streetNumber} ${route}`.trim();
        const newLocation = streetAddress
          ? `${streetAddress}, ${city}, ${state}`
          : `${city}, ${state}`;

        setSelectedLocation(newLocation);
        setFullAddress(formattedAddress);
      } else if (data.status === "ZERO_RESULTS") {
        setSelectedLocation("No address found for this location");
        setFullAddress("");
      } else {
        setSelectedLocation(`Geocoding failed: ${data.status}`);
        setFullAddress("");
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching location:", error);
      setSelectedLocation("Error fetching address");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          🎯 Precise Location Finder
        </h1>

        <button
          onClick={handleCurrentLocation}
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:transform active:scale-95"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Detecting High-Precision Location...
            </div>
          ) : (
            "📍 Get Precise Location"
          )}
        </button>

        {(coordinates || selectedLocation) && (
          <div className="mt-6 space-y-4">
            {coordinates && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">
                  📐 Coordinates:
                </h3>
                <p className="text-green-700 font-mono text-sm">
                  {coordinates}
                </p>
                {accuracy && (
                  <p className="text-green-600 text-sm mt-1">
                    Accuracy: {accuracy}
                  </p>
                )}
              </div>
            )}

            {selectedLocation && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">
                  📍 Location:
                </h3>
                <p className="text-blue-700">{selectedLocation}</p>
              </div>
            )}

            {fullAddress && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-800 mb-2">
                  🏠 Full Address:
                </h3>
                <p className="text-purple-700 text-sm">{fullAddress}</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
          <p className="font-medium mb-1">💡 Tips for best accuracy:</p>
          <ul className="space-y-1">
            <li>• Use outdoors with clear sky view</li>
            <li>• Enable high accuracy in browser settings</li>
            <li>• Allow location permission when prompted</li>
            <li>• Wait for GPS to stabilize (may take 10-20 seconds)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Location;
