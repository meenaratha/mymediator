import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DevicesIcon from "@mui/icons-material/Devices";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FeaturedVideoIcon from "@mui/icons-material/FeaturedVideo";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LoadMoreButton from "../../components/common/LoadMoreButton";
import { api } from "@/api/axios";
import { toast } from "react-toastify";
import IMAGES from "@/utils/images.js";

const ElectronicsCard = ({
  electronicsImage,
  electronicsTitle,
  location,
  brand,
  model,
  year,
  features,
  specifications,
  price,
  id,
  slug,
  editformslug,
  status,
  isPublished,
  subcategory,
  onStatusChange,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [adsEnabled, setAdsEnabled] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);
  const [currentPublishStatus, setCurrentPublishStatus] = useState(isPublished);
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleDropdown = () => {
    setShowStatusDropdown(!showStatusDropdown);
  };


  // Add navigation handler for card click
  const handleCardClick = () => {
    navigate(`/electronic/${slug}`);
  };

  const toggleAds = (e) => {
    e.stopPropagation();
    setAdsEnabled(!adsEnabled);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/electronics/${editformslug}/${id}/edit`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this electronics item?")) {
      setIsDeleting(true);
      try {
        await onDelete(id);
        toast.success("Electronics item deleted successfully");
      } catch (error) {
        toast.error("Failed to delete electronics item");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      await api.patch(`/electronics/status/${id}`, { status: newStatus });
      setCurrentStatus(newStatus);
      onStatusChange(id, newStatus);
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status");
    }
  };

  const updatePublishStatus = async (publishStatus) => {
    try {
      await api.patch(`/electronics/publish/${id}`, { is_published: publishStatus });
      setCurrentPublishStatus(publishStatus);
      toast.success(`Electronics item ${publishStatus ? 'published' : 'unpublished'} successfully`);
    } catch (error) {
      console.error("Failed to update publish status:", error);
      toast.error("Failed to update publish status");
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
    <div onClick={handleCardClick}
    
    className="cursor-pointer flex items-start p-2 bg-white rounded-lg shadow-sm border border-gray-100 w-full">
      {/* Electronics Image */}
      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={electronicsImage || IMAGES.propertybanner1}
          alt={electronicsTitle}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Electronics Details */}
      <div className="ml-3 flex-1 min-w-0">
        {/* Electronics Title and Location */}
        <div className="flex items-center flex-wrap md:flex-nowrap gap-4">
          <h3 className="font-bold text-gray-900 truncate mr-1 md:mb-0 mb-2">
            {electronicsTitle}
          </h3>

          <div className="flex items-center text-red-500 md:mb-0 mb-2">
            <LocationOnIcon style={{ fontSize: 18 }} />
            <span className="text-sm truncate max-w-[160px]">{location}</span>
          </div>
        </div>

        {/* Year, Features, and Specifications */}
        <div className="flex items-center mt-1 text-gray-600 flex-wrap md:flex-nowrap gap-[8px] mb-2">
          {brand && (
            <>
              <DevicesIcon style={{ fontSize: 14 }} />
              <span className="text-sm truncate max-w-[100px]">{brand}</span>
            </>
          )}
          {model && (
            <>
              <FeaturedVideoIcon style={{ fontSize: 14 }} />
              <span className="text-sm truncate max-w-[100px]">{model}</span>
            </>
          )}

          {year && (
            <>
              <CalendarTodayIcon style={{ fontSize: 14 }} />
              <span className="text-sm">{year}</span>
            </>
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
            {/* Edit Icon */}
            <button
              onClick={handleEdit}
              className="text-gray-600 hover:text-blue-600"
              title="Edit electronics item"
            >
              <EditIcon fontSize="small text-blue-600 " />
            </button>

            {/* Status Dropdown */}
            <div className="relative">
              <button
              onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown();
                }}
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
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  {/* Sold/Available Toggle */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm text-white px-2 py-1 rounded 
      ${currentStatus === "sold" ? "bg-red-600" : "bg-green-600"}`}
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
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                          currentStatus === "sold"
                            ? "bg-red-500"
                            : "bg-green-500"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            currentStatus === "sold"
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
                        className={`text-sm text-white px-2 py-1 rounded 
    ${currentPublishStatus ? "bg-green-600" : "bg-yellow-500"}`}
                      >
                        {currentPublishStatus ? "Published" : "Draft"}
                      </span>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          updatePublishStatus(currentPublishStatus ? 0 : 1);
                          setShowStatusDropdown(false);
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                          currentPublishStatus ? "bg-blue-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            currentPublishStatus
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                  {/* delete */}
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-center ">
                    {/* Delete Icon */}
                    <button
                      onClick={handleDelete}
                      className="text-white flex items-center justify-center gap-2 px-4 py-2 bg-red-600 rounded disabled:opacity-60"
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
          </div>
        </div>
      </div>
    </div>
  );
};

