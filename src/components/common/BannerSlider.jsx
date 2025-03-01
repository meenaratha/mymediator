import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import IMAGES from "@/utils/images.js";
import { useMediaQuery } from "react-responsive"; // For detecting mobile devices

const BannerSlider = () => {
  const images = [
    IMAGES.propertybanner1,
    IMAGES.propertybanner2,
    IMAGES.propertybanner3,
    IMAGES.propertybanner1,
  ];
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
              <div className="flex justify-center">
                <img
                  src={image}
                  alt={`Slide ${index + 1}`}
                  className="max-w-[460px]  max-h-[270px]  w-full h-auto rounded-lg shadow-lg"
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
