import React, { useState ,useEffect } from "react";
import {
  BannerSlider,
  LoadMoreButton,
  FreashRecommendationProducts,
  LoginFormModel,
  SignupFormModel,
} from "@/components";
import { useMediaQuery } from "react-responsive"; // For detecting mobile devices
import IMAGES from "@/utils/images.js";
import { api } from "@/api/axios";
import { toast } from "react-toastify";
const HomePage = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  // State for slider images
  const [sliderImages, setSliderImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Fallback images in case API fails
  const fallbackImages = [
    IMAGES.placeholderimg,
    IMAGES.placeholderimg,
    IMAGES.placeholderimg,
    IMAGES.placeholderimg,
  ];

  // Fetch slider images from API
  const fetchSliderImages = async () => {
    setLoadingImages(true);
    setImageError(false);
    
    try {
      const response = await api.get('/sliderimage'); // Adjust endpoint as needed
      const result = response.data;
      
      // Handle different API response structures
      let images = [];
      if (result.data && Array.isArray(result.data)) {
        images = result.data;
      } else if (Array.isArray(result)) {
        images = result;
      } else if (result.images && Array.isArray(result.images)) {
        images = result.images;
      }
      
      // Extract image URLs from the response
      const imageUrls = images.map(item => {
        // Handle different possible image URL field names
        return item.image_url || 
               item.url || 
               item.image || 
               item.path || 
               item.src ||
               item; // In case it's already a URL string
      }).filter(url => url); // Remove any null/undefined values
      
      if (imageUrls.length > 0) {
        setSliderImages(imageUrls);
        console.log('✅ Slider images loaded successfully:', imageUrls.length, 'images');
      } else {
        console.warn('⚠️ No valid image URLs found in API response');
        setSliderImages(fallbackImages);
        setImageError(true);
      }
      
    } catch (error) {
      console.error('❌ Failed to fetch slider images:', error);
      setSliderImages(fallbackImages);
      setImageError(true);
      
      // Only show error toast if it's a network error or 500 error
      // Don't show for 404 or other expected errors
      if (error.response?.status >= 500 || !error.response) {
        toast.error('Failed to load slider images');
      }
    } finally {
      setLoadingImages(false);
    }
  };

  // Load images on component mount
  useEffect(() => {
    fetchSliderImages();
  }, []);


// Loading skeleton for slider
  const SliderSkeleton = () => (
    <div className="max-w-[1200px] mx-auto my-8">
      <div className="flex gap-4">
        {[1, 2, 3].map((_, index) => (
          <div 
            key={index}
            className="flex-1 bg-gray-200 rounded-lg animate-pulse"
            style={{ height: '270px' }}
          >
            <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div className="max-w-screen-xl max-w-[1200px] mx-auto px-4">
        {/* Show loading skeleton while fetching images */}
        {loadingImages ? (
          <SliderSkeleton />
        ) : (
          <>
            <BannerSlider 
              images={sliderImages} 
              isLoading={loadingImages}
              hasError={imageError}
            />
            {/* Show retry button if there was an error */}
            {imageError && (
              <div className="text-center mb-4">
                <button 
                  onClick={fetchSliderImages}
                  className="text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  Retry loading images
                </button>
              </div>
            )}
          </>
        )}
        {/* space div */}
        <div className="h-[10px]"></div>
        <h1 className="text-left text-black text-[24px] font-semibold px-3 py-2">
          Fresh recommendations
        </h1>
        <FreashRecommendationProducts />
      </div>
    </>
  );
};

export default HomePage;
