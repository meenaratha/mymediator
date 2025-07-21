// Updated FreashRecommendationProducts component using your LoadMoreButton

import { Card, CardContent } from "@mui/material";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BedIcon from "@mui/icons-material/Bed";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DevicesIcon from "@mui/icons-material/Devices";
import SpeedIcon from "@mui/icons-material/Speed";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { red } from "@mui/material/colors";
import { useMediaQuery } from "react-responsive";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/api/axios";
import { toast } from "react-toastify";
import IMAGES from "@/utils/images";
import LoadMoreButton from "@/components/common/LoadMoreButton"; // Your existing component

const PropertyCard = ({ item, category }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const navigate = useNavigate();

  const handleClick = () => {
    switch (category) {
      case "property":
        navigate(`/properties/${item.action_slug || item.id}`);
        break;
      case "bike":
        navigate(`/bike/${item.action_slug || item.id}`);
        break;
      case "car":
        navigate(`/car/${item.action_slug || item.id}`);
        break;
      case "electronics":
        navigate(`/electronic/${item.action_slug || item.id}`);
        break;
      default:
        console.warn("Unknown category:", category);
    }
  };

  const formatPrice = (price) => {
    if (!price) return "Price on request";
    
    const numPrice = parseFloat(price);
    if (numPrice >= 10000000) {
      return `₹${(numPrice / 10000000).toFixed(1)}Cr`;
    } else if (numPrice >= 100000) {
      return `₹${(numPrice / 100000).toFixed(1)}L`;
    } else if (numPrice >= 1000) {
      return `₹${(numPrice / 1000).toFixed(1)}K`;
    }
    return `₹${numPrice.toLocaleString()}`;
  };

  const getLocation = () => {
    const parts = [item.city, item.district, item.state].filter(Boolean);
    return parts.join(", ") || "Location not specified";
  };

  const getFallbackImage = () => {
    switch (category) {
      case "property":
        return IMAGES.property1;
      case "bike":
        return IMAGES.bike1;
      case "car":
        return IMAGES.car1;
      case "electronics":
        return IMAGES.mac1;
      default:
        return IMAGES.propertybanner1;
    }
  };

  return (
    <Card
      className={`${
        isMobile ? "max-w-[300px]" : ""
      } max-w-[275px] w-full rounded-lg shadow-md overflow-hidden hover:shadow-lg mx-auto cursor-pointer transition-shadow duration-200`}
      onClick={handleClick}
    >
      <div className="relative">
        <img
          src={item.image_url || getFallbackImage()}
          alt={item.title || item.property_name}
          className="w-full h-36 object-cover"
          onError={(e) => {
            e.target.src = getFallbackImage();
          }}
        />
        <div className="absolute top-2 left-2">
          <span className="bg-blue-900 text-white px-2 py-1 rounded-full text-xs font-medium capitalize">
            {item.subcategory || category}
          </span>
        </div>
        {item.status === "sold" && (
          <div className="absolute top-2 right-2">
            <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium">
              Sold
            </span>
          </div>
        )}
      </div>

      <CardContent className="p-3">
        <h3
          className="font-bold text-lg truncate"
          title={item.title || item.property_name}
        >
          {item.title || item.property_name}
        </h3>

        <div className="flex items-center text-sm text-gray-500 mt-1">
          <LocationOnIcon sx={{ color: red[500], fontSize: 16 }} />
          <span className="truncate ml-1">{getLocation()}</span>
        </div>

        {/* Category-specific details */}
        {category === "property" && (
          <div className="flex items-center mt-2 space-x-4">
            {/* {item.super_builtup_area && (
              <div className="flex items-center">
                <SquareFootIcon style={{ fontSize: 14 }} />
                <span className="ml-1 text-sm">{item.super_builtup_area} Sq.ft</span>
              </div>
            )} */}
            {item.plot_area && (
              <div className="flex items-center">
                <SquareFootIcon style={{ fontSize: 14 }} />
                <span className="ml-1 text-sm">{item.plot_area} Sq.ft</span>
              </div>
            )}
            {item.bhk && (
              <div className="flex items-center">
                <BedIcon style={{ fontSize: 14 }} />
                <span className="ml-1 text-sm">{item.bhk} </span>
              </div>
            )}
          </div>
        )}

        {(category === "bike" || category === "car") && (
          <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600 flex-wrap gap-2">
            {item.brand && (
              <span className="font-medium truncate max-w-[120px] overflow-hidden whitespace-nowrap">
                {item.brand}
              </span>
            )}

            {item.kilometers && (
              <div className="flex items-center">
                <SpeedIcon style={{ fontSize: 14 }} />
                <span className="ml-1">{item.kilometers}k km</span>
              </div>
            )}
          </div>
        )}

        {category === "electronics" && (
          <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600">
            {item.brand && (
              <span className="font-medium truncate max-w-[80px] overflow-hidden whitespace-nowrap">
                {item.brand}
              </span>
            )}
            {item.subcategory && (
              <div className="flex items-center truncate max-w-[100px] overflow-hidden whitespace-nowrap">
                <DevicesIcon style={{ fontSize: 14 }} />
                <span className="ml-1 truncate">{item.subcategory}</span>
              </div>
            )}
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
          {/* <span className="text-sm text-gray-500">
            {item.building_direction || 
             (item.fuel_type && `${item.fuel_type}`) ||
             (item.engine_cc && `${item.engine_cc} CC`) ||
             ""}
          </span> */}

          {item.year && (
            <div className="flex items-center">
              <CalendarTodayIcon style={{ fontSize: 14 }} />
              <span className="ml-1">{item.year}</span>
            </div>
          )}
          {/* <span className="font-bold text-lg">
            {formatPrice(item.price || item.amount)}
          </span> */}
          <span className="font-bold text-lg">{item.price || item.amount}</span>
        </div>
      </CardContent>
    </Card>
  );
};

const FreashRecommendationProducts = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(false);
  const [error, setError] = useState(null);

  // Fetch listings from API
  const fetchListings = async (page = 1, loadMore = false) => {
    if (loadMore) setLoadingMore(true);
    else setLoading(true);
    
    setError(null);

    try {
      const response = await api.get(`/all-listings?page=${page}`);
      const result = response.data?.data;

      if (result) {
        const newListings = result.data || [];
        
        setListings(prev => 
          page === 1 ? newListings : [...prev, ...newListings]
        );
        
        setCurrentPage(result.current_page || page);
        setLastPage(result.last_page || 1);
        setTotal(result.total || 0);
        setHasMoreData(
          result.next_page_url !== null &&
          result.current_page < result.last_page &&
          newListings.length > 0
        );

        console.log(`✅ Loaded ${newListings.length} listings from page ${page}`);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("❌ Failed to fetch listings:", err);
      setError(err.message || "Failed to load listings");
      
      if (page === 1) {
        setListings([]);
      }
      setHasMoreData(false);
      
      if (page === 1 || !err.response) {
        toast.error("Failed to load fresh recommendations");
      }
    } finally {
      if (loadMore) setLoadingMore(false);
      else setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings(1);
  }, []);

  const handleLoadMore = () => {
    if (hasMoreData && !loadingMore && currentPage < lastPage) {
      fetchListings(currentPage + 1, true);
    }
  };

  const handleRetry = () => {
    setListings([]);
    setCurrentPage(1);
    fetchListings(1);
  };

  // Loading skeleton component
  const LoadingSkeleton = ({ count = 10 }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-items-center">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="max-w-[275px] w-full">
          <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="h-36 bg-gray-200"></div>
            <div className="p-3">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-10 pt-[10px]">
      {loading ? (
        <LoadingSkeleton />
      ) : error && listings.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-medium text-red-800 mb-2">
              Failed to Load Recommendations
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No listings available at the moment.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-items-center">
            {listings.map((item) => (
              <PropertyCard
                key={`${item.type}-${item.id}`}
                item={item}
                category={item.type}
              />
            ))}
          </div>

          {/* Using your LoadMoreButton component */}
          {hasMoreData && (
            <LoadMoreButton
              onClick={handleLoadMore}
              loading={loadingMore}
              disabled={!hasMoreData}
              loadingText="Loading ..."
              // buttonText={`Load More (${total - listings.length} remaining)`}
              buttonText="Load More"
              className="mt-8"
            />
          )}

          {/* Stats */}
          <div className="text-center mt-4 text-gray-600 text-sm">
            Showing {listings.length} of {total} listings
          </div>

          {/* End message */}
          {!hasMoreData && listings.length > 0 && (
            <div className="text-center mt-4 text-gray-500 text-sm">
              🎉 You've seen all available listings!
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FreashRecommendationProducts;