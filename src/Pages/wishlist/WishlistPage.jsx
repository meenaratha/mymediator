import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/api/axios';
import LoadMoreButton from '../../components/common/LoadMoreButton';
import LoginFormModal from '../../components/common/LoginFormModel';
import { Heart, MapPin, Calendar, Car, Home, Smartphone } from 'lucide-react';
import SignupFormModel from '../../components/common/SignupFormModel';
import IMAGES from '../../utils/images';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const WishlistPage = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [signupFormModel, setSignupFormModel] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [removingItemId, setRemovingItemId] = useState(null);

  // State to manage active tab
  const [activeTab, setActiveTab] = useState("property");

  // Property types for filter buttons
  const [propertyTypes, setPropertyTypes] = useState([
    {
      id: "property",
      name: "PROPERTY",
      img: IMAGES.sellerproperty,
      selected: true,
    },
    {
      id: "electronics", // Note: using 'electronic' to match API
      name: "ELECTRONICS",
      img: IMAGES.electronicscategory,
      selected: false,
    },
    {
      id: "car",
      name: "CAR",
      img: IMAGES.carcategory,
      selected: false,
    },
    {
      id: "bike",
      name: "BIKE",
      img: IMAGES.sellerbike,
      selected: false,
    },
  ]);

  // Check authentication status
  const checkAuthStatus = () => {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('access_token');
    return !!(token);
  };

  // Fetch wishlist items with category filter
  const fetchWishlistItems = async (page = 1, append = false, type = activeTab) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      console.log('Fetching wishlist items for page:', page, 'type:', type);

      // Build API URL with type parameter
      const apiUrl = `/wishlist?page=${page}&type=${type}`;
      const response = await api.get(apiUrl);
      
      console.log('Wishlist API response:', response.data);

      if (response.data.success) {
        const paginationData = response.data.data;
        const itemsData = Array.isArray(paginationData.data) ? paginationData.data : [];

        if (append) {
          setWishlistItems(prevItems => [...prevItems, ...itemsData]);
        } else {
          setWishlistItems(itemsData);
        }

        setCurrentPage(paginationData.current_page || 1);
        setTotalItems(paginationData.total || 0);
        setHasMorePages(paginationData.next_page_url !== null);
      } else {
        setError('Failed to load wishlist items');
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      
      if (error.response?.status === 401) {
        // User not authenticated
        setIsAuthenticated(false);
        setShowLoginModal(true);
        setError('Please login to view your wishlist');
      } else {
        setError('Failed to load wishlist items');
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Function to handle tab click
  const handleTabClick = (tabId) => {
    // Update the active tab
    setActiveTab(tabId);

    // Update the selected state of property types
    const updatedPropertyTypes = propertyTypes.map((type) => ({
      ...type,
      selected: type.id === tabId,
    }));

    setPropertyTypes(updatedPropertyTypes);

    // Reset pagination and fetch new data for the selected category
    setCurrentPage(1);
    setWishlistItems([]);
    
    // Fetch wishlist items for the new category
    if (isAuthenticated) {
      fetchWishlistItems(1, false, tabId);
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (item) => {
    setRemovingItemId(item.id);
    
    try {
      await api.delete('/wishlist', {
        data: {
          wishable_type: item.form_type || "property",
          wishable_id: item.id.toString()
        }
      });

      // Remove item from local state
      setWishlistItems(prevItems => 
        prevItems.filter(wishItem => wishItem.id !== item.id)
      );
      setTotalItems(prev => prev - 1);

      console.log('Item removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      setError('Failed to remove item from wishlist');
    } finally {
      setRemovingItemId(null);
    }
  };

  // Load more items
  const handleLoadMore = () => {
    if (hasMorePages && !loadingMore) {
      fetchWishlistItems(currentPage + 1, true, activeTab);
    }
  };

  // Handle item click
  const handleItemClick = (item) => {
    const type = item.form_type;
    const slug = item.action_slug;
    
    if (slug) {
      let routePath = '';
      
      // Map the form types to route paths
      switch (type) {
        case 'property':
          routePath = `/properties/${slug}`;
          break;
        case 'car':
          routePath = `/car/${slug}`;
          break;
        case 'bike':
          routePath = `/bike/${slug}`;
          break;
        case 'electronics':
          routePath = `/electronic/${slug}`;
          break;
        default:
          routePath = `/item/${slug}`;
      }
      
      navigate(routePath);
    }
  };

  // Get item icon based on type
  const getItemIcon = (type) => {
    switch (type) {
      case 'property':
        return <Home className="w-5 h-5 text-blue-600" />;
      case 'car':
        return <Car className="w-5 h-5 text-green-600" />;
      case 'bike':
        return <Heart className="w-5 h-5 text-orange-600" />;
      case 'electronic':
        return <Smartphone className="w-5 h-5 text-purple-600" />;
      default:
        return <Heart className="w-5 h-5 text-red-600" />;
    }
  };

  // Get item details based on type
  const getItemDetails = (item) => {
    if (!item) return null;

    // Helper function to get location info
    const getLocation = (itemData) => {
      const locationParts = [];
      if (itemData.district) locationParts.push(itemData.district);
      if (itemData.state) locationParts.push(itemData.state);
      
      return locationParts.length > 0 ? locationParts.join(', ') : (itemData.address || 'Location not specified');
    };

    // Format price with proper currency
    const formatPrice = (amount) => {
      if (!amount) return 'Price not specified';
      const numAmount = parseFloat(amount);
      if (numAmount >= 100000) {
        return `₹${(numAmount / 100000).toFixed(1)}L`;
      } else if (numAmount >= 1000) {
        return `₹${(numAmount / 1000).toFixed(1)}K`;
      }
      return `₹${numAmount.toLocaleString()}`;
    };

    switch (item.form_type) {
      case 'property':
        const propertyDetails = [];
                if (item.super_builtup_area) propertyDetails.push(`${item.super_builtup_area} sq ft`);

        if (item.bhk) propertyDetails.push(item.bhk);
      
        
        return {
          title: item.property_name || "Property",
          // price: formatPrice(item.amount),
          price: item.amount,

          location: getLocation(item),
          details:
            propertyDetails.length > 0
              ? propertyDetails.join(" • ")
              : item.subcategory || "Property details",
          image: item.image_url,
          year: item.post_year,
        };
      
      case 'electronic':
        return {
          title: item.title || item.property_name || "Electronic Item",
          // price: formatPrice(item.amount || item.price),
          price: item.amount || item.price,

          location: getLocation(item),
          details:
            `${item.brand_name || "Electronics"} ${
              item.model_name || ""
            }`.trim() || "Electronic device",
          image: item.image_url,
          year: item.post_year,
        };
      
      case 'car':
        const carDetails = [];
        if (item.model_year) carDetails.push(item.model_year);
        if (item.fuel_type) carDetails.push(item.fuel_type);
        if (item.brand) carDetails.push(item.brand);
        
        return {
          title: item.title || item.property_name || "Car",
          // price: formatPrice(item.price),
          price: item.price,

          location: getLocation(item),
          details:
            carDetails.length > 0 ? carDetails.join(" • ") : "Car details",
          image: item.image_url,
          year: item.post_year,
        };
      
      case 'bike':
        const bikeDetails = [];
        if (item.model_year) bikeDetails.push(item.model_year);
        if (item.engine_cc) bikeDetails.push(`${item.engine_cc}cc`);
        if (item.brand) bikeDetails.push(item.brand);
        
        return {
          title: item.title || item.property_name || "Bike",
          // price: formatPrice(item.price),
          price: item.price,
          location: getLocation(item),
          details:
            bikeDetails.length > 0 ? bikeDetails.join(" • ") : "Bike details",
          image: item.image_url,
          year: item.post_year,
        };
      
      default:
        return {
          title: item.property_name || item.title || item.name || "Item",
          // price: formatPrice(item.amount || item.price),
          price: item.amount || item.price,

          location: getLocation(item),
          details: item.description || "Item details",
          image: item.image_url,
          year: item.post_year,
        };
    }
  };

  // Check authentication on component mount
  useEffect(() => {
    const authStatus = checkAuthStatus();
    setIsAuthenticated(authStatus);
    
    if (authStatus) {
      fetchWishlistItems(1, false, activeTab);
    } else {
      setShowLoginModal(true);
      setLoading(false);
    }
  }, []);

  // Handle successful login
  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    setIsAuthenticated(true);
    fetchWishlistItems(1, false, activeTab);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Login Modal */}
      {showLoginModal && (
        <LoginFormModal
          setLoginFormModel={setShowLoginModal}
          onSuccess={handleLoginSuccess}
          message="Please login to access your wishlist"
          setSignupFormModel={setSignupFormModel}
        />
      )}

      {signupFormModel && (
        <SignupFormModel
          setLoginFormModel={setShowLoginModal}
          setSignupFormModel={setSignupFormModel}
        />
      )}

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Heart className="w-8 h-8 text-red-500" />
                  My Wishlist
                </h1>
                
              </div>
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Explore Listings
              </button>
            </div>
          </div>

          {/* Property Type Filter */}
          <div className="border-b border-[#EAEAEA] mb-10">
            <div className="mx-auto max-w-[800px] pb-6">
              <Swiper
                slidesPerView={2}
                spaceBetween={10}
                breakpoints={{
                  640: {
                    slidesPerView: 4,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 5,
                    spaceBetween: 30,
                  },
                }}
              >
                {propertyTypes.map((type) => (
                  <SwiperSlide key={type.id}>
                    <div
                      className={`mymediator-seller-tab-item flex flex-col items-center p-3 border-gray-100 cursor-pointer${
                        type.selected
                          ? " shadow-md rounded-md bg-white border-1 border-gray-200"
                          : ""
                      }`}
                      onClick={() => handleTabClick(type.id)}
                    >
                      <div
                        className={`p-1 mb-2 w-16 h-16 flex items-center justify-center 
                        ${type.selected ? "" : ""}`}
                      >
                        <img src={type.img} alt="img" />
                      </div>
                      <span className="text-xs font-semibold">{type.name}</span>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
              {error.includes('login') && (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="ml-2 underline font-medium"
                >
                  Login Now
                </button>
              )}
            </div>
          )}

          {/* Loading state for tab change */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
              <p className="ml-4 text-gray-600">Loading {activeTab} items...</p>
            </div>
          )}

          {/* Wishlist Items */}
          {!loading && wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {wishlistItems.map((item) => {
                const itemDetails = getItemDetails(item);
                if (!itemDetails) return null;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleItemClick(item)}
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={itemDetails.image || IMAGES.placeholderimg}
                        alt={itemDetails.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = IMAGES.placeholderimg;
                        }}
                      />

                      {/* Remove button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromWishlist(item);
                        }}
                        disabled={removingItemId === item.id}
                        className="absolute top-2 right-2 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-md transition-all"
                      >
                        {removingItemId === item.id ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-500 border-t-transparent"></div>
                        ) : (
                          <Heart className="w-5 h-5 text-red-500 fill-current" />
                        )}
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {itemDetails.title}
                      </h3>

                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        {itemDetails.location}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-500 text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          {itemDetails.year || "2025"}
                        </div>
                        <span className="text-lg font-bold text-black">
                          ₹ {itemDetails.price}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : !loading && (
            <div className="text-center py-16">
              <Heart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No {activeTab} items in your wishlist
              </h3>
              <p className="text-gray-600 mb-6">
                Start adding {activeTab} items you love to see them here
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
              Explore Listings
              </button>
            </div>
          )}

          {/* Load More Button */}
          {hasMorePages && wishlistItems.length > 0 && !loading && (
            <div className="mt-8">
              <LoadMoreButton
                onClick={handleLoadMore}
                loading={loadingMore}
                disabled={!hasMorePages}
                loadingText="Loading more items..."
                buttonText="Load More Items"
              />
            </div>
          )}

          {/* Items count info */}
          {wishlistItems.length > 0 && !loading && (
            <div className="text-center mt-6 text-sm text-gray-600">
              Showing {wishlistItems.length} of {totalItems} {activeTab} items
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WishlistPage;