const ElectronicsPostDetails = () => {
  const isMobile = useMediaQuery({ maxWidth: 567 });
  const isTablet = useMediaQuery({ minWidth: 568, maxWidth: 899 });
  const navigate = useNavigate();

  // Pagination states
  const [electronics, setElectronics] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(false);
  const [total, setTotal] = useState(0);

  // Update electronics status in local state
  const handleStatusChange = (id, newStatus) => {
    setElectronics((prevElectronics) =>
      prevElectronics.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  // Handle electronics deletion
  const handleDeleteElectronics = async (id) => {
    try {
      await api.delete(`/electronics/${id}/delete`);
      setElectronics((prevElectronics) => 
        prevElectronics.filter((item) => item.id !== id)
      );
      setTotal((prev) => prev - 1);
      return true;
    } catch (error) {
      console.error("Failed to delete electronics item", error);
      toast.error("Failed to delete electronics item");
      throw error;
    }
  };

  // Fetch electronics from API
  const fetchElectronics = async (page = 1, loadMore = false) => {
    if (loadMore) setLoadingMore(true);
    else setLoading(true);

    try {
      const response = await api.get(`/electronics/vendorlist/web?page=${page}`);
      const result = response.data?.data;

      setElectronics((prev) =>
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
      console.error("Failed to load electronics", err);
      toast.error("Failed to load electronics");
      if (page === 1) setElectronics([]);
      setHasMoreData(false);
    } finally {
      if (loadMore) setLoadingMore(false);
      else setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchElectronics(1);
  }, []);

  // Handle load more
  const handleLoadMore = () => {
    if (hasMoreData && !loadingMore && currentPage < lastPage) {
      fetchElectronics(currentPage + 1, true);
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
          className={`grid gap-4 ${
            isMobile ? "grid-cols-1" : isTablet ? "grid-cols-2" : "grid-cols-2"
          }`}
        >
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <LoadingSkeleton key={index} />
              ))
            : electronics.map((item) => (
                <ElectronicsCard
                  key={item.id}
                  id={item.id}
                  slug={item.action_slug}
                  editformslug={item.slug}
                  electronicsImage={item.image_url || item.images?.[0]?.url}
                  electronicsTitle={item.title}
                  location={`${item.district ? `, ${item.district}` : ""}${
                    item.state ? `, ${item.state}` : ""
                  }`}
                  brand={item.brand_name || item.brand}
                  model={item.model_name || item.model}
                  year={item.year}
                  features={item.features}
                  specifications={item.specifications}
                  price={
                    item.price ? parseFloat(item.price).toLocaleString() : ""
                  }
                  status={item.status || "available"}
                  isPublished={item.is_published || 0}
                  subcategory={item.subcategory}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteElectronics}
                />
              ))}
        </div>

        {!loading && hasMoreData && electronics.length > 0 && (
          <div className="mt-8 text-center">
            <LoadMoreButton
              onClick={handleLoadMore}
              loading={loadingMore}
              disabled={!hasMoreData || loadingMore}
            />
          </div>
        )}

        {!loading && electronics.length > 0 && (
          <div className="mt-4 text-center text-gray-600 text-sm">
            Showing {electronics.length} of {total} electronics items
          </div>
        )}

        {!loading && !hasMoreData && electronics.length > 0 && (
          <div className="mt-4 text-center text-gray-500 text-sm">
            No more electronics items to load
          </div>
        )}

        {!loading && electronics.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No electronics items found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ElectronicsPostDetails;