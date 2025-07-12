import React, { useState, useEffect } from "react";
import FilterIcon from "@mui/icons-material/FilterList";

import styles from "@/styles/Home.module.css";
import IMAGES from "@/utils/images.js";
import ElectronicCategoryFilter from "./filter/electronics/ElectronicCategoryFilter";
import ElectronicsBrandModelSection from "./filter/electronics/ElectronicsBrandModelSection";
import ElectronicPrizeRange from "./filter/electronics/ElectronicPrizeRange";
import ElectronicYearRangeSection from "./filter/electronics/ElectronicYearRangeSection";
import { useLocation } from "react-router-dom";

const ElectronicsFilter = ({
  isFilterOpen,
  isMobile,
  onApplyFilters,
  currentFilters,
  autoApply = true, // New prop to enable/disable auto-apply
}) => {
  const location = useLocation();
const prevPathRef = React.useRef(location.pathname);

useEffect(() => {
  if (prevPathRef.current !== location.pathname) {
    prevPathRef.current = location.pathname;

    // Call your clear filters function
    handleClearAllFilters();
    console.log("URL changed, filters cleared.");
  }
}, [location.pathname]);


  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    location: true,
    brand: true,
    price: true,
    year: true,
    condition: false,
    warranty: false,
  });

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCondition, setSelectedCondition] = useState(null);

  // Initialize filters state with current filters or default values
  const [filters, setFilters] = useState({
    type: "electronics",
    price_range: "",
    subcategory_id: "",
    year_filter: "",
    brand_id: "",
    model_id: "",
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

  // Auto-apply filters when filters change (with debounce)
  useEffect(() => {
    if (!autoApply) return; // Skip auto-apply if disabled

    const timeoutId = setTimeout(() => {
      handleApplyFilters();
    }, 500); // 500ms debounce to prevent too many API calls

    return () => clearTimeout(timeoutId);
  }, [
    filters.price_range,
    filters.brand,
    filters.model,
    filters.year_filter,
    filters.subcategory_id,
    autoApply,
  ]); // Dependencies: all filter values that should trigger auto-apply



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

  // Clear all filters function
  const handleClearAllFilters = () => {
    const clearedFilters = {
      type: "electronics",
      price_range: "",
      brand: "",
      model: "",
      year_filter: "",
      subcategory_id: "",
      latitude: filters.latitude, // Keep location
      longitude: filters.longitude, // Keep location
    };

    setFilters(clearedFilters);

    // If auto-apply is disabled, manually apply the cleared filters
    if (!autoApply) {
      if (onApplyFilters) {
        onApplyFilters(clearedFilters);
      }
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
          ? "w-full max-w-sm transform transition-transform duration-300 ease-in-out z-40 p-4 pb-[20px] h-full"
          : "h-[600px] overflow-y-auto sticky top-[150px]"
      } ${
        isFilterOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      <div className="h-[600px] overflow-y-auto pb-4 px-2">
        <div className="py-6 sticky top-0 bg-[#fff] z-40">
         <div className="flex gap-2">
    <button
      onClick={handleApplyFilters}
      className="flex-1 bg-blue-900 cursor-pointer text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
    >
      Apply Filters
    </button>
    <button
      onClick={handleClearAllFilters}
      className="flex-1 bg-gray-500 cursor-pointer text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
    >
      Clear Filters
    </button>
  </div>
        </div>

        {/* Categories Section */}
        <ElectronicCategoryFilter
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

        {/* Brand & Model Section */}

        <ElectronicsBrandModelSection
          filters={filters}
          setFilters={setFilters}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
        />

        {/* Price Section */}
        <ElectronicPrizeRange
          filters={filters}
          setFilters={setFilters}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
        />

        {/* Year Section */}
        <ElectronicYearRangeSection
          filters={filters}
          setFilters={setFilters}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
        />

        
       
      </div>
    </div>
  );
};

export default ElectronicsFilter;
