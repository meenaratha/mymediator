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
        // address: selectedLocation.address || '',
        // city: selectedLocation.city || '',
        // state: selectedLocation.state || '',
        // country: selectedLocation.country || ''
      };
    } catch (error) {
      console.error("Error reading selectedLocation from localStorage:", error);
      return null;
    }
  };

  const fetchProperties = async (page = 1, loadMore = false) => {
    if (loadMore) setLoadingMore(true);
    else setLoading(true);

    try {

      // Get location from localStorage
      const location = getLocationFromStorage();

       // Build API parameters
      const params = new URLSearchParams({
        page: page.toString()
      });
      
      // Add location parameters if available
      if (location) {
        params.append('latitude', location.latitude.toString());
        params.append('longitude', location.longitude.toString());
        
      }
      const response = await api.get(`/properties/list?${params.toString()}`);
      const result = response.data?.data;

      // Debug: Log API response
      console.log("API Pagination Data:", {
        current_page: result.current_page,
        last_page: result.last_page,
        data_length: result.data.length,
        total: result.total,
        next_page_url: result.next_page_url,
      });

      // Update properties based on whether we're loading more or starting fresh
      if (page === 1) {
        setProperties(result.data || []);
      } else {
        setProperties((prev) => [...prev, ...(result.data || [])]);
      }

      // Update pagination state
      setCurrentPage(result.current_page);
      setLastPage(result.last_page);
      setTotal(result.total);

      // Check if there's more data to load
      // Use next_page_url as the primary indicator, fallback to page comparison
      setHasMoreData(
        result.next_page_url !== null &&
          result.current_page < result.last_page &&
          result.data &&
          result.data.length > 0
      );
    } catch (err) {
      console.error("Failed to load properties", err);
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
