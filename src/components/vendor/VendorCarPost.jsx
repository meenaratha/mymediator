import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadMoreButton from '../common/LoadMoreButton';
import { api } from '../../api/axios';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import IMAGES from '../../utils/images';
import { red } from "@mui/material/colors";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SpeedIcon from "@mui/icons-material/Speed";

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
        {Array.isArray(cars) && cars.length > 0
          ? cars.map((car) => (
              <div
                key={car.id}
                onClick={() => handleCarClick(car)}
                className="cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="relative h-[170px] overflow-hidden">
                  <img
                    src={car.image_url || IMAGES.placeholderimg}
                    alt={car.title || car.brand}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder-car.jpg"; // Fallback image
                    }}
                  />
                </div>
                <div className="p-2">
                  <div className="flex justify-between items-center mb-2">
                    <h3
                      className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-full"
                      title={car.car_name || car.brand}
                    >
                      {car.title || car.brand}
                    </h3>
                  </div>

                  {/* Additional car info - Location */}

                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <LocationOnIcon sx={{ color: red[500], fontSize: 16 }} />
                    <span className="truncate ml-1">
                      {car.district}, {car.state}
                    </span>
                  </div>

                  {/* Car details row 1 - Brand and Model Year */}

                  <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600 flex-wrap gap-2">
                    {car.brand !== null ? (
                      <span className="font-medium">{car.brand}</span>
                    ) : (
                      <span className="font-medium">{car.brand_name}</span>
                    )}

                    {car.kilometers && (
                      <div className="flex items-center">
                        <SpeedIcon style={{ fontSize: 14 }} />
                        <span className="ml-1">{car.kilometers}k km</span>
                      </div>
                    )}
                  </div>

                  {/* Price and KM driven */}
                  <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                    <div className="flex items-center">
                      <CalendarTodayIcon style={{ fontSize: 14 }} />
                      <span className="ml-1">{car.post_year}</span>
                    </div>

                    <span className="font-bold text-lg">{car.price}</span>
                  </div>
                </div>
              </div>
            ))
          : !loading && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No cars found.
              </div>
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