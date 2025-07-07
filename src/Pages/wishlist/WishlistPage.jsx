import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/api/axios';
import LoadMoreButton from '../../components/common/LoadMoreButton';
import LoginFormModal from '../../components/common/LoginFormModel';
import { Heart, MapPin, Calendar, Car, Home, Smartphone } from 'lucide-react';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [removingItemId, setRemovingItemId] = useState(null);

  // Check authentication status
  const checkAuthStatus = () => {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('access_token');
    return !!(token );
  };

  // Fetch wishlist items
  const fetchWishlistItems = async (page = 1, append = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      console.log('Fetching wishlist items for page:', page);

      const response = await api.get(`/wishlist?page=${page}`);
      
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

  // Remove item from wishlist
  const removeFromWishlist = async (item) => {
    setRemovingItemId(item.id);
    
    try {
      await api.delete('/wishlist', {
        data: {
          wishable_type: item.wishable_type,
          wishable_id: item.wishable_id.toString()
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
      fetchWishlistItems(currentPage + 1, true);
    }
  };

  // Handle item click
  const handleItemClick = (item) => {
    const type = item.wishable_type;
    const slug = item.wishable?.slug;
    
    if (slug) {
      let routePath = '';
      
      // Map the full type names to route paths
      switch (type) {
        case 'App\\Models\\Property':
          routePath = `/properties/${slug}`;
          break;
        case 'App\\Models\\Car':
          routePath = `/car/${slug}`;
          break;
        case 'App\\Models\\Bike':
          routePath = `/bike/${slug}`;
          break;
        case 'App\\Models\\Electronic':
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
      case 'App\\Models\\Property':
        return <Home className="w-5 h-5 text-blue-600" />;
      case 'App\\Models\\Car':
        return <Car className="w-5 h-5 text-green-600" />;
      case 'App\\Models\\Bike':
        return <Heart className="w-5 h-5 text-orange-600" />;
      case 'App\\Models\\Electronic':
        return <Smartphone className="w-5 h-5 text-purple-600" />;
      default:
        return <Heart className="w-5 h-5 text-red-600" />;
    }
  };

  // Get item details based on type
  const getItemDetails = (item) => {
    const wishable = item.wishable;
    if (!wishable) return null;

    // Helper function to get location info
    const getLocation = (wishableItem) => {
      if (wishableItem.address) {
        return wishableItem.address;
      }
      // You might need to fetch state/district/city names from IDs if needed
      return 'Location not specified';
    };

    switch (item.wishable_type) {
      case 'App\\Models\\Property':
        return {
          title: wishable.property_name || 'Property',
          price: wishable.amount ? `₹${wishable.amount}` : 'Price not specified',
          location: getLocation(wishable),
          details: `${wishable.plot_area ? `${wishable.plot_area} sq ft` : ''} ${wishable.bedrooms ? `${wishable.bedrooms} BHK` : ''}`.trim() || 'Details not available',
          image: wishable.image || null
        };
      
      case 'App\\Models\\Electronic':
        return {
          title: wishable.title || 'Electronic Item',
          price: wishable.price ? `₹${parseFloat(wishable.price).toLocaleString()}` : 'Price not specified',
          location: getLocation(wishable),
          details: `${wishable.brand_name || 'Electronics'} ${wishable.model_name || ''}`.trim() || 'Electronic device',
          image: wishable.image || null
        };
      
      case 'App\\Models\\Car':
        return {
          title: wishable.car_name || wishable.brand || 'Car',
          price: wishable.amount ? `₹${(wishable.amount / 100000).toFixed(1)}L` : 'Price not specified',
          location: getLocation(wishable),
          details: `${wishable.model_year || ''} ${wishable.fuel_type || ''}`.trim() || 'Car details',
          image: wishable.image || null
        };
      
      case 'App\\Models\\Bike':
        return {
          title: wishable.bike_name || wishable.brand || 'Bike',
          price: wishable.amount ? `₹${(wishable.amount / 100000).toFixed(1)}L` : 'Price not specified',
          location: getLocation(wishable),
          details: `${wishable.model_year || ''} ${wishable.engine_cc ? `${wishable.engine_cc}cc` : ''}`.trim() || 'Bike details',
          image: wishable.image || null
        };
      
      default:
        return {
          title: wishable.title || wishable.name || 'Item',
          price: wishable.price || wishable.amount ? `₹${wishable.price || wishable.amount}` : 'Price not specified',
          location: getLocation(wishable),
          details: 'Item details',
          image: wishable.image || null
        };
    }
  };

  // Check authentication on component mount
  useEffect(() => {
    const authStatus = checkAuthStatus();
    setIsAuthenticated(authStatus);
    
    if (authStatus) {
      fetchWishlistItems(1);
    } else {
      setShowLoginModal(true);
      setLoading(false);
    }
  }, []);

  // Handle successful login
  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    setIsAuthenticated(true);
    fetchWishlistItems(1);
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
          onClose={() => setShowLoginModal(false)}
          onSuccess={handleLoginSuccess}
          message="Please login to access your wishlist"
        />
      )}

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Heart className="w-8 h-8 text-red-500" />
                  My Wishlist
                </h1>
                <p className="text-gray-600 mt-2">
                  {totalItems > 0 ? `${totalItems} item${totalItems > 1 ? 's' : ''} saved` : 'No items in wishlist'}
                </p>
              </div>
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue Shopping
              </button>
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

          {/* Wishlist Items */}
          {wishlistItems.length > 0 ? (
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
                        src={itemDetails.image }
                        alt={itemDetails.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
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

                      {/* Type badge */}
                      <div className="absolute top-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded-full flex items-center gap-1">
                        {getItemIcon(item.wishable_type)}
                        <span className="text-xs font-medium capitalize">
                          {item.wishable_type.replace('App\\Models\\', '').toLowerCase()}
                        </span>
                      </div>
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
                      
                      <p className="text-gray-600 text-sm mb-3">
                        {itemDetails.details}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-black">
                          {itemDetails.price}
                        </span>
                        <div className="flex items-center text-gray-500 text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                         {itemDetails.price || "2025"}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : !loading && (
            <div className="text-center py-16">
              <Heart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-600 mb-6">
                Start adding items you love to see them here
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          )}

          {/* Load More Button */}
          {hasMorePages && wishlistItems.length > 0 && (
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
          {wishlistItems.length > 0 && (
            <div className="text-center mt-6 text-sm text-gray-600">
              Showing {wishlistItems.length} of {totalItems} items
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WishlistPage;