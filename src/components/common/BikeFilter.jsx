import React, { useState, useEffect } from "react";
import styles from "@/styles/Home.module.css";
import BikeCategoryFilter from "./filter/bike/BikeCategoryFilter";
import BikeBrandModelFilter from "./filter/bike/BikeBrandModelFilter";
import BikePrizeRangeFilter from "./filter/bike/BikePrizeRangeFilter";
import BikeKilometersFilter from "./filter/bike/BikeKilometersFilter";
import BikeYearFilter from "./filter/bike/BikeYearFilter";
import ListedBySection from "./filter/property/ListedBySection";
import BikeOwnerFilter from "./filter/bike/BikeOwnerFilter";
import BikeFuelTypeFilter from "./filter/bike/BikeFuelTypeFilter";
import BikeTransmissionFilter from "./filter/bike/BikeTransmissionFilter";
import { useLocation } from "react-router-dom";
const BikeFilter = ({
  isFilterOpen,
  isMobile,
  onApplyFilters,
  currentFilters,
  autoApply = false, 
}) => {
  const location = useLocation();
  const prevPathRef = React.useRef(location.pathname);

  // Clear filters when URL changes
  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname;
      handleClearAllFilters();
      console.log("URL changed, filters cleared.");
    }
  }, [location.pathname]);

  // Disable auto-apply on mobile devices
  const shouldAutoApply = autoApply && !isMobile;

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

  // Initialize filters state with current filters or default values
  const [filters, setFilters] = useState({
    type: "bike",
    price_range: "",
    listed_by_id: "",
    brand_id: "",
    model_id: "",
    year_filter: "",
    fuel_type_id: "",
    kilometer_range: "",
    engine_cc_range: "",
    number_of_owner_id: "",
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

  // Auto-apply filters when filters change (with debounce) - only if autoApply is enabled
  useEffect(() => {
    if (!shouldAutoApply) return; // Skip auto-apply if disabled or on mobile

    const timeoutId = setTimeout(() => {
      handleApplyFilters();
    }, 500); // 500ms debounce to prevent too many API calls

    return () => clearTimeout(timeoutId);
  }, [
    filters.price_range,
    filters.listed_by_id,
    filters.brand_id,
    filters.model_id,
    filters.year_filter,
    filters.fuel_type_id,
    filters.kilometer_range,
    filters.engine_cc_range,
    filters.number_of_owner_id,
    filters.subcategory_id,
    filters.kilometer_range,
    shouldAutoApply,
  ]); // Dependencies: all filter values that should trigger auto-apply

  // Function to handle filter application
  const handleApplyFilters = (shouldCloseFilter = true) => {
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
      type: "bike",
      price_range: "",
      listed_by_id: "",
      brand_id: "",
      model_id: "",
      year_filter: "",
      fuel_type_id: "",
      kilometer_range: "",
      engine_cc_range: "",
      number_of_owner_id: "",
      subcategory_id: "",
      latitude: filters.latitude, // Keep location
      longitude: filters.longitude, // Keep location
    };

    setFilters(clearedFilters);

     if (!shouldAutoApply) {
       if (onApplyFilters) {
         onApplyFilters(clearedFilters, false); // Don't close filter when clearing
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
          ? "w-full max-w-sm transform transition-transform duration-300 ease-in-out z-40 p-4 h-full"
          : "h-[600px] overflow-y-auto sticky top-[150px]"
      } ${
        isFilterOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      <div className="h-[600px] overflow-y-auto pb-4 px-2">
        <div className="py-6 sticky top-0 bg-[#fff] z-40">
          <div className="flex gap-2">
            <button
              onClick={() => handleApplyFilters(true)}
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

        <BikeKilometersFilter
          filters={filters}
          setFilters={setFilters}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
        />

        {/* Year Section */}

        <BikeYearFilter
          filters={filters}
          setFilters={setFilters}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
        />

        <ListedBySection
          filters={filters}
          setFilters={setFilters}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
        />

        <BikeFuelTypeFilter
          filters={filters}
          setFilters={setFilters}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
        />

        <BikeOwnerFilter
          filters={filters}
          setFilters={setFilters}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
        />

        {/* <BikeTransmissionFilter
         filters={filters}
          setFilters={setFilters}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
        
        /> */}
      </div>
    </div>
  );
};

export default BikeFilter;