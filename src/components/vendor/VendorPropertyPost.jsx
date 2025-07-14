import React, { useState, useEffect } from 'react';
import LoadMoreButton from '../common/LoadMoreButton';
import { api } from '../../api/axios';
import { useNavigate, useParams } from 'react-router-dom';
import IMAGES from '../../utils/images';
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BedIcon from "@mui/icons-material/Bed";
import { red } from "@mui/material/colors";

const VendorPropertyPost = () => {
  const navigate = useNavigate();
    const { vendorId } = useParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [totalProperties, setTotalProperties] = useState(0);

  // Fetch properties function
  const fetchProperties = async (page = 1, append = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await api.get(`/properties/list/foruser?page=${page}&vendor_id=${vendorId}`);
      
      // Handle the nested response structure
      const responseData = response.data;
      const paginationData = responseData.data; // This contains the pagination info
      const propertiesData = Array.isArray(paginationData.data) ? paginationData.data : [];

      if (append) {
        setProperties(prevProperties => [...prevProperties, ...propertiesData]);
      } else {
        setProperties(propertiesData);
      }

      setCurrentPage(paginationData.current_page || 1);
      setTotalProperties(paginationData.total || 0);
      setHasMorePages(paginationData.next_page_url !== null);

    } catch (error) {
      console.error('Error fetching properties:', error);
      // Reset to empty array on error
      setProperties([]);
      setHasMorePages(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load initial properties
  useEffect(() => {
    fetchProperties(1);
  }, []);

  // Load more properties
  const handleLoadMore = () => {
    if (hasMorePages && !loadingMore) {
      fetchProperties(currentPage + 1, true);
    }
  };

  // Handle property click
  const handleProductClick = (property) => {
    navigate(`/properties/${property.action_slug}`, { state: { property } });
  };

  // Format property data to match your existing structure
  const formatPropertyData = (property) => ({
    id: property.id,
    type: property.property_name,
    image: property.image_url,
    beds: property.bedrooms,
    baths: property.bathroom,
    sqft: property.super_builtup_area || property.carpet_area || 'N/A',
    price: (property.amount / 100000).toFixed(1), // Convert to lakhs
    slug: property.action_slug,
    bhk: property.bhk,
    city: property.city,
    district: property.district,
    state: property.state,
    furnished: property.furnished,
    description: property.description
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      {/* Property Grid - Responsive columns: 1 on mobile, 2 on medium, 3 on large, 6 on xl */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {Array.isArray(properties) && properties.length > 0 ? (
          properties.map((property) => {
            const formattedProperty = formatPropertyData(property);
            
            return (
              <div
                key={property.id}
                onClick={() => handleProductClick(property)}
                className="cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={property.image_url || IMAGES.placeholderimg}
                    alt={property.property_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder-property.jpg"; // Fallback image
                    }}
                  />
                </div>
                <div className="p-2">
                  <div className="flex justify-between items-center mb-2">
                    <h3
                      className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[250px]"
                      title={property.property_name}
                    >
                      {property.property_name}
                    </h3>
                  </div>
                  {/* Additional property info */}
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    {/* Location icon */}
                    <LocationOnIcon sx={{ color: red[500] }} />
                    <span>
                      {property.district}, {property.state}
                    </span>
                  </div>

                  <div className="flex items-center mt-2 space-x-4">
                    {property.super_builtup_area !== null ? (
                      <div className="flex items-center">
                        {/* Bed icon */}
                        <SquareFootIcon />
                        <span className="ml-1 text-sm">
                          {property.super_builtup_area || "N/A"} Sq.ft
                        </span>
                      </div>
                    ) : (
                      ""
                    )}

                    {property.bhk !== null ? (
                      <div className="flex items-center">
                        {/* Bath icon */}
                        <BedIcon />
                        <span className="ml-1 text-sm">
                          {property.bhk || property.bedrooms}
                        </span>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {property.post_year || "2022"}
                    </span>
                    <span className="font-bold text-lg">
                      ₹ {property.amount?.toLocaleString() || 0}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          !loading && (
            <div className="col-span-full text-center py-8 text-gray-500">
              No properties found.
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
          loadingText="Loading more properties..."
          buttonText="Load More Properties"
        />
      )}

      {/* Properties count info */}
      <div className="text-center mt-4 text-sm text-gray-600">
        Showing {properties.length} of {totalProperties} properties
      </div>
    </>
  );
};

export default VendorPropertyPost;