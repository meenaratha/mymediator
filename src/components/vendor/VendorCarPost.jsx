import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadMoreButton from '../common/LoadMoreButton';
import { api } from '../../api/axios';

const VendorCarPost = () => {
  const navigate = useNavigate();
        const { vendorId } = useParams();
  
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [totalCars, setTotalCars] = useState(0);

  // Fetch cars function
  const fetchCars = async (page = 1, append = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await api.get(`/gcar/list/foruser?page=${page}&vendor_id=${vendorId}`);
      
      // Handle the nested response structure (similar to properties)
      const responseData = response.data;
      const paginationData = responseData.data; // This contains the pagination info
      const carsData = Array.isArray(paginationData.data) ? paginationData.data : [];

      if (append) {
        setCars(prevCars => [...prevCars, ...carsData]);
      } else {
        setCars(carsData);
      }

      setCurrentPage(paginationData.current_page || 1);
      setTotalCars(paginationData.total || 0);
      setHasMorePages(paginationData.next_page_url !== null);

    } catch (error) {
      console.error('Error fetching cars:', error);
      // Reset to empty array on error
      setCars([]);
      setHasMorePages(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load initial cars
  useEffect(() => {
    fetchCars(1);
  }, []);

  // Load more cars
  const handleLoadMore = () => {
    if (hasMorePages && !loadingMore) {
      fetchCars(currentPage + 1, true);
    }
  };

  // Handle car click
  const handleCarClick = (car) => {
    navigate(`/car/${car.action_slug}`, { state: { car } });
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
      {/* Car Grid - Responsive columns: 1 on mobile, 2 on medium, 3 on large, 6 on xl */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {Array.isArray(cars) && cars.length > 0 ? (
          cars.map((car) => (
            <div 
              key={car.id}  
              onClick={() => handleCarClick(car)}
              className="cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="relative h-32 overflow-hidden">
                <img 
                  src={car.image_url || '/placeholder-car.jpg'} 
                  alt={car.title || car.brand} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/placeholder-car.jpg'; // Fallback image
                  }}
                />
              </div>
              <div className="p-2">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-full" title={car.car_name || car.brand}>
                    {car.title || car.brand}
                  </h3>
                </div>

                 {/* Additional car info - Location */}
                <div className="mt-1 mb-2 text-xs text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
                   {car.city}, {car.district} 
                </div>
                
                {/* Car details row 1 - Brand and Model Year */}
                <div className=" mb-2 flex items-center gap-1 text-xs text-gray-600 mb-1 overflow-hidden">
                  <div className="flex items-center flex-shrink-0">
                    <span className="inline-block mr-1 whitespace-nowrap">{car.brand}</span>
                    <span className="mx-1 flex-shrink-0">|</span>
                  </div>

                   <div className="flex items-center overflow-hidden text-ellipsis whitespace-nowrap">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-speedometer2 flex-shrink-0" viewBox="0 0 16 16">
                      <path d="M8 4a.5.5 0 0 1 .5.5V6a.5.5 0 0 1-1 0V4.5A.5.5 0 0 1 8 4zM3.732 5.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707zM2 10a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 10zm9.5 0a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5zm.754-4.246a.389.389 0 0 0-.527-.02L7.547 9.31a.91.91 0 1 0 1.302 1.258l3.434-4.297a.389.389 0 0 0-.029-.518z"/>
                      <path fillRule="evenodd" d="M0 10a8 8 0 1 1 15.547 2.661c-.442 1.253-1.845 1.602-2.932 1.25C11.309 13.488 9.475 13 8 13c-1.474 0-3.31.488-4.615.911-1.087.352-2.49.003-2.932-1.25A7.988 7.988 0 0 1 0 10zm8-7a7 7 0 0 0-6.603 9.329c.203.575.923.876 1.68.63C4.397 12.533 6.358 12 8 12s3.604.532 4.923.96c.757.245 1.477-.056 1.68-.631A7 7 0 0 0 8 3z"/>
                    </svg>
                    <span className="ml-1 overflow-hidden text-ellipsis">
                      {car.kilometers } km
                    </span>
                  </div>
                  
                </div>
                
               
                
                {/* Price and KM driven */}
                <div className="mb-2 flex justify-between items-center text-xs">
                 <div className="flex items-center overflow-hidden text-ellipsis whitespace-nowrap">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-calendar flex-shrink-0" viewBox="0 0 16 16">
                      <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                    </svg>
                    <span className="ml-1 overflow-hidden text-ellipsis">{ car.year}</span>
                  </div>
                  <div className="flex items-center font-semibold flex-shrink-0">
                    <span className="text-sm whitespace-nowrap">
                      ₹ {car.price ? (car.price / 100000).toFixed(1) : '0'} L
                    </span>
                  </div>
                </div>
                
               
              </div>
            </div>
          ))
        ) : (
          !loading && (
            <div className="col-span-full text-center py-8 text-gray-500">
              No cars found.
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
          loadingText="Loading more cars..."
          buttonText="Load More Cars"
        />
      )}

      {/* Cars count info */}
      <div className="text-center mt-4 text-sm text-gray-600">
        Showing {cars.length} of {totalCars} cars
      </div>
    </>
  );
};

export default VendorCarPost;