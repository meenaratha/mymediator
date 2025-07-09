import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadMoreButton from '../common/LoadMoreButton';
import { api } from '../../api/axios';
import IMAGES from '../../utils/images';

const VendorElectronicPost = () => {
  const navigate = useNavigate();
      const { vendorId } = useParams();
  
  const [electronics, setElectronics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [totalElectronics, setTotalElectronics] = useState(0);

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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.isArray(electronics) && electronics.length > 0 ? (
          electronics.map((electronic) => (
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
                    e.target.src = '/placeholder-electronic.jpg'; // Fallback image
                  }}
                />
              </div>
              <div className="p-2">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-full" title={electronic.product_name || electronic.item_name}>
                    {electronic.title }
                  </h3>
                </div>
                
                {/* Electronics details row 1 - Brand and Category */}
                <div className="flex items-center gap-1 text-xs text-gray-600 mb-1 overflow-hidden">
                  <div className="flex items-center flex-shrink-0">
                    <span className="inline-block mr-1 whitespace-nowrap">{electronic.brand || electronic.brand_name}</span>
                    <span className="mx-1 flex-shrink-0">|</span>
                  </div>
                  <div className="flex items-center overflow-hidden text-ellipsis whitespace-nowrap">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-tag flex-shrink-0" viewBox="0 0 16 16">
                      <path d="M6 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-1 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0z"/>
                      <path d="M2 1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 1 6.586V2a1 1 0 0 1 1-1zm0 5.586 7 7L13.586 9l-7-7H2v4.586z"/>
                    </svg>
                    <span className="ml-1 overflow-hidden text-ellipsis">{electronic.model_name || electronic.model}</span>
                  </div>
                </div>
                
              
                
                {/* Price and Warranty */}
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center overflow-hidden text-ellipsis whitespace-nowrap">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-calendar-check flex-shrink-0" viewBox="0 0 16 16">
                      <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                      <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                    </svg>
                    <span className="ml-1 overflow-hidden text-ellipsis">
                      {electronic.year || "2025" }
                    </span>
                  </div>
                  <div className="flex items-center font-semibold flex-shrink-0">
                    <span className="text-sm whitespace-nowrap">
                      ₹ {electronic.price }
                    </span>
                  </div>
                </div>
                
               
              </div>
            </div>
          ))
        ) : (
          !loading && (
            <div className="col-span-full text-center py-8 text-gray-500">
              No electronics found.
            </div>
          )
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