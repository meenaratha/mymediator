import React, { useState, useEffect } from "react";
import { HeroSection, BannerSlider, LoadMoreButton } from "@/components";
import FilterIcon from "@mui/icons-material/FilterList";
import { useMediaQuery } from "react-responsive";
import IMAGES from "@/utils/images.js";
import BikeFilter from "../../components/common/BikeFilter";
import BikeListingGrid from "../../components/common/BikeListingGrid";
import { api } from "@/api/axios";

const BikesPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [bikes, setBikes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(false);
  const [total, setTotal] = useState(0);

  // Add state for current filters
  const [currentFilters, setCurrentFilters] = useState({
    type: "bike",
    price_range: "",
    subcategory_id: "",
    year_filter: "",
    brand_id: "",
    model_id: "",
    latitude: "",
    longitude: "",
    engine_cc_range: "",
    kilometers_range: "",
    fuel_type: "",
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

  // const fetchBikes = async (page = 1, loadMore = false) => {
  //   if (loadMore) setLoadingMore(true);
  //   else setLoading(true);

  //   try {
  //     // Get location from localStorage
  //     const location = getLocationFromStorage();
      
  //     // Build API parameters
  //     const params = new URLSearchParams({
  //       page: page.toString()
  //     });
      
  //     // Add location parameters if available
  //     if (location) {
  //       // params.append('latitude', location.latitude.toString());
  //       // params.append('longitude', location.longitude.toString());
        
  //     }

  //     const response = await api.get(`/gbike/list?${params.toString()}`);
  //     const result = response.data?.data;

  //     // Debug: Log API response
  //     console.log("Bikes API Pagination Data:", {
  //       current_page: result.current_page,
  //       last_page: result.last_page,
  //       data_length: result.data.length,
  //       total: result.total,
  //       next_page_url: result.next_page_url,
  //       location_params: location ? `lat: ${location.latitude}, lng: ${location.longitude}, city: ${location.city || 'N/A'}` : 'No location data'
  //     });

  //     // Update bikes based on whether we're loading more or starting fresh
  //     if (page === 1) {
  //       setBikes(result.data || []);
  //     } else {
  //       setBikes((prev) => [...prev, ...(result.data || [])]);
  //     }

  //     // Update pagination state
  //     setCurrentPage(result.current_page);
  //     setLastPage(result.last_page);
  //     setTotal(result.total);

  //     // Check if there's more data to load
  //     setHasMoreData(
  //       result.next_page_url !== null &&
  //         result.current_page < result.last_page &&
  //         result.data &&
  //         result.data.length > 0
  //     );
  //   } catch (err) {
  //     console.error("Failed to load bikes", err);
  //     // Reset states on error
  //     if (page === 1) {
  //       setBikes([]);
  //     }
  //     setHasMoreData(false);
  //   } finally {
  //     if (loadMore) setLoadingMore(false);
  //     else setLoading(false);
  //   }
  // };

const fetchBikes = async (page = 1, loadMore = false, filters = null) => {
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
      
      // Add location parameters if available
      if (location) {
        params.append('latitude', location.latitude.toString());
        params.append('longitude', location.longitude.toString());
        
  
      }

      // Debug: Log the final URL and parameters
      console.log("=== API REQUEST INFO ===");
      console.log("Final API URL:", `/filter?${params.toString()}`);
      console.log("Filters being sent:", filtersToUse);
      console.log("URL Parameters:", Object.fromEntries(params.entries()));

      // Use the filter endpoint
      const response = await api.get(`/filter?${params.toString()}`);
      
      // Debug: Log full API response to understand structure
      console.log("=== FULL API RESPONSE ===");
      console.log("Response Status:", response.status);
      console.log("Response Data:", response.data);
      
      // Based on your API response structure, the data is directly in response.data.data
     

const result = response.data.data;
const bikeData = result?.data || [];

      // Debug: Log processed data
      console.log("=== PROCESSED DATA ===");
      console.log("Bikes Data:", bikeData);
      console.log("Bikes Length:", bikeData?.length || 0);
      console.log("First Bike:", bikeData?.[0]);
      console.log("Result Object:", result);
      
      // Validate that we have an array
      if (!Array.isArray(bikeData)) {
        console.error("Bikes data is not an array:", typeof bikeData);
        setBikes([]);
        return;
      }

      // Update bikes based on whether we're loading more or starting fresh
      if (page === 1) {
        console.log("Setting bikes (fresh load):", bikeData.length, "items");
        setBikes(bikeData);
      } else {
        console.log("Adding bikes (load more):", bikeData.length, "items");
        setBikes((prev) => {
          const updated = [...prev, ...bikeData];
          console.log("Total bikes after load more:", updated.length);
          return updated;
        });
      }

      // Update pagination state with safe defaults
      setCurrentPage(result?.current_page || page);
      setLastPage(result?.last_page || page);
      setTotal(result?.total || bikeData?.length || 0);

      // Check if there's more data to load
      const hasMore = (result?.next_page_url !== null && result?.next_page_url !== undefined) &&
          (result?.current_page || page) < (result?.last_page || page) &&
          bikeData &&
          bikeData.length > 0;
          
      console.log("Has more data:", hasMore);
      setHasMoreData(hasMore);
      
    } catch (err) {
      console.error("=== API ERROR ===");
      console.error("Error details:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      
      // Reset states on error
      if (page === 1) {
        setBikes([]);
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
    setBikes([]); // Clear existing bikes
    
    // Fetch new bikes with filters
    fetchBikes(1, false, newFilters);
    
    // Close filter on mobile after applying
    if (isMobile) {
      setIsFilterOpen(false);
    }
  };


  useEffect(() => {
    fetchBikes(1);
  }, []);

  const handleLoadMore = () => {
    // Only load more if we have more data and we're not already loading
    if (hasMoreData && !loadingMore && currentPage < lastPage) {
      fetchBikes(currentPage + 1, true);
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

// slider

  // State for slider images
  const [sliderImages, setSliderImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Fallback images in case API fails
  const fallbackImages = [
    IMAGES.placeholderimg,
    IMAGES.placeholderimg,
    IMAGES.placeholderimg,
    IMAGES.placeholderimg,
  ];

  // Fetch slider images from API
  const fetchSliderImages = async () => {
    setLoadingImages(true);
    setImageError(false);

    try {
      const response = await api.get("/sliderimage?category_id=4"); // Adjust endpoint as needed
      const result = response.data;

      // Handle different API response structures
      let images = [];
      if (result.data && Array.isArray(result.data)) {
        images = result.data;
      } else if (Array.isArray(result)) {
        images = result;
      } else if (result.images && Array.isArray(result.images)) {
        images = result.images;
      }

      // Extract image URLs from the response
      const imageUrls = images
        .map((item) => {
          // Handle different possible image URL field names
          return (
            item.image_url ||
            item.url ||
            item.image ||
            item.path ||
            item.src ||
            item
          ); // In case it's already a URL string
        })
        .filter((url) => url); // Remove any null/undefined values

      if (imageUrls.length > 0) {
        setSliderImages(imageUrls);
        console.log(
          "✅ Slider images loaded successfully:",
          imageUrls.length,
          "images"
        );
      } else {
        console.warn("⚠️ No valid image URLs found in API response");
        setSliderImages(fallbackImages);
        setImageError(true);
      }
    } catch (error) {
      console.error("❌ Failed to fetch slider images:", error);
      setSliderImages(fallbackImages);
      setImageError(true);

      // Only show error toast if it's a network error or 500 error
      // Don't show for 404 or other expected errors
      if (error.response?.status >= 500 || !error.response) {
        toast.error("Failed to load slider images");
      }
    } finally {
      setLoadingImages(false);
    }
  };

  // Load images on component mount
  useEffect(() => {
    fetchSliderImages();
  }, []);
  return (
    <>
      <HeroSection tittle="Bikes for Sale" />

      <div className="max-w-screen-xl max-w-[1200px] mx-auto px-4">
        <BannerSlider
          images={sliderImages}
          isLoading={loadingImages}
          hasError={imageError}
        />

        {/* space div */}
        <div className="h-[10px]"></div>
        <h1 className="text-left text-black text-[24px] font-semibold">
          Bikes in Chennai
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

          {/* Bike filter - 30% on desktop, full width but hidden by default on mobile */}
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

            <BikeFilter
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

          {/* Bike listings - 70% on desktop, full width on mobile */}
          <div className="w-full md:w-9/12">
            <BikeListingGrid bikes={bikes} loading={loading} />

            {/* Load More Button - only shows if more pages exist and we have data */}
            {!loading && hasMoreData && bikes.length > 0 && (
              <div className="mt-8 text-center">
                <LoadMoreButton
                  onClick={handleLoadMore}
                  loading={loadingMore}
                  disabled={!hasMoreData || loadingMore}
                />
              </div>
            )}

            {/* Optional: Show total count */}
            {!loading && bikes.length > 0 && (
              <div className="mt-4 text-center text-gray-600 text-sm">
                Showing {bikes.length} of {total} bikes
              </div>
            )}

            {/* Show message when no more data */}
            {!loading && !hasMoreData && bikes.length > 0 && (
              <div className="mt-4 text-center text-gray-500 text-sm">
                No more bikes to load
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BikesPage;