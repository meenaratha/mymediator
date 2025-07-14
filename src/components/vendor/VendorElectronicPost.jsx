import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadMoreButton from '../common/LoadMoreButton';
import { api } from '../../api/axios';
import IMAGES from '../../utils/images';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { red } from "@mui/material/colors";
import DevicesIcon from "@mui/icons-material/Devices";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const VendorElectronicPost = () => {
  const navigate = useNavigate();
      const { vendorId } = useParams();
  
  const [electronics, setElectronics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [totalElectronics, setTotalElectronics] = useState(0);

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


  // Fetch electronics function
  const fetchElectronics = async (page = 1, append = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await api.get(`/gelectronics/foruser?page=${page}&vendor_id=${vendorId}`);
      
      // Handle the nested response structure (similar to properties, cars, and bikes)
      const responseData = response.data;
      const paginationData = responseData.data; // This contains the pagination info
      const electronicsData = Array.isArray(paginationData.data) ? paginationData.data : [];

      if (append) {
        setElectronics(prevElectronics => [...prevElectronics, ...electronicsData]);
      } else {
        setElectronics(electronicsData);
      }

      setCurrentPage(paginationData.current_page || 1);
      setTotalElectronics(paginationData.total || 0);
      setHasMorePages(paginationData.next_page_url !== null);

    } catch (error) {
      console.error('Error fetching electronics:', error);
      // Reset to empty array on error
      setElectronics([]);
      setHasMorePages(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load initial electronics
  useEffect(() => {
    fetchElectronics(1);
  }, []);

  // Load more electronics
  const handleLoadMore = () => {
    if (hasMorePages && !loadingMore) {
      fetchElectronics(currentPage + 1, true);
    }
  };

  // Handle electronic item click
  const handleElectronicClick = (electronic) => {
    navigate(`/electronic/${electronic.action_slug}`, { state: { electronic } });
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
      {/* Electronics Grid - Responsive columns: 1 on mobile, 2 on medium, 3 on large, 6 on xl */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {Array.isArray(electronics) && electronics.length > 0
          ? electronics.map((electronic) => (
              <div
                key={electronic.id}
                onClick={() => handleElectronicClick(electronic)}
                className="cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={electronic.image_url || IMAGES.placeholderimg}
                    alt={electronic.title || electronic.brand}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder-electronic.jpg"; // Fallback image
                    }}
                  />
                </div>
                <div className="p-2">
                  <div className="flex justify-between items-center mb-2">
                    <h3
                      className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[270px]"
                      title={electronic.product_name || electronic.item_name}
                    >
                      {electronic.title}
                    </h3>
                  </div>

                  <div className="flex items-center text-sm text-gray-500 mt-1 mb-2">
                    <LocationOnIcon
                      sx={{ color: red[500], fontSize: 16 }}
                      className="mr-1"
                    />
                    <span className="line-clamp-1">
                      {" "}
                      {electronic.district},{electronic.state}
                    </span>
                  </div>

                  {/* Brand and Model */}
                  <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600">
                    {electronic.brand && (
                      <span className="font-medium">{electronic.brand}</span>
                    )}
                    {electronic.model && (
                      <div className="flex items-center">
                        <DevicesIcon style={{ fontSize: 14 }} />
                        <span className="ml-1 truncate">
                          {electronic.model}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Price and Warranty */}

                  <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                    {electronic.post_year && (
                      <div className="flex items-center">
                        <CalendarTodayIcon style={{ fontSize: 14 }} />
                        <span className="ml-1">
                          {electronic.post_year || electronic.year}
                        </span>
                      </div>
                    )}
                    <span className="font-bold text-lg">
                      {formatPrice(electronic.price || electronic.amount)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          : !loading && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No electronics found.
              </div>
            )}
      </div>

      {/* Load More Button */}
      {hasMorePages && (
        <LoadMoreButton
          onClick={handleLoadMore}
          loading={loadingMore}
          disabled={!hasMorePages}
          loadingText="Loading more electronics..."
          buttonText="Load More Electronics"
        />
      )}

      {/* Electronics count info */}
      <div className="text-center mt-4 text-sm text-gray-600">
        Showing {electronics.length} of {totalElectronics} electronics
      </div>
    </>
  );
};

export default VendorElectronicPost;