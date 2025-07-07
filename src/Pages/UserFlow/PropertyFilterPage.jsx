import React, { useState, useEffect } from "react";
import {
  PropertyFilter,
  PropertyListingGrid,
  BannerSlider,
  HeroSection,
} from "@/components";

import FilterIcon from "@mui/icons-material/FilterList";
import { useMediaQuery } from "react-responsive"; // For detecting mobile devices
import IMAGES from "@/utils/images.js";
import LoadMoreButton from "../../components/common/LoadMoreButton";
import { api } from "@/api/axios";

const PropertyFilterPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // Detect mobile devices
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(false);
  const [total, setTotal] = useState(0);

  // Add state for current filters
  const [currentFilters, setCurrentFilters] = useState({
    type: "property",
    price_range: "",
    bathroom_min: "",
    bedroom_min: "",
    furnished_id: "",
    super_area_min: "",
    super_area_max: "",
    bhk_id: "",
    maintenance_id: "",
    construction_status_id: "",
    building_direction_id: "",
    subcategory_id: "",
    latitude: "",
    longitude: "",
  });

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Helper function to get location from localStorage
  const getLocationFromStorage = () => {
    try {
      const selectedLocationStr = localStorage.getItem('selectedLocation');
      
      if (!selectedLocationStr) {
        return null;
      }
      
      const selectedLocation = JSON.parse(selectedLocationStr);
      
      // Check if the parsed object has required coordinates
      if (!selectedLocation.latitude || !selectedLocation.longitude) {
        return null;
      }
      
      return {
        latitude: parseFloat(selectedLocation.latitude),
        longitude: parseFloat(selectedLocation.longitude),
      };
    } catch (error) {
      console.error("Error reading selectedLocation from localStorage:", error);
      return null;
    }
  };

  const fetchProperties = async (page = 1, loadMore = false, filters = null) => {
    if (loadMore) setLoadingMore(true);
    else setLoading(true);

    try {
      // Get location from localStorage
      const location = getLocationFromStorage();

      // Use provided filters or current filters
      const filtersToUse = filters || currentFilters;

      // Build API parameters
      const params = new URLSearchParams({
        page: page.toString()
      });

      // Add filter parameters - only add if they have values
      Object.entries(filtersToUse).forEach(([key, value]) => {
        if (value && value !== "" && value !== null && value !== undefined) {
          // Handle arrays by converting to comma-separated strings
          if (Array.isArray(value)) {
            if (value.length > 0) {
              params.append(key, value.join(','));
            }
          } else {
            params.append(key, value.toString());
          }
        }
      });
      
      // Debug: Log the final URL and parameters
      console.log("=== API REQUEST INFO ===");
      console.log("Final API URL:", `/filter?${params.toString()}`);
      console.log("Filters being sent:", filtersToUse);
      console.log("URL Parameters:", Object.fromEntries(params.entries()));
      
      // Add location parameters if available
      if (location) {
        params.append('latitude', location.latitude.toString());
        params.append('longitude', location.longitude.toString());
      }

      // Use the filter endpoint
      const response = await api.get(`/filter?${params.toString()}`);
      
      // Debug: Log full API response to understand structure
      console.log("=== FULL API RESPONSE ===");
      console.log("Response Status:", response.status);
      console.log("Response Data:", JSON.stringify(response.data, null, 2));
      console.log("Response Data Type:", typeof response.data);
      console.log("Is Array:", Array.isArray(response.data));
      
      // Handle different possible response structures
      let result = {};
      let propertiesData = [];
      
      // Check various possible structures
      if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
        // Structure: { data: { data: [...], current_page: 1, ... } }
        console.log("Using structure: data.data.data");
        result = response.data.data;
        propertiesData = response.data.data.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        // Structure: { data: [...] }
        console.log("Using structure: data.data");
        result = response.data;
        propertiesData = response.data.data;
      } else if (response.data?.properties && Array.isArray(response.data.properties)) {
        // Structure: { properties: [...], pagination: {...} }
        console.log("Using structure: data.properties");
        propertiesData = response.data.properties;
        result = response.data.pagination || response.data;
      } else if (Array.isArray(response.data)) {
        // Structure: [property1, property2, ...]
        console.log("Using structure: direct array");
        propertiesData = response.data;
        result = { current_page: page, last_page: page, total: response.data.length, next_page_url: null };
      } else if (response.data?.items && Array.isArray(response.data.items)) {
        // Structure: { items: [...] }
        console.log("Using structure: data.items");
        propertiesData = response.data.items;
        result = response.data;
      } else if (response.data?.results && Array.isArray(response.data.results)) {
        // Structure: { results: [...] }
        console.log("Using structure: data.results");
        propertiesData = response.data.results;
        result = response.data;
      } else {
        // Try to find any array in the response
        console.log("Searching for arrays in response...");
        const findArrayInObject = (obj, path = '') => {
          for (const [key, value] of Object.entries(obj)) {
            const currentPath = path ? `${path}.${key}` : key;
            if (Array.isArray(value)) {
              console.log(`Found array at: ${currentPath}, length: ${value.length}`);
              return { data: value, path: currentPath };
            } else if (value && typeof value === 'object') {
              const found = findArrayInObject(value, currentPath);
              if (found) return found;
            }
          }
          return null;
        };
        
        const foundArray = findArrayInObject(response.data);
        if (foundArray) {
          console.log(`Using found array at: ${foundArray.path}`);
          propertiesData = foundArray.data;
          result = response.data;
        } else {
          console.log("No array found in response, using empty array");
          propertiesData = [];
          result = response.data || {};
        }
      }

      // Debug: Log processed data
      console.log("=== PROCESSED DATA ===");
      console.log("Properties Data:", propertiesData);
      console.log("Properties Length:", propertiesData?.length || 0);
      console.log("First Property:", propertiesData?.[0]);
      console.log("Result Object:", result);
      
      // Validate that we have an array
      if (!Array.isArray(propertiesData)) {
        console.error("Properties data is not an array:", typeof propertiesData);
        propertiesData = [];
      }

      // Update properties based on whether we're loading more or starting fresh
      if (page === 1) {
        console.log("Setting properties (fresh load):", propertiesData.length, "items");
        setProperties(propertiesData);
      } else {
        console.log("Adding properties (load more):", propertiesData.length, "items");
        setProperties((prev) => {
          const updated = [...prev, ...propertiesData];
          console.log("Total properties after load more:", updated.length);
          return updated;
        });
      }

      // Update pagination state with safe defaults
      setCurrentPage(result?.current_page || page);
      setLastPage(result?.last_page || page);
      setTotal(result?.total || propertiesData?.length || 0);

      // Check if there's more data to load
      const hasMore = (result?.next_page_url !== null && result?.next_page_url !== undefined) &&
          (result?.current_page || page) < (result?.last_page || page) &&
          propertiesData &&
          propertiesData.length > 0;
          
      console.log("Has more data:", hasMore);
      setHasMoreData(hasMore);
      
    } catch (err) {
      console.error("=== API ERROR ===");
      console.error("Error details:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      
      // Reset states on error
      if (page === 1) {
        setProperties([]);
      }
      setHasMoreData(false);
    } finally {
      if (loadMore) setLoadingMore(false);
      else setLoading(false);
    }
  };

  // Function to handle filter application
  const applyFilters = (newFilters) => {
    console.log("=== APPLY FILTERS CALLED ===");
    console.log("New filters received:", newFilters);
    console.log("Previous filters:", currentFilters);
    
    // Update current filters
    setCurrentFilters(newFilters);
    
    // Reset pagination to first page
    setCurrentPage(1);
    setProperties([]); // Clear existing properties
    
    // Fetch new properties with filters
    fetchProperties(1, false, newFilters);
    
    // Close filter on mobile after applying
    if (isMobile) {
      setIsFilterOpen(false);
    }
  };

  useEffect(() => {
    fetchProperties(1);
  }, []);

  const handleLoadMore = () => {
    // Only load more if we have more data and we're not already loading
    if (hasMoreData && !loadingMore && currentPage < lastPage) {
      fetchProperties(currentPage + 1, true);
    }
  };

  // Auto-load on scroll with throttling to prevent duplicates
  useEffect(() => {
    let isScrolling = false;

    const handleScroll = () => {
      // Prevent multiple rapid calls
      if (isScrolling) return;

      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500;

      // Only trigger auto-load if we have more data and we're not already loading
      if (nearBottom && hasMoreData && !loadingMore && currentPage < lastPage) {
        isScrolling = true;
        handleLoadMore();

        // Reset the flag after a short delay to prevent rapid consecutive calls
        setTimeout(() => {
          isScrolling = false;
        }, 1000);
      }
    };

    // Throttle scroll events
    let scrollTimeout;
    const throttledHandleScroll = () => {
      if (scrollTimeout) return;

      scrollTimeout = setTimeout(() => {
        handleScroll();
        scrollTimeout = null;
      }, 100);
    };

    window.addEventListener("scroll", throttledHandleScroll);
    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [currentPage, lastPage, loadingMore, hasMoreData]);

  const images = [
    IMAGES.propertybanner1,
    IMAGES.propertybanner2,
    IMAGES.propertybanner3,
    IMAGES.propertybanner1,
  ];

  return (
    <>
      <HeroSection tittle="Property List" />

      <div className="max-w-screen-xl max-w-[1200px] mx-auto px-4">
        <BannerSlider images={images} />

        {/* space div */}
        <div className="h-[10px]"></div>
        <h1 className="text-left text-black text-[24px] font-semibold">
          Property sale & Rent in Chennai
        </h1>
        {/* Main content area with filter and listings */}
        <div className="flex flex-col md:flex-row my-6">
          {/* Filter button for mobile view */}
          <div className="md:hidden mb-4">
            <button
              onClick={toggleFilter}
              className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center"
            >
              <FilterIcon />
              {isFilterOpen ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {/* Property filter - 30% on desktop, full width but hidden by default on mobile */}
          <div
            className={`fixed md:static inset-0 w-full md:w-3/12 ${
              isMobile
                ? "transform transition-transform duration-300 ease-in-out z-40 top-[17%]  my-[10px] bottom-[5px]"
                : ""
            } ${
              isFilterOpen
                ? "translate-x-0"
                : "-translate-x-full md:translate-x-0"
            }`}
          >
            {/* Close button for mobile */}
            {isMobile && (
              <button
                onClick={toggleFilter}
                className="fixed top-1 right-4 p-2 bg-red-600 text-white rounded-full z-50 w-[35px] h-[35px] flex items-center justify-center text-2xl"
              >
                &times; {/* Close icon (X) */}
              </button>
            )}

            <PropertyFilter
              isFilterOpen={isFilterOpen}
              isMobile={isMobile}
              onApplyFilters={applyFilters}
              currentFilters={currentFilters}
            />
          </div>

          {/* Overlay background - only on mobile when filter is open */}
          {isMobile && isFilterOpen && (
            <div
              className="fixed inset-0 bg-[#000000c2] bg-opacity-70 z-30"
              onClick={toggleFilter}
            />
          )}

          {/* Property listings - 70% on desktop, full width on mobile */}
          <div className="w-full md:w-9/12">
            {/* Debug Section - Remove this in production */}
            <div className="bg-gray-100 p-4 mb-4 rounded">
              <h3 className="font-bold mb-2">Debug Info:</h3>
              <p>Loading: {loading.toString()}</p>
              <p>Properties Count: {properties.length}</p>
              <p>Properties Array: {Array.isArray(properties).toString()}</p>
              <p>Current Page: {currentPage}</p>
              <p>Last Page: {lastPage}</p>
              <p>Total: {total}</p>
              <p>Has More: {hasMoreData.toString()}</p>
              {properties.length > 0 && (
                <details className="mt-2">
                  <summary>First Property Data</summary>
                  <pre className="text-xs mt-2 overflow-auto max-h-40">
                    {JSON.stringify(properties[0], null, 2)}
                  </pre>
                </details>
              )}
            </div>
            
            <PropertyListingGrid properties={properties} loading={loading} />

            {/* Load More Button - only shows if more pages exist and we have data */}
            {!loading && hasMoreData && properties.length > 0 && (
              <div className="mt-8 text-center">
                <LoadMoreButton
                  onClick={handleLoadMore}
                  loading={loadingMore}
                  disabled={!hasMoreData || loadingMore}
                />
              </div>
            )}

            {/* Optional: Show total count */}
            {!loading && properties.length > 0 && (
              <div className="mt-4 text-center text-gray-600 text-sm">
                Showing {properties.length} of {total} properties
              </div>
            )}

            {/* Show message when no more data */}
            {!loading && !hasMoreData && properties.length > 0 && (
              <div className="mt-4 text-center text-gray-500 text-sm">
                No more properties to load
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyFilterPage;