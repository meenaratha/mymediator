import IMAGES from "@/utils/images.js";

const HeroSection = () => {
  return (
    <div
      className="relative h-[96px] w-[100%] flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${IMAGES.heroBanner})`, // Replace with your image path
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-[#00000052] bg-opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white">
        {/* Heading */}
        <h1 className="text-[20px] font-semibold mb-4">Property List</h1>
      </div>
    </div>
  );
};

export default HeroSection;
