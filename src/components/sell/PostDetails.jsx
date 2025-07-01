import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LoadMoreButton from "../../components/common/LoadMoreButton";
import { api } from "@/api/axios";
import { toast } from "react-toastify";
import IMAGES from "@/utils/images.js";


const PropertyCard = ({
  propertyImage,
  propertyName,
  location,
  propertyType,
  bhkType,
  area,
  price,
  id,
  slug,
  status,
  onStatusChange,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [adsEnabled, setAdsEnabled] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleDropdown = () => {
    setShowStatusDropdown(!showStatusDropdown);
  };

  const toggleAds = (e) => {
    e.stopPropagation();
    setAdsEnabled(!adsEnabled);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/property/${slug}/${id}/edit`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this property?")) {
      setIsDeleting(true);
      try {
        await onDelete(id);
        toast.success("Property deleted successfully");
      } catch (error) {
        toast.error("Failed to delete property");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      await api.put(`/properties/${id}/status`, { status: newStatus });
      setCurrentStatus(newStatus);
      onStatusChange(id, newStatus);
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const markAsSold = (e) => {
    e.stopPropagation();
    updateStatus("sold");
    setShowStatusDropdown(false);
  };

  const markAsAvailable = (e) => {
    e.stopPropagation();
    updateStatus("available");
    setShowStatusDropdown(false);
  };

  return (
    <div className="flex items-start p-2 bg-white rounded-lg shadow-sm border border-gray-100 w-full">
      {/* Property Image */}
      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={propertyImage || IMAGES.propertybanner1}
          alt={propertyName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Property Details */}
      <div className="ml-3 flex-1 min-w-0">
        {/* Property Name and Location */}
        <div className="flex items-center flex-wrap md:flex-nowrap">
          <h3 className="font-bold text-gray-900 truncate mr-1 md:mb-0 mb-2">
            {propertyName}
          </h3>
          <div className="flex items-center text-red-500 md:mb-0 mb-2">
            <LocationOnIcon style={{ fontSize: 18 }} />
            <span className="text-sm truncate max-w-[160px]">{location}</span>
          </div>
        </div>

        {/* Property Type */}
        <div className="flex items-center mt-1 text-gray-600 flex-wrap md:flex-nowrap gap-[10px] mb-2">
          <span className="text-sm">{propertyType}</span>
          <span className="mx-1 text-sm">( {bhkType} )</span>
          <SquareFootIcon
            style={{ fontSize: 16, marginLeft: 4, marginRight: 2 }}
          />
          <span className="text-sm">{area}</span>
        </div>

        {/* Price and Status */}
        <div className="flex items-center mt-1 justify-between flex-wrap gap-[10px] md:flex-nowrap">
          <div className="flex items-center">
            <span className="text-lg font-bold">₹</span>
            <span className="text-lg font-bold ml-1 truncate max-w-[150px]">
              {price}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Edit Icon */}
            <button
              onClick={handleEdit}
              className="text-gray-600 hover:text-blue-600"
              title="Edit property"
            >
              <EditIcon fontSize="small" />
            </button>

            {/* Delete Icon */}
            <button
              onClick={handleDelete}
              className="text-gray-600 hover:text-red-600"
              title="Delete property"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <span className="text-sm">Deleting...</span>
              ) : (
                <DeleteIcon fontSize="small" />
              )}
            </button>

            {/* Status Dropdown */}
            <div className="relative">
              {currentStatus === "sold" ? (
                <div
                  className="bg-[#0f1c5e] text-white px-4 py-1 rounded-md cursor-pointer"
                  onClick={markAsAvailable}
                >
                  Sold out
                </div>
              ) : (
                <>
                  <button
                    onClick={toggleDropdown}
                    className="bg-[#0f1c5e] text-white px-4 py-1 rounded-md text-sm flex items-center"
                  >
                    Status
                    {showStatusDropdown ? (
                      <KeyboardArrowUpIcon style={{ fontSize: 18 }} />
                    ) : (
                      <KeyboardArrowDownIcon style={{ fontSize: 18 }} />
                    )}
                  </button>

                  {/* Status Dropdown */}
                  {showStatusDropdown && (
                    <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                      <button
                        onClick={markAsSold}
                        className="block w-full text-left px-4 py-2 text-sm text-blue-800 font-medium hover:bg-blue-50"
                      >
                        Sold out
                      </button>
                      <div className="px-4 py-2 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Ads</span>
                          <div
                            onClick={toggleAds}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              adsEnabled ? "bg-[#0f1c5e]" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                adsEnabled ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PostDetails = () => {
  const isMobile = useMediaQuery({ maxWidth: 567 });
  const isTablet = useMediaQuery({ minWidth: 568, maxWidth: 899 });
  const navigate = useNavigate();

  // Pagination states
  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(false);
  const [total, setTotal] = useState(0);

  // Update property status in local state
  const handleStatusChange = (id, newStatus) => {
    setProperties((prevProperties) =>
      prevProperties.map((property) =>
        property.id === id ? { ...property, status: newStatus } : property
      )
    );
  };

  // Handle property deletion
  const handleDeleteProperty = async (id) => {
    try {
      await api.delete(`/properties/${id}`);
      setProperties((prevProperties) =>
        prevProperties.filter((property) => property.id !== id)
      );
      setTotal((prev) => prev - 1);
      return true;
    } catch (error) {
      console.error("Failed to delete property", error);
      toast.error("Failed to delete property");
      throw error;
    }
  };

  // Fetch properties from API
  const fetchProperties = async (page = 1, loadMore = false) => {
    if (loadMore) setLoadingMore(true);
    else setLoading(true);

    try {
      const response = await api.get(`/properties/list/vendor/web?page=${page}`);
      const result = response.data?.data;

      setProperties((prev) =>
        page === 1 ? result.data || [] : [...prev, ...(result.data || [])]
      );
      setCurrentPage(result.current_page);
      setLastPage(result.last_page);
      setTotal(result.total);
      setHasMoreData(
        result.next_page_url !== null &&
          result.current_page < result.last_page &&
          result.data &&
          result.data.length > 0
      );
    } catch (err) {
      console.error("Failed to load properties", err);
      toast.error("Failed to load properties");
      if (page === 1) setProperties([]);
      setHasMoreData(false);
    } finally {
      if (loadMore) setLoadingMore(false);
      else setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchProperties(1);
  }, []);

  // Handle load more
  const handleLoadMore = () => {
    if (hasMoreData && !loadingMore && currentPage < lastPage) {
      fetchProperties(currentPage + 1, true);
    }
  };

  // Auto-load on scroll with throttling
  useEffect(() => {
    let isScrolling = false;

    const handleScroll = () => {
      if (isScrolling) return;
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500;

      if (nearBottom && hasMoreData && !loadingMore && currentPage < lastPage) {
        isScrolling = true;
        handleLoadMore();
        setTimeout(() => {
          isScrolling = false;
        }, 1000);
      }
    };

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
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [currentPage, lastPage, loadingMore, hasMoreData]);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="flex items-center p-2 bg-white rounded-lg shadow-sm border border-gray-100 w-full">
      <div className="w-20 h-20 rounded-lg flex-shrink-0 bg-gray-200 relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
      </div>
      <div className="ml-3 flex-1">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
        </div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2 relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="h-3 bg-gray-200 rounded w-1/4 relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-16 relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto md:px-4 px-0">
      <h1 className="text-xl font-bold text-[#02487C] text-center mb-6">
        My Post Details
      </h1>

      <div className="mb-8">
        <div
          className={`grid gap-4 ${
            isMobile ? "grid-cols-1" : isTablet ? "grid-cols-2" : "grid-cols-2"
          }`}
        >
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <LoadingSkeleton key={index} />
              ))
            : properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  slug={property.slug || "property"}
                  propertyImage={property.image_url}
                  propertyName={property.property_name}
                  location={`${property.city}${
                    property.district ? `, ${property.district}` : ""
                  }`}
                  propertyType={property.building_direction}
                  bhkType={property.bhk ? `${property.bhk}` : ""}
                  area={
                    property.super_builtup_area
                      ? `${property.super_builtup_area} Sq.ft`
                      : ""
                  }
                  price={
                    property.amount ? property.amount.toLocaleString() : ""
                  }
                  status={property.status || "available"}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteProperty}
                />
              ))}
        </div>

        {!loading && hasMoreData && properties.length > 0 && (
          <div className="mt-8 text-center">
            <LoadMoreButton
              onClick={handleLoadMore}
              loading={loadingMore}
              disabled={!hasMoreData || loadingMore}
            />
          </div>
        )}

        {!loading && properties.length > 0 && (
          <div className="mt-4 text-center text-gray-600 text-sm">
            Showing {properties.length} of {total} properties
          </div>
        )}

        {!loading && !hasMoreData && properties.length > 0 && (
          <div className="mt-4 text-center text-gray-500 text-sm">
            No more properties to load
          </div>
        )}

        {!loading && properties.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No properties found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetails;
