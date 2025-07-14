import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadMoreButton from '../common/LoadMoreButton';
import { api } from '../../api/axios';
import { red } from "@mui/material/colors";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SpeedIcon from "@mui/icons-material/Speed";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const VendorBike = () => {
  const navigate = useNavigate();
          const { vendorId } = useParams();
  
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [totalBikes, setTotalBikes] = useState(0);

  // Fetch bikes function
  const fetchBikes = async (page = 1, append = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await api.get(`/gbike/list/foruser?page=${page}&vendor_id=${vendorId}`);
      
      // Handle the nested response structure (similar to properties and cars)
      const responseData = response.data;
      const paginationData = responseData.data; // This contains the pagination info
      const bikesData = Array.isArray(paginationData.data) ? paginationData.data : [];

      if (append) {
        setBikes(prevBikes => [...prevBikes, ...bikesData]);
      } else {
        setBikes(bikesData);
      }

      setCurrentPage(paginationData.current_page || 1);
      setTotalBikes(paginationData.total || 0);
      setHasMorePages(paginationData.next_page_url !== null);

    } catch (error) {
      console.error('Error fetching bikes:', error);
      // Reset to empty array on error
      setBikes([]);
      setHasMorePages(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load initial bikes
  useEffect(() => {
    fetchBikes(1);
  }, []);

  // Load more bikes
  const handleLoadMore = () => {
    if (hasMorePages && !loadingMore) {
      fetchBikes(currentPage + 1, true);
    }
  };

  // Handle bike click
  const handleBikeClick = (bike) => {
    navigate(`/bike/${bike.action_slug}`, { state: { bike } });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      {/* Bike Grid - Responsive columns: 1 on mobile, 2 on medium, 3 on large, 6 on xl */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {Array.isArray(bikes) && bikes.length > 0
          ? bikes.map((bike) => (
              <div
                key={bike.id}
                onClick={() => handleBikeClick(bike)}
                className="cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={bike.image_url}
                    alt={bike.title || bike.brand}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder-bike.jpg"; // Fallback image
                    }}
                  />
                </div>
                <div className="p-2">
                  <div className="flex justify-between items-center mb-2">
                    <h3
                      className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-full"
                      title={bike.bike_name || bike.brand}
                    >
                      {bike.title || bike.brand}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between mt-2 space-x-4 text-sm text-gray-600 flex-wrap gap-2">
                    {bike.brand !== null ? (
                      <span className="font-medium">{bike.brand}</span>
                    ) : (
                      <span className="font-medium">{bike.brand_name}</span>
                    )}

                    {bike.kilometers && (
                      <div className="flex items-center">
                        <SpeedIcon style={{ fontSize: 14 }} />
                        <span className="ml-1">{bike.kilometers}k km</span>
                      </div>
                    )}
                  </div>

                  {/* Price and KM driven */}
                  <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                    <div className="flex items-center">
                      <CalendarTodayIcon style={{ fontSize: 14 }} />
                      <span className="ml-1">{bike.post_year}</span>
                    </div>

                    <span className="font-bold text-lg">
                    
                      ₹ {bike.price } 
                    </span>
                  </div>

                 
                </div>
              </div>
            ))
          : !loading && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No bikes found.
              </div>
            )}
      </div>

      {/* Load More Button */}
      {hasMorePages && (
        <LoadMoreButton
          onClick={handleLoadMore}
          loading={loadingMore}
          disabled={!hasMorePages}
          loadingText="Loading more bikes..."
          buttonText="Load More Bikes"
        />
      )}

      {/* Bikes count info */}
      <div className="text-center mt-4 text-sm text-gray-600">
        Showing {bikes.length} of {totalBikes} bikes
      </div>
    </>
  );
};

export default VendorBike;