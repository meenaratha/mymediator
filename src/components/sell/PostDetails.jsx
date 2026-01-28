import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useNavigate, useLocation, Link, NavLink } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import HomeIcon from "@mui/icons-material/Home";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LoadMoreButton from "../common/LoadMoreButton";
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
  plotArea,
  price,
  id,
  slug,
  editformslug,
  editformslugName,
  status,
  adminapproved,
  isPublished,
  buildingDirection,
  onStatusChange,
  onDelete,
  bedroom,
}) => {
  const navigate = useNavigate();
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [adsEnabled, setAdsEnabled] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);
  // Convert is_published to boolean - handle both 0/1 and true/false
  const [currentPublishStatus, setCurrentPublishStatus] = useState(
    isPublished === 1 || isPublished === true
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingPublish, setIsUpdatingPublish] = useState(false);

  const toggleDropdown = () => {
    setShowStatusDropdown(!showStatusDropdown);
  };



  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/property/${editformslug}/${id}/edit`, {
      state: { slugName: editformslugName }, // 👈 set the state value here
    });
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

  // Update property status (available, sold, pending, etc.)
  const updateStatus = async (newStatus) => {
    setIsUpdatingStatus(true);
    try {
      const response = await api.patch(`/property/status/${id}`, {
        status: newStatus,
      });

      console.log("Status update response:", response.data);

      // Extract status from API response
      const updatedStatus = response.data?.data?.status || newStatus;

      setCurrentStatus(updatedStatus);
      onStatusChange(id, updatedStatus);

      // Show success message based on API response
      if (response.data?.message) {
        toast.success(response.data.message);
      } else {
        toast.success(`Status updated to ${updatedStatus}`);
      }
    } catch (error) {
      console.error("Failed to update status:", error);

      // Show specific error message if available
      const errorMessage =
        error.response?.data?.message || "Failed to update status";
      toast.error(errorMessage);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Update publish/unpublish status
  const updatePublishStatus = async (publishStatus) => {
    setIsUpdatingPublish(true);
    try {
      // Convert boolean to 1/0 for API
      const apiValue = publishStatus ? 1 : 0;

      const response = await api.patch(`/property/publish/${id}`, {
        is_published: apiValue,
      });

      console.log("Publish status update response:", response.data);

      // Extract is_published from API response
      const updatedPublishStatus = response.data?.data?.is_published;

      // Convert API response (0/1) to boolean for internal state
      const booleanStatus =
        updatedPublishStatus === 1 || updatedPublishStatus === true;

      setCurrentPublishStatus(booleanStatus);

      // Show success message from API or default
      if (response.data?.message) {
        toast.success(response.data.message);
      } else {
        const statusText = booleanStatus ? "published" : "unpublished";
        toast.success(`Property ${statusText} successfully`);
      }

      console.log("Final publish status:", {
        requested: publishStatus,
        apiResponse: updatedPublishStatus,
        finalState: booleanStatus,
      });
    } catch (error) {
      console.error("Failed to update publish status:", error);

      // Show specific error message if available
      const errorMessage =
        error.response?.data?.message || "Failed to update publish status";
      toast.error(errorMessage);
    } finally {
      setIsUpdatingPublish(false);
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

  // Check if navigation should be disabled
  const isNavigationDisabled = () => {
    const isSold = currentStatus === "sold" || currentStatus === "soldout";
    const isUnpublished = !currentPublishStatus;

    return isSold || isUnpublished;
  };

  // Handle card click with conditional navigation
  const handleCardClick = (event) => {
    // Prevent navigation if clicking on action buttons
    if (event.target.closest(".action-button")) {
      return;
    }

    // Check if admin has not approved the property
    if (adminapproved === 0 || adminapproved === false) {
      toast.warning("Waiting for admin approval. Your property is under review.");
      return;
    }

    // Check if navigation should be disabled
    if (isNavigationDisabled()) {
      if (currentStatus === "sold" || currentStatus === "available") {
        toast.info("This property has been sold and is no longer available");
      } else if (!currentPublishStatus) {
        toast.info("This property is currently unpublished");
      }
      return;
    }

    // Navigate to property details
    navigate(`/properties/${slug}`);
  };

  // Get card styling based on status
  const getCardStyling = () => {
    if (isNavigationDisabled()) {
      return "opacity-100 bg-[#c1bebe] cursor-not-allowed z-99 relative";
    }
    return "cursor-pointer hover:shadow-lg transition-shadow";
  };

  // Get status badge styling with proper priority
  const getStatusBadge = () => {
    // Priority 1: SOLD status (highest priority)
    if (currentStatus === "sold" || currentStatus === "soldout") {
      return (
        <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold z-10">
          SOLD
        </span>
      );
    }

    // Priority 2: UNPUBLISHED status
    if (!currentPublishStatus) {
      return (
        <span className="absolute top-2 left-2 bg-gray-500 text-white px-2 py-1 rounded text-xs font-semibold z-10">
          UNPUBLISHED
        </span>
      );
    }

    // Priority 3: Other statuses for published properties
    if (currentPublishStatus) {
      if (currentStatus === "available") {
        return (
          <span className="absolute top-2 left-2 bg-blue-900 text-white px-2 py-1 rounded text-xs font-semibold z-10">
            AVAILABLE
          </span>
        );
      }

      if (currentStatus === "pending") {
        return (
          <span className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold z-10">
            PENDING
          </span>
        );
      }

      // For any other status
      return (
        <span className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold z-10">
          {currentStatus.toUpperCase()}
        </span>
      );
    }

    return null;
  };

  return (
    <div
      onClick={handleCardClick}
      className={`flex items-start p-2 bg-white rounded-lg shadow-sm border border-gray-100 w-full relative ${getCardStyling()}`}
    >
      {/* Status Badge - Only show if admin approved */}
      {(adminapproved === 1 || adminapproved === true) && getStatusBadge()}
      {/* Property Image */}
      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={propertyImage || IMAGES.placeholderimg}
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

        {/* Property Type and BHK */}
        <div className="flex justify-between items-center mt-1 text-gray-600 flex-wrap md:flex-nowrap gap-[8px] my-5">
          {plotArea && (
            <div className="flex gap-2 items-center">
              <SquareFootIcon style={{ fontSize: 18 }} />
              <span className="text-sm"> {plotArea}</span>
            </div>
          )}
          {bhkType && (
            <div className="flex gap-2 items-center">
              <HomeIcon style={{ fontSize: 18 }} />
              <span className="text-sm">{bhkType}</span>
            </div>
          )}

          {area && (
            <div className="flex gap-2 items-center">
              <SquareFootIcon style={{ fontSize: 18 }} />
              <span className="text-sm">{area}</span>
            </div>
          )}
        </div>

        {/* Price and Actions */}
        <div className="flex items-center mt-1 justify-between flex-wrap gap-[10px] md:flex-nowrap">
          <div className="flex items-center">
            <span className="text-lg font-bold">₹</span>
            <span className="text-lg font-bold ml-1 truncate max-w-[150px]">
              {price}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Only show Edit and Status buttons if admin approved */}
            {(adminapproved === 1 || adminapproved === true) && (
              <>
                {/* Edit Icon */}
                <button
                  onClick={handleEdit}
                  className="action-button text-blue-600 hover:text-blue-600 cursor-pointer"
                  title="Edit property"
                >
                  <EditIcon fontSize="small" />
                </button>

                {/* Status Dropdown */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown();
                    }}
                    className="action-button bg-[#0f1c5e] text-white px-4 py-1 rounded-md text-sm flex items-center disabled:opacity-50"
                    disabled={isUpdatingStatus || isUpdatingPublish}
                  >
                    Status
                    {isUpdatingStatus || isUpdatingPublish ? (
                      <div className="animate-spin h-3 w-3 border border-white border-t-transparent rounded-full ml-1"></div>
                    ) : showStatusDropdown ? (
                      <KeyboardArrowUpIcon style={{ fontSize: 18 }} />
                    ) : (
                      <KeyboardArrowDownIcon style={{ fontSize: 18 }} />
                    )}
                  </button>

                  {/* Status Dropdown */}
                  {showStatusDropdown && (
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                      {/* Sold/Available Toggle */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-sm text-white px-2 py-1 rounded ${currentStatus === "sold"
                              ? "bg-red-600"
                              : "bg-green-600"
                              }`}
                          >
                            {currentStatus === "sold" ? "Sold Out" : "Available"}
                          </span>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              if (currentStatus === "sold") {
                                markAsAvailable(e);
                              } else {
                                markAsSold(e);
                              }
                            }}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${currentStatus === "sold"
                              ? "bg-red-500"
                              : "bg-green-500"
                              } ${isUpdatingStatus
                                ? "opacity-50 pointer-events-none"
                                : ""
                              }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${currentStatus === "sold"
                                ? "translate-x-1"
                                : "translate-x-6"
                                }`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Publish/Unpublish Toggle */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-sm text-white px-2 py-1 rounded ${currentPublishStatus
                              ? "bg-green-600"
                              : "bg-yellow-500"
                              }`}
                          >
                            {currentPublishStatus ? "Published" : "Draft"}
                          </span>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              updatePublishStatus(!currentPublishStatus);
                              setShowStatusDropdown(false);
                            }}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${currentPublishStatus ? "bg-blue-500" : "bg-gray-300"
                              } ${isUpdatingPublish
                                ? "opacity-50 pointer-events-none"
                                : ""
                              }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${currentPublishStatus
                                ? "translate-x-6"
                                : "translate-x-1"
                                }`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Delete Button */}
                      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-center">
                        <button
                          onClick={handleDelete}
                          className="action-button text-white flex items-center justify-center gap-2 px-4 py-2 bg-red-600 rounded disabled:opacity-60 hover:bg-red-700 transition-colors"
                          title="Delete property"
                          disabled={isDeleting}
                        >
                          <DeleteIcon fontSize="small" />
                          <span className="text-sm">
                            {isDeleting ? "Deleting..." : "Delete"}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Show pending approval message if not approved */}
            {(adminapproved === 0 || adminapproved === false) && (
              <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded border border-yellow-200">
                Pending Approval
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for disabled properties */}
      {/* {isNavigationDisabled() && (
        <div className="absolute inset-0 bg-[#0000004d] bg-opacity-5 rounded-lg pointer-events-none">
          <div className="absolute bottom-2 left-2 right-2 text-center">
            <span className="text-xs text-gray-600 bg-white bg-opacity-90 px-2 py-1 rounded shadow-sm">
              {currentStatus === "sold" || currentStatus === "soldout"
                ? "Property has been sold"
                : "Property is unpublished"}
            </span>
          </div>
        </div>
      )} */}
    </div>
  );
};


const PropertyPostDetails = () => {
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
      await api.delete(`/property/${id}/delete`);
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
      const response = await api.get(
        `/properties/list/vendor/web?page=${page}`
      );
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
      <div className="mb-8">
        <div
          className={`grid gap-4 ${isMobile ? "grid-cols-1" : isTablet ? "grid-cols-2" : "grid-cols-2"
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
                slug={property.action_slug || "property"}
                editformslug={property.slug}
                editformslugName={property.subcategory}
                propertyImage={
                  property.image_url || property.images?.[0]?.url
                }
                propertyName={property.property_name || property.title}
                plotArea={
                  property.plot_area ? `${property.plot_area} Sq.ft` : null
                }
                location={`${property.district ? ` ${property.district}` : ""
                  }${property.state ? `, ${property.state}` : ""}`}
                propertyType={property.property_type || property.subcategory}
                buildingDirection={property.building_direction}
                bhkType={property.bhk ? `${property.bhk} ` : ""}
                area={
                  property.super_builtup_area
                    ? `${property.super_builtup_area} Sq.ft`
                    : property.area
                      ? `${property.area} Sq.ft`
                      : null
                }
                bedroom={property.bedrooms}
                price={property.amount}
                status={property.status || "available"}
                adminapproved={property.is_approved || 0}
                isPublished={property.is_published || 0}
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

export default PropertyPostDetails;
