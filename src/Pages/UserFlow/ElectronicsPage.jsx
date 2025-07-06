import React, { useState, useEffect } from "react";
import { HeroSection, BannerSlider, LoadMoreButton } from "@/components";
import FilterIcon from "@mui/icons-material/FilterList";
import { useMediaQuery } from "react-responsive";
import IMAGES from "@/utils/images.js";
import ElectronicsFilter from "../../components/common/ElectronicsFilter";
import ElectronicsListingGrid from "../../components/common/ElectronicsListingGrid";
import { api } from "@/api/axios";

const ElectronicsFilterPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [electronics, setElectronics] = useState([]);
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
        address: selectedLocation.address || '',
        city: selectedLocation.city || '',
        state: selectedLocation.state || '',
        country: selectedLocation.country || ''
      };
    } catch (error) {
      console.error("Error reading selectedLocation from localStorage:", error);
      return null;
    }
  };

  const fetchElectronics = async (page = 1, loadMore = false) => {
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
        
        // Optionally add other location details
        if (location.city) params.append('city', location.city);
        if (location.state) params.append('state', location.state);
        if (location.country) params.append('country', location.country);
      }

      const response = await api.get(`/gelectronics/list?${params.toString()}`);
      const result = response.data?.data;

      // Debug: Log API response
      console.log("Electronics API Pagination Data:", {
        current_page: result.current_page,
        last_page: result.last_page,
        data_length: result.data.length,
        total: result.total,
        next_page_url: result.next_page_url,
        location_params: location ? `lat: ${location.latitude}, lng: ${location.longitude}, city: ${location.city || 'N/A'}` : 'No location data'
      });

      // Update electronics based on whether we're loading more or starting fresh
      if (page === 1) {
        setElectronics(result.data || []);
      } else {
        setElectronics((prev) => [...prev, ...(result.data || [])]);
      }

      // Update pagination state
      setCurrentPage(result.current_page);
      setLastPage(result.last_page);
      setTotal(result.total);

      // Check if there's more data to load
      setHasMoreData(
        result.next_page_url !== null &&
          result.current_page < result.last_page &&
          result.data &&
          result.data.length > 0
      );
    } catch (err) {
      console.error("Failed to load electronics", err);
      // Reset states on error
      if (page === 1) {
        setElectronics([]);
      }
      setHasMoreData(false);
    } finally {
      if (loadMore) setLoadingMore(false);
      else setLoading(false);
    }
  };

  useEffect(() => {
    fetchElectronics(1);
  }, []);

  const handleLoadMore = () => {
    // Only load more if we have more data and we're not already loading
    if (hasMoreData && !loadingMore && currentPage < lastPage) {
      fetchElectronics(currentPage + 1, true);
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

  const images = [IMAGES.mac9, IMAGES.mac6, IMAGES.mac7, IMAGES.mac8];

  return (
    <>
      <HeroSection tittle="Electronics List" />

      <div className="max-w-screen-xl max-w-[1200px] mx-auto px-4">
        <BannerSlider images={images} />

        {/* space div */}
        <div className="h-[10px]"></div>
        <h1 className="text-left text-black text-[24px] font-semibold">
          Electronics & Appliances in Chennai
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

          {/* Electronics filter - 30% on desktop, full width but hidden by default on mobile */}
          <div
            className={`fixed md:static inset-0 w-full md:w-3/12 ${
              isMobile
                ? "transform transition-transform duration-300 ease-in-out z-40 top-[17%] my-[10px] bottom-[5px]"
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

            <ElectronicsFilter
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

          {/* Electronics listings - 70% on desktop, full width on mobile */}
          <div className="w-full md:w-9/12">
            <ElectronicsListingGrid electronics={electronics} loading={loading} />

            {/* Load More Button - only shows if more pages exist and we have data */}
            {!loading && hasMoreData && electronics.length > 0 && (
              <div className="mt-8 text-center">
                <LoadMoreButton
                  onClick={handleLoadMore}
                  loading={loadingMore}
                  disabled={!hasMoreData || loadingMore}
                />
              </div>
            )}

            {/* Optional: Show total count */}
            {!loading && electronics.length > 0 && (
              <div className="mt-4 text-center text-gray-600 text-sm">
                Showing {electronics.length} of {total} electronics
              </div>
            )}

            {/* Show message when no more data */}
            {!loading && !hasMoreData && electronics.length > 0 && (
              <div className="mt-4 text-center text-gray-500 text-sm">
                No more electronics to load
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ElectronicsFilterPage;