import React, { useState, useEffect } from "react";
import styles from "@/styles/Home.module.css";
import BikeCategoryFilter from "./filter/bike/BikeCategoryFilter";
import BikeBrandModelFilter from "./filter/bike/BikeBrandModelFilter";
import BikePrizeRangeFilter from "./filter/bike/BikePrizeRangeFilter";

const BikeFilter = ({
  isFilterOpen,
  isMobile,
  onApplyFilters,
  currentFilters,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    location: true,
    brand: true,
    kmDriven: true,
    year: true,
    price: true,
  });

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedBrands, setSelectedBrands] = useState([]);

  // Initialize filters state with current filters or default values
  const [filters, setFilters] = useState({
    type: "bike",
    price_range: "",
    brand: "",
    model: "",
    year_filter: "",
    fuelType: "",
    kilometers: "",
    enginecc: "",
    owner: "",
    subcategory_id: "",
    latitude: "",
    longitude: "",
    ...currentFilters, // Override with current filters from parent
  });
  // Update local filters when currentFilters prop changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      ...currentFilters,
    }));
  }, [currentFilters]);

  // Function to handle filter application
  const handleApplyFilters = () => {
    console.log("=== HANDLE APPLY FILTERS ===");
    console.log("Current filters state:", filters);

    // Clean up filters - remove empty values
    const cleanedFilters = Object.entries(filters).reduce(
      (acc, [key, value]) => {
        if (value && value !== "" && value !== null && value !== undefined) {
          // Handle arrays
          if (Array.isArray(value)) {
            if (value.length > 0) {
              acc[key] = value;
            }
          } else {
            acc[key] = value;
          }
        }
        return acc;
      },
      {}
    );

    console.log("Cleaned filters to send:", cleanedFilters);

    // Call the parent's apply filters function
    if (onApplyFilters) {
      onApplyFilters(cleanedFilters);
    } else {
      console.error("onApplyFilters function not provided!");
    }
  };

  const [locationData, setLocationData] = useState({
    address: "Chennai, Tamil Nadu", // Default fallback
    city: "Chennai",
    state: "Tamil Nadu",
    latitude: "",
    longitude: "",
  });

  // Helper functions for extracting city and state
  const extractCityFromAddress = (address) => {
    if (!address) return "";
    const parts = address.split(",");
    return parts[0]?.trim() || "";
  };

  const extractStateFromAddress = (address) => {
    if (!address) return "";
    const parts = address.split(",");
    return parts[1]?.trim() || "";
  };

  // Function to get location from localStorage
  const loadLocationFromStorage = () => {
    try {
      const selectedLocationStr = localStorage.getItem("selectedLocation");

      if (!selectedLocationStr) {
        console.log("No location found in localStorage, using default");
        return;
      }

      const selectedLocation = JSON.parse(selectedLocationStr);
      console.log("Loaded location from localStorage:", selectedLocation);

      if (selectedLocation.latitude && selectedLocation.longitude) {
        const newLocationData = {
          address:
            selectedLocation.address ||
            selectedLocation.formatted_address ||
            "Location Selected",
          city:
            selectedLocation.city ||
            extractCityFromAddress(selectedLocation.address) ||
            "Unknown City",
          state:
            selectedLocation.state ||
            extractStateFromAddress(selectedLocation.address) ||
            "Unknown State",
          latitude: parseFloat(selectedLocation.latitude),
          longitude: parseFloat(selectedLocation.longitude),
        };

        setLocationData(newLocationData);

        // Update filters with latitude and longitude (hidden values)
        setFilters((prev) => ({
          ...prev,
          latitude: newLocationData.latitude,
          longitude: newLocationData.longitude,
        }));
      }
    } catch (error) {
      console.error("Error reading selectedLocation from localStorage:", error);
    }
  };

  // Load location from localStorage on component mount
  useEffect(() => {
    loadLocationFromStorage();
  }, []);

  return (
    <div
      className={`${
        styles.mymediator__filterContainer
      } bg-white rounded-lg shadow-sm ${
        isMobile
          ? "w-full max-w-sm transform transition-transform duration-300 ease-in-out z-40 p-4 h-full"
          : "h-full"
      } ${
        isFilterOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      <div className="h-full overflow-y-auto pb-4 px-2">
        <div className="mb-4 sticky top-0">
          <button
            onClick={handleApplyFilters}
            className="w-full bg-blue-900 my-4 cursor-pointer text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>

        {/* Categories Section */}
        <BikeCategoryFilter
          filters={filters}
          setFilters={setFilters}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
        />

        {/* Location Section */}
        <div className="mb-4">
          <div
            className="flex justify-between items-center cursor-pointer py-2 border-b"
            onClick={() => toggleSection("location")}
          >
            <h2 className="font-medium text-gray-800">Location</h2>
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${
                expandedSections.location ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden custom-scrollbar ${
              expandedSections.location ? "max-h-20 py-2" : "max-h-0"
            }`}
          >
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-2 text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              {locationData.city && locationData.state ? (
                <span>
                  {locationData.city}, {locationData.state}
                </span>
              ) : (
                <span></span>
              )}
            </div>
          </div>
        </div>

        <div className="py-1 text-sm font-medium">Filter</div>

        {/* Select Brand Section */}
        <BikeBrandModelFilter
          filters={filters}
          setFilters={setFilters}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
        />

        <BikePrizeRangeFilter
          filters={filters}
          setFilters={setFilters}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
        />

        {/* KM Driven Section */}
        <div className="mb-4">
          <div
            className="flex justify-between items-center cursor-pointer py-2 border-b"
            onClick={() => toggleSection("kmDriven")}
          >
            <h2 className="font-medium text-gray-800">KM Driven</h2>
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${
                expandedSections.kmDriven ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          <div
            className={`transition-all duration-300 ease-in-out ${
              expandedSections.kmDriven ? "py-2" : "max-h-0 overflow-hidden"
            }`}
          >
            <div className="grid grid-cols-1 gap-2">
              <div className="bg-gray-100 rounded text-sm p-4 flex justify-between">
                <div className="font-medium">Below 25,000 Km</div>
                <div className="text-gray-500 text-xs">310+ items</div>
              </div>
              <div className="bg-gray-100 rounded p-4 flex justify-between text-sm">
                <div className="font-medium">25,000 Km - 50,000 Km</div>
                <div className="text-gray-500 text-xs">110+ items</div>
              </div>
              <div className="bg-gray-100 rounded p-4 flex justify-between text-sm">
                <div className="font-medium">50,000 Km - 75,000 Km</div>
                <div className="text-gray-500 text-xs">110+ items</div>
              </div>
              <div className="bg-gray-100 rounded p-4 flex justify-between text-sm">
                <div className="font-medium">75,000 Km - 85,000 Km</div>
                <div className="text-gray-500 text-xs">110+ items</div>
              </div>
              <div className="bg-gray-100 rounded p-4 flex justify-between text-sm">
                <div className="font-medium">90,000 Km - 100,000 Km</div>
                <div className="text-gray-500 text-xs">110+ items</div>
              </div>
            </div>
          </div>
        </div>

        {/* Year Section */}
        <div className="mb-4">
          <div
            className="flex justify-between items-center cursor-pointer py-2 border-b"
            onClick={() => toggleSection("year")}
          >
            <h2 className="font-medium text-gray-800">Year</h2>
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${
                expandedSections.year ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          <div
            className={`transition-all duration-300 ease-in-out ${
              expandedSections.year ? "py-2" : "max-h-0 overflow-hidden"
            }`}
          >
            <div className="grid grid-cols-1 gap-2">
              <div className="bg-gray-100 rounded text-sm p-4 flex justify-between">
                <div className="font-medium">Under 3 Years</div>
                <div className="text-gray-500 text-xs">(1,000 + Bikes)</div>
              </div>
              <div className="bg-gray-100 rounded p-4 flex justify-between text-sm">
                <div className="font-medium">Under 5 Years</div>
                <div className="text-gray-500 text-xs">(1,524 + Bikes)</div>
              </div>
              <div className="bg-gray-100 rounded p-4 flex justify-between text-sm">
                <div className="font-medium">Under 7 Years</div>
                <div className="text-gray-500 text-xs">(2,453 + Bikes)</div>
              </div>
              <div className="bg-gray-100 rounded p-4 flex justify-between text-sm">
                <div className="font-medium">More then 3 Years</div>
                <div className="text-gray-500 text-xs">(500 + Bikes)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BikeFilter;