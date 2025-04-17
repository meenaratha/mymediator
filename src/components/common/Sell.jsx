// Import MUI icons
import IMAGES from "@/utils/images.js";
import {
  Navigate,
  useNavigate,
  useLocation,
  Link,
  NavLink,
} from "react-router-dom";
import { useMediaQuery } from "react-responsive"; // For detecting mobile devices
import { useState } from "react"; // Import useState for managing active tab

const Sell = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const navigate = useNavigate();
  // Add state to track active category
  const [activeCategory, setActiveCategory] = useState("property");

  // Handler to switch tabs
  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  return (
    <>
      <div className=" min-h-screen flex items-center justify-center py-10">
        <div className="max-w-[780px] w-full flex flex-col md:flex-row gap-6">
          {/* Left Categories Section */}
          <div className="bg-white rounded-lg shadow-md p-6 flex-1 h-[fit-content]">
            <h2 className="text-center text-xl font-bold text-[#012D49] mb-6">
              Select Categories
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {/* Property Category */}
              <div className="flex flex-col items-center">
                <div
                  onClick={() => handleCategoryClick("property")}
                  className={`${
                    activeCategory === "property"
                      ? "bg-[#012D49]"
                      : "bg-[#FFFFFF] border border-[#E6E6E6]"
                  } rounded-lg w-full aspect-square flex flex-col gap-2 items-center justify-center mb-2 relative overflow-hidden cursor-pointer`}
                >
                  <div
                    className="absolute bottom-0 w-full h-1/3 border border-[#A5BBC9]"
                    style={{
                      background:
                        activeCategory === "property"
                          ? "#02487C"
                          : "linear-gradient(90deg, rgba(200, 214, 224, 0.61) 0%, rgba(176, 213, 234, 0.61) 100%)",
                    }}
                  ></div>
                  <img
                    src={IMAGES.propertycategory}
                    alt=""
                    className="w-16 h-16"
                  />
                  <span
                    className={`text-sm font-medium text-center pt-8 ${
                      activeCategory === "property"
                        ? "text-white"
                        : "text-black"
                    } relative z-[10]`}
                  >
                    Property
                  </span>
                </div>
              </div>

              {/* Electronics Category */}
              <div className="flex flex-col items-center">
                <div
                  onClick={() => handleCategoryClick("electronics")}
                  className={`${
                    activeCategory === "electronics"
                      ? "bg-[#012D49]"
                      : "bg-[#FFFFFF] border border-[#E6E6E6]"
                  } rounded-lg w-full aspect-square flex flex-col gap-2 items-center justify-center mb-2 relative overflow-hidden cursor-pointer`}
                >
                  <div
                    className="absolute bottom-0 w-full h-1/3 border border-[#A5BBC9]"
                    style={{
                      background:
                        activeCategory === "electronics"
                          ? "#02487C"
                          : "linear-gradient(90deg, rgba(200, 214, 224, 0.61) 0%, rgba(176, 213, 234, 0.61) 100%)",
                    }}
                  ></div>
                  <img
                    src={IMAGES.electronicscategory}
                    alt=""
                    className="w-16 h-16"
                  />
                  <span
                    className={`text-sm font-medium text-center pt-8 ${
                      activeCategory === "electronics"
                        ? "text-white"
                        : "text-black"
                    } relative z-[10]`}
                  >
                    Electronics
                  </span>
                </div>
              </div>

              {/* Cars Category */}
              <div className="flex flex-col items-center">
                <div
                  onClick={() => handleCategoryClick("cars")}
                  className={`${
                    activeCategory === "cars"
                      ? "bg-[#012D49]"
                      : "bg-[#FFFFFF] border border-[#E6E6E6]"
                  } rounded-lg w-full aspect-square flex flex-col gap-2 items-center justify-center mb-2 relative overflow-hidden cursor-pointer`}
                >
                  <div
                    className="absolute bottom-0 w-full h-1/3 border border-[#A5BBC9]"
                    style={{
                      background:
                        activeCategory === "cars"
                          ? "#02487C"
                          : "linear-gradient(90deg, rgba(200, 214, 224, 0.61) 0%, rgba(176, 213, 234, 0.61) 100%)",
                    }}
                  ></div>
                  <img src={IMAGES.carcategory} alt="" className="w-16 h-16" />
                  <span
                    className={`text-sm font-medium text-center pt-8 ${
                      activeCategory === "cars" ? "text-white" : "text-black"
                    } relative z-[10]`}
                  >
                    Cars
                  </span>
                </div>
              </div>

              {/* Bikes Category */}
              <div className="flex flex-col items-center">
                <div
                  onClick={() => handleCategoryClick("bikes")}
                  className={`${
                    activeCategory === "bikes"
                      ? "bg-[#012D49]"
                      : "bg-[#FFFFFF] border border-[#E6E6E6]"
                  } rounded-lg w-full aspect-square flex flex-col gap-2 items-center justify-center mb-2 relative overflow-hidden cursor-pointer`}
                >
                  <div
                    className="absolute bottom-0 w-full h-1/3 border border-[#A5BBC9]"
                    style={{
                      background:
                        activeCategory === "bikes"
                          ? "#02487C"
                          : "linear-gradient(90deg, rgba(200, 214, 224, 0.61) 0%, rgba(176, 213, 234, 0.61) 100%)",
                    }}
                  ></div>
                  <img src={IMAGES.bikecategory} alt="" className="w-16 h-16" />
                  <span
                    className={`text-sm font-medium text-center pt-8 ${
                      activeCategory === "bikes" ? "text-white" : "text-black"
                    } relative z-[10]`}
                  >
                    Bikes
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Subcategories Section */}
          {/* Show content based on active category */}
          {activeCategory === "property" && (
            <div className="flex flex-col gap-4 flex-1">
              {/* For Sale: Houses & Apartment */}
              <Link
                to="/sale-house-apartment"
                className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center cursor-pointer"
              >
                <span className="font-medium">
                  For Sale : Houses & Apartment
                </span>
                <img
                  src={IMAGES.doublearrow}
                  alt=""
                  className="w-[30px] h-[30px]"
                />
              </Link>

              {/* For Rent: Houses & Apartment */}
              <Link
                to="/rent-house-apartment"
                className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center cursor-pointer"
              >
                <span className="font-medium">
                  For Rent : Houses & Apartment
                </span>
                <img
                  src={IMAGES.doublearrow}
                  alt=""
                  className="w-[30px] h-[30px]"
                />
              </Link>

              {/* Lands & Plots */}
              <Link
                to="/land-plot"
                className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center cursor-pointer"
              >
                <span className="font-medium">Lands & Plots</span>
                <img
                  src={IMAGES.doublearrow}
                  alt=""
                  className="w-[30px] h-[30px]"
                />
              </Link>

              {/* For Rent: Shops & Offices */}
              <Link
                to="/rent-shop-office"
                className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center cursor-pointer"
              >
                <span className="font-medium">For Rent : Shops & Offices</span>
                <img
                  src={IMAGES.doublearrow}
                  alt=""
                  className="w-[30px] h-[30px]"
                />
              </Link>

              {/* For Sale: Shops & Offices */}
              <Link
                to="/sale-shop-office"
                className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center cursor-pointer"
              >
                <span className="font-medium">For Sale : Shops & Offices</span>
                <img
                  src={IMAGES.doublearrow}
                  alt=""
                  className="w-[30px] h-[30px]"
                />
              </Link>
            </div>
          )}

          {/* Show electronics tab content only when electronics is active */}
          {activeCategory === "electronics" && (
            <div className="flex flex-col gap-4 flex-1">
              {/* Television */}
              <Link
                to="/upload-electronics"
                className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center cursor-pointer"
              >
                <span className="font-medium">Television</span>
                <img
                  src={IMAGES.doublearrow}
                  alt=""
                  className="w-[30px] h-[30px]"
                />
              </Link>

              {/* Computer */}
              <Link
                to="/upload-electronics"
                className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center cursor-pointer"
              >
                <span className="font-medium">Computer</span>
                <img
                  src={IMAGES.doublearrow}
                  alt=""
                  className="w-[30px] h-[30px]"
                />
              </Link>

              {/* Washing Machine */}
              <Link
                to="/upload-electronics"
                className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center cursor-pointer"
              >
                <span className="font-medium">Washing Machine</span>
                <img
                  src={IMAGES.doublearrow}
                  alt=""
                  className="w-[30px] h-[30px]"
                />
              </Link>

              {/* Mobile Phone */}
              <Link
                to="/upload-electronics"
                className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center cursor-pointer"
              >
                <span className="font-medium">Mobile Phone</span>
                <img
                  src={IMAGES.doublearrow}
                  alt=""
                  className="w-[30px] h-[30px]"
                />
              </Link>

              {/* Laptop*/}
              <Link
                to="/upload-electronics"
                className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center cursor-pointer"
              >
                <span className="font-medium">Laptop</span>
                <img
                  src={IMAGES.doublearrow}
                  alt=""
                  className="w-[30px] h-[30px]"
                />
              </Link>

              {/* Printers*/}
              <Link
                to="/upload-electronics"
                className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center cursor-pointer"
              >
                <span className="font-medium">Printers</span>
                <img
                  src={IMAGES.doublearrow}
                  alt=""
                  className="w-[30px] h-[30px]"
                />
              </Link>

              {/* AC*/}
              <Link
                to="/upload-electronics"
                className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center cursor-pointer"
              >
                <span className="font-medium">AC</span>
                <img
                  src={IMAGES.doublearrow}
                  alt=""
                  className="w-[30px] h-[30px]"
                />
              </Link>
              {/* Fridges*/}
              <Link
                to="/upload-electronics"
                className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center cursor-pointer"
              >
                <span className="font-medium">Fridges</span>
                <img
                  src={IMAGES.doublearrow}
                  alt=""
                  className="w-[30px] h-[30px]"
                />
              </Link>
              {/* View All*/}
              <Link
                to=""
                className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center cursor-pointer"
              >
                <span className="font-medium">View All</span>
                <img
                  src={IMAGES.doublearrow}
                  alt=""
                  className="w-[30px] h-[30px]"
                />
              </Link>
            </div>
          )}

          {/* Cars tab content (placeholder, add actual content) */}
          {activeCategory === "cars" && (
            <div className="flex flex-col gap-4 flex-1">
              <Link
                to="/upload-car"
                className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center cursor-pointer"
              >
                <span className="font-medium">Upload Car</span>
                <img
                  src={IMAGES.doublearrow}
                  alt=""
                  className="w-[30px] h-[30px]"
                />
              </Link>
            </div>
          )}

          {/* Bikes tab content (placeholder, add actual content) */}
          {activeCategory === "bikes" && (
            <div className="flex flex-col gap-4 flex-1">
              <Link
                to="/upload-motercycle"
                className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center cursor-pointer"
              >
                <span className="font-medium">Motorcycles</span>
                <img
                  src={IMAGES.doublearrow}
                  alt=""
                  className="w-[30px] h-[30px]"
                />
              </Link>
              <Link
                to="/upload-bicycle"
                className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center cursor-pointer"
              >
                <span className="font-medium">Scooters</span>
                <img
                  src={IMAGES.doublearrow}
                  alt=""
                  className="w-[30px] h-[30px]"
                />
              </Link>
              <Link
                to="/upload-bicycle"
                className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center cursor-pointer"
              >
                <span className="font-medium">Bicycle</span>
                <img
                  src={IMAGES.doublearrow}
                  alt=""
                  className="w-[30px] h-[30px]"
                />
              </Link>
              <Link
                to=""
                className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center cursor-pointer"
              >
                <span className="font-medium">View All</span>
                <img
                  src={IMAGES.doublearrow}
                  alt=""
                  className="w-[30px] h-[30px]"
                />
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sell;
