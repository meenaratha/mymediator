// Import MUI icons
import HomeIcon from "@mui/icons-material/Home";
import KitchenIcon from "@mui/icons-material/Kitchen";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import IMAGES from "@/utils/images.js";

const Sell = () => {
  return (
    <>
      <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-[780px] w-full flex flex-col md:flex-row gap-6">
          {/* Left Categories Section */}
          <div className="bg-white rounded-lg shadow-md p-6 flex-1">
            <h2 className="text-center text-xl font-bold text-[#012D49] mb-6">
              Select Categories
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {/* Property Category */}
              <div className="flex flex-col items-center">
                <div className="bg-[#012D49] rounded-lg w-full aspect-square flex flex-col gap-2 items-center justify-center mb-2 relative overflow-hidden cursor-pointer">
                  <div
                    className="absolute bottom-0 w-full h-1/3  border border-[#A5BBC9]"
                    style={{
                      background: "#02487C",
                    }}
                  ></div>
                  <img
                    src={IMAGES.propertycategory}
                    alt=""
                    className="w-16 h-16"
                  />
                  <span className="text-sm font-medium text-center pt-8 text-white relative z-[10]">
                    Property
                  </span>
                </div>
              </div>

              {/* Electronics Category */}
              <div className="flex flex-col items-center">
                <div className="bg-[#FFFFFF] border border-[#E6E6E6] rounded-lg w-full aspect-square flex flex-col gap-2 items-center justify-center mb-2 relative overflow-hidden cursor-pointer">
                  <div
                    className="absolute bottom-0 w-full h-1/3  border border-[#A5BBC9]"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(200, 214, 224, 0.61) 0%, rgba(176, 213, 234, 0.61) 100%)",
                    }}
                  ></div>
                  <img
                    src={IMAGES.electronicscategory}
                    alt=""
                    className="w-16 h-16"
                  />
                  <span className="text-sm font-medium text-center pt-8 text-black relative z-[10]">
                    Electronics
                  </span>
                </div>
              </div>

              {/* Cars Category */}
              <div className="flex flex-col items-center">
                <div className="bg-[#FFFFFF] border border-[#E6E6E6] rounded-lg w-full aspect-square flex flex-col gap-2 items-center justify-center mb-2 relative overflow-hidden cursor-pointer">
                  <div
                    className="absolute bottom-0 w-full h-1/3  border border-[#A5BBC9]"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(200, 214, 224, 0.61) 0%, rgba(176, 213, 234, 0.61) 100%)",
                    }}
                  ></div>
                  <img src={IMAGES.carcategory} alt="" className="w-16 h-16" />
                  <span className="text-sm font-medium text-center pt-8 text-black relative z-[10]">
                    Cars
                  </span>
                </div>
              </div>

              {/* Bikes Category */}
              <div className="flex flex-col items-center">
                <div className="bg-[#FFFFFF] border border-[#E6E6E6]  rounded-lg w-full aspect-square flex flex-col gap-2 items-center justify-center mb-2 relative overflow-hidden cursor-pointer">
                  <div
                    className="absolute bottom-0 w-full h-1/3  border border-[#A5BBC9]"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(200, 214, 224, 0.61) 0%, rgba(176, 213, 234, 0.61) 100%)",
                    }}
                  ></div>
                  <img src={IMAGES.bikecategory} alt="" className="w-16 h-16" />
                  <span className="text-sm font-medium text-center pt-8 text-black relative z-[10]">
                    Bikes
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Subcategories Section */}
          <div className="flex flex-col gap-4 flex-1">
            {/* For Sale: Houses & Apartment */}
            <div className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center">
              <span className="font-medium">For Sale : Houses & Apartment</span>
              <ArrowForwardIosIcon className="text-blue-600 text-sm" />
            </div>

            {/* For Rent: Houses & Apartment */}
            <div className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center">
              <span className="font-medium">For Rent : Houses & Apartment</span>
              <ArrowForwardIosIcon className="text-blue-600 text-sm" />
            </div>

            {/* Lands & Plots */}
            <div className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center">
              <span className="font-medium">Lands & Plots</span>
              <ArrowForwardIosIcon className="text-blue-600 text-sm" />
            </div>

            {/* For Rent: Shops & Offices */}
            <div className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center">
              <span className="font-medium">For Rent : Shops & Offices</span>
              <ArrowForwardIosIcon className="text-blue-600 text-sm" />
            </div>

            {/* For Sale: Shops & Offices */}
            <div className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center">
              <span className="font-medium">For Sale : Shops & Offices</span>
              <ArrowForwardIosIcon className="text-blue-600 text-sm" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sell;
