import { useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import IMAGES from "@/utils/images.js";
import { useMediaQuery } from "react-responsive"; // For detecting mobile devices

const BannerSlider = ({ images = [], isLoading = false, hasError = false ,}) => {
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [failedImages, setFailedImages] = useState(new Set());

  // Handle image load success
  const handleImageLoad = (index) => {
    setLoadedImages(prev => new Set([...prev, index]));
  };

  // Handle image load error
  const handleImageError = (index) => {
    setFailedImages(prev => new Set([...prev, index]));
    console.warn(`Failed to load image at index ${index}:`, images[index]);
  };

  // Filter out failed images and ensure we have valid images
  const validImages = images.filter((image, index) => {
    return image && typeof image === 'string' && !failedImages.has(index);
  });

  // Show fallback if no valid images
  if (!validImages.length && !isLoading) {
    const fallbackImages = [
      IMAGES.propertybanner1,
      IMAGES.propertybanner2,
      IMAGES.propertybanner3,
    ];
    return <BannerSlider images={fallbackImages} />;
  }
  return (
    <>
      <div className="max-w-[1200px] mx-auto my-8">
        <Swiper
          slidesPerView={1} // Default: 1 slide on small screens
          spaceBetween={20}
          loop={true}
          autoplay={{
            delay: 3000, // Auto-slide every 3 seconds
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={false}
          modules={[Autoplay, Pagination, Navigation]}
          breakpoints={{
            640: {
              slidesPerView: 2, // 2 slides on tablets
            },
            1024: {
              slidesPerView: 3, // 3 slides on large devices
            },
          }}
          className="mySwiper"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="flex justify-center h-[250px]">
                <img
                  src={image}
                  alt={`Slide ${index + 1}`}
                  className="max-w-[460px]  max-h-[270px] object-cover w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default BannerSlider;
