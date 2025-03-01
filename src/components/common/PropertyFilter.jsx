import React, { useState } from "react";
import FilterIcon from "@mui/icons-material/FilterList";
import styles from "@/styles/Home.module.css";
const PropertyFilter = ({ isFilterOpen, isMobile }) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    location: true,
    price: true,
    furnishing: false,
    bathrooms: false,
    constructionStatus: false,
    listedBy: false,
  });

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const [priceRange, setPriceRange] = useState([0, 100]);
  const [areaRange, setAreaRange] = useState([0, 100]);

  // Selected filter states
  const [selectedBedrooms, setSelectedBedrooms] = useState(null);
  const [selectedBathrooms, setSelectedBathrooms] = useState(null);
  const [selectedFurnishing, setSelectedFurnishing] = useState(null);

  return (
    <>
      <div
        className={`${
          styles.mymediator__filterContainer
        }  mx-auto bg-white rounded-lg shadow-sm overflow-y-auto h-[1000px] ${
          isMobile
            ? "w-[330px] transform transition-transform duration-300 ease-in-out z-40 overflow-y-auto p-4 h-[90vh]"
            : ""
        } ${
          isFilterOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } `}
      >
        <div className="p-4">
          {/* Categories Section */}
          <div className="mb-4">
            <div
              className="flex justify-between items-center cursor-pointer py-2 border-b"
              onClick={() => toggleSection("categories")}
            >
              <h2 className="font-medium text-gray-800">Categories</h2>
              <svg
                className={`w-5 h-5 transition-transform duration-300 ${
                  expandedSections.categories ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden custom-scrollbar ${
                expandedSections.categories ? "max-h-40 py-2" : "max-h-0"
              }`}
            >
              <div className="font-medium text-sm text-green-600 py-1">
                Property sale & Rent in Chennai
              </div>
              <div className="flex items-center text-sm py-1">
                <div className="w-4 h-4 rounded-full bg-black mr-2"></div>
                <span>For Sale : Houses & Apartment</span>
              </div>
              <div className="flex items-center text-sm py-1">
                <div className="w-4 h-4 rounded-full bg-black mr-2"></div>
                <span>For Rent : Houses & Apartment</span>
              </div>
              <div className="flex items-center text-sm py-1">
                <div className="w-4 h-4 rounded-full bg-black mr-2"></div>
                <span>Lands & Plots</span>
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="mb-4">
            <div
              className="flex justify-between items-center cursor-pointer py-2 border-b"
              onClick={() => toggleSection("location")}
            >
              <h2 className="font-medium text-gray-800">Location</h2>
              <svg
                className={`w-5 h-5 transition-transform duration-300 ${
                  expandedSections.location ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden custom-scrollbar ${
                expandedSections.location ? "max-h-20 py-2" : "max-h-0"
              }`}
            >
              <div className="text-sm py-1">Chennai, Tamil Nadu</div>
            </div>
          </div>

          <div className="py-1 text-sm font-medium">Filter</div>

          {/* Price Section */}
          <div className="mb-4">
            <div
              className="flex justify-between items-center cursor-pointer py-2 border-b"
              onClick={() => toggleSection("price")}
            >
              <h2 className="font-medium text-gray-800">Price</h2>
              <svg
                className={`w-5 h-5 transition-transform duration-300 ${
                  expandedSections.price ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden custom-scrollbar ${
                expandedSections.price ? "max-h-80 py-2" : "max-h-0"
              }`}
            >
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="bg-gray-100 rounded p-2 text-sm">
                  <div className="font-medium">Below 1 Lac</div>
                  <div className="text-gray-500 text-xs">310+ items</div>
                </div>
                <div className="bg-gray-100 rounded p-2 text-sm">
                  <div className="font-medium">1 Lac - 2 Lac</div>
                  <div className="text-gray-500 text-xs">1000+ items</div>
                </div>
                <div className="bg-gray-100 rounded p-2 text-sm">
                  <div className="font-medium">2 Lac - 3 Lac</div>
                  <div className="text-gray-500 text-xs">1400+ items</div>
                </div>
                <div className="bg-gray-100 rounded p-2 text-sm">
                  <div className="font-medium">3 Lac - 5 Lac</div>
                  <div className="text-gray-500 text-xs">3100+ items</div>
                </div>
                <div className="bg-gray-100 rounded p-2 text-sm">
                  <div className="font-medium">5 Lac and Above</div>
                  <div className="text-gray-500 text-xs">8700+ items</div>
                </div>
              </div>
            </div>
          </div>

          {/* Type Section */}
          <div className="mb-4">
            <h2 className="font-medium text-gray-800 py-2 border-b">Type</h2>
            <div
              className="py-2 overflow-auto custom-scrollbar"
              style={{ maxHeight: "150px" }}
            >
              <div className="flex items-center py-1">
                <input type="checkbox" id="houses" className="mr-2 h-4 w-4" />
                <label htmlFor="houses" className="text-sm">
                  Houses & Villas
                </label>
              </div>
              <div className="flex items-center py-1">
                <input
                  type="checkbox"
                  id="apartment"
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="apartment" className="text-sm">
                  Apartment
                </label>
              </div>
              <div className="flex items-center py-1">
                <input type="checkbox" id="builders" className="mr-2 h-4 w-4" />
                <label htmlFor="builders" className="text-sm">
                  Builders Floors
                </label>
              </div>
              <div className="flex items-center py-1">
                <input type="checkbox" id="frame" className="mr-2 h-4 w-4" />
                <label htmlFor="frame" className="text-sm">
                  Frame Houses
                </label>
              </div>
            </div>
          </div>

          {/* Bedrooms Section */}
          <div className="mb-4">
            <h2 className="font-medium text-gray-800 py-2 border-b">
              Bedrooms
            </h2>
            <div
              className="grid grid-cols-2 gap-2 py-2 overflow-auto custom-scrollbar"
              style={{ maxHeight: "150px" }}
            >
              <div
                className={`border rounded-md p-2 text-center text-sm cursor-pointer transition-colors ${
                  selectedBedrooms === "1+"
                    ? "border-blue-500 bg-blue-50"
                    : "hover:border-blue-500"
                }`}
                onClick={() => setSelectedBedrooms("1+")}
              >
                1+ Bedrooms
              </div>
              <div
                className={`border rounded-md p-2 text-center text-sm cursor-pointer transition-colors ${
                  selectedBedrooms === "2+"
                    ? "border-blue-500 bg-blue-50"
                    : "hover:border-blue-500"
                }`}
                onClick={() => setSelectedBedrooms("2+")}
              >
                2+ Bedrooms
              </div>
              <div
                className={`border rounded-md p-2 text-center text-sm cursor-pointer transition-colors ${
                  selectedBedrooms === "3+"
                    ? "border-blue-500 bg-blue-50"
                    : "hover:border-blue-500"
                }`}
                onClick={() => setSelectedBedrooms("3+")}
              >
                3+ Bedrooms
              </div>
              <div
                className={`border rounded-md p-2 text-center text-sm cursor-pointer transition-colors ${
                  selectedBedrooms === "4+"
                    ? "border-blue-500 bg-blue-50"
                    : "hover:border-blue-500"
                }`}
                onClick={() => setSelectedBedrooms("4+")}
              >
                4+ Bedrooms
              </div>
            </div>
          </div>

          {/* Furnishing Section */}
          <div className="mb-4">
            <div
              className="flex justify-between items-center cursor-pointer py-2 border-b"
              onClick={() => toggleSection("furnishing")}
            >
              <h2 className="font-medium text-gray-800">Furnishing</h2>
              <svg
                className={`w-5 h-5 transition-transform duration-300 ${
                  expandedSections.furnishing ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden custom-scrollbar ${
                expandedSections.furnishing ? "max-h-40 py-2" : "max-h-0"
              }`}
            >
              <div className="grid grid-cols-1 gap-2">
                <div
                  className={`border rounded-md p-2 text-center text-sm cursor-pointer transition-colors ${
                    selectedFurnishing === "furnished"
                      ? "border-blue-500 bg-blue-50"
                      : "hover:border-blue-500"
                  }`}
                  onClick={() => setSelectedFurnishing("furnished")}
                >
                  Furnishing
                </div>
                <div
                  className={`border rounded-md p-2 text-center text-sm cursor-pointer transition-colors ${
                    selectedFurnishing === "unfurnished"
                      ? "border-blue-500 bg-blue-50"
                      : "hover:border-blue-500"
                  }`}
                  onClick={() => setSelectedFurnishing("unfurnished")}
                >
                  Unfurnishing
                </div>
                <div
                  className={`border rounded-md p-2 text-center text-sm cursor-pointer transition-colors ${
                    selectedFurnishing === "semi"
                      ? "border-blue-500 bg-blue-50"
                      : "hover:border-blue-500"
                  }`}
                  onClick={() => setSelectedFurnishing("semi")}
                >
                  Semi-Furnishing
                </div>
              </div>
            </div>
          </div>

          {/* Price Per SQ.FT Section */}
          <div className="mb-4">
            <h2 className="font-medium text-gray-800 py-2 border-b">
              Price Per SQ.FT
            </h2>
            <div className="py-4">
              <div className="h-16 flex items-end mb-2">
                {/* Bar chart visualization */}
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="w-3 mx-0.5 bg-gray-300 rounded-t"
                    style={{
                      height: `${Math.max(10, Math.sin(i / 3) * 50 + 30)}%`,
                    }}
                  ></div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>0</span>
                <span>1,000,000+</span>
              </div>
              <div className="relative h-6">
                <div className="absolute h-1 bg-gray-300 rounded w-full top-3"></div>
                <div
                  className="absolute h-6 w-6 bg-white border-2 border-blue-500 rounded-full top-0 cursor-pointer"
                  style={{ left: `${priceRange[0]}%`, marginLeft: "-12px" }}
                  onMouseDown={(e) => {
                    const handleMouseMove = (e) => {
                      const container = e.target.parentElement;
                      const rect = container.getBoundingClientRect();
                      const newValue = Math.max(
                        0,
                        Math.min(
                          100,
                          ((e.clientX - rect.left) / rect.width) * 100
                        )
                      );
                      setPriceRange([newValue, priceRange[1]]);
                    };

                    const handleMouseUp = () => {
                      document.removeEventListener(
                        "mousemove",
                        handleMouseMove
                      );
                      document.removeEventListener("mouseup", handleMouseUp);
                    };

                    document.addEventListener("mousemove", handleMouseMove);
                    document.addEventListener("mouseup", handleMouseUp);
                  }}
                ></div>
                <div
                  className="absolute h-6 w-6 bg-white border-2 border-blue-500 rounded-full top-0 cursor-pointer"
                  style={{ left: `${priceRange[1]}%`, marginLeft: "-12px" }}
                  onMouseDown={(e) => {
                    const handleMouseMove = (e) => {
                      const container = e.target.parentElement;
                      const rect = container.getBoundingClientRect();
                      const newValue = Math.max(
                        0,
                        Math.min(
                          100,
                          ((e.clientX - rect.left) / rect.width) * 100
                        )
                      );
                      setPriceRange([priceRange[0], newValue]);
                    };

                    const handleMouseUp = () => {
                      document.removeEventListener(
                        "mousemove",
                        handleMouseMove
                      );
                      document.removeEventListener("mouseup", handleMouseUp);
                    };

                    document.addEventListener("mousemove", handleMouseMove);
                    document.addEventListener("mouseup", handleMouseUp);
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Bathrooms Section */}
          <div className="mb-4">
            <h2 className="font-medium text-gray-800 py-2 border-b">
              Bathrooms
            </h2>
            <div
              className="grid grid-cols-2 gap-2 py-2 overflow-auto custom-scrollbar"
              style={{ maxHeight: "150px" }}
            >
              <div
                className={`border rounded-md p-2 text-center text-sm cursor-pointer transition-colors ${
                  selectedBathrooms === "1+"
                    ? "border-blue-500 bg-blue-50"
                    : "hover:border-blue-500"
                }`}
                onClick={() => setSelectedBathrooms("1+")}
              >
                1+ Bathrooms
              </div>
              <div
                className={`border rounded-md p-2 text-center text-sm cursor-pointer transition-colors ${
                  selectedBathrooms === "2+"
                    ? "border-blue-500 bg-blue-50"
                    : "hover:border-blue-500"
                }`}
                onClick={() => setSelectedBathrooms("2+")}
              >
                2+ Bathrooms
              </div>
              <div
                className={`border rounded-md p-2 text-center text-sm cursor-pointer transition-colors ${
                  selectedBathrooms === "3+"
                    ? "border-blue-500 bg-blue-50"
                    : "hover:border-blue-500"
                }`}
                onClick={() => setSelectedBathrooms("3+")}
              >
                3+ Bathrooms
              </div>
              <div
                className={`border rounded-md p-2 text-center text-sm cursor-pointer transition-colors ${
                  selectedBathrooms === "4+"
                    ? "border-blue-500 bg-blue-50"
                    : "hover:border-blue-500"
                }`}
                onClick={() => setSelectedBathrooms("4+")}
              >
                4+ Bathrooms
              </div>
            </div>
          </div>

          {/* Construction Status Section */}
          <div className="mb-4">
            <h2 className="font-medium text-gray-800 py-2 border-b">
              Construction Status
            </h2>
            <div
              className="py-2 overflow-auto custom-scrollbar"
              style={{ maxHeight: "150px" }}
            >
              <div className="flex items-center py-1">
                <input
                  type="checkbox"
                  id="under-construction"
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="under-construction" className="text-sm">
                  Under Construction
                </label>
              </div>
              <div className="flex items-center py-1">
                <input
                  type="checkbox"
                  id="ready-to-move"
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="ready-to-move" className="text-sm">
                  Ready to Move
                </label>
              </div>
              <div className="flex items-center py-1">
                <input
                  type="checkbox"
                  id="new-launch"
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="new-launch" className="text-sm">
                  New Launch
                </label>
              </div>
            </div>
          </div>

          {/* Listed By Section */}
          <div className="mb-4">
            <h2 className="font-medium text-gray-800 py-2 border-b">
              Listed By
            </h2>
            <div
              className="py-2 overflow-auto custom-scrollbar"
              style={{ maxHeight: "150px" }}
            >
              <div className="flex items-center py-1">
                <input type="checkbox" id="owner" className="mr-2 h-4 w-4" />
                <label htmlFor="owner" className="text-sm">
                  Owner
                </label>
              </div>
              <div className="flex items-center py-1">
                <input type="checkbox" id="dealer" className="mr-2 h-4 w-4" />
                <label htmlFor="dealer" className="text-sm">
                  Dealer
                </label>
              </div>
              <div className="flex items-center py-1">
                <input type="checkbox" id="builder" className="mr-2 h-4 w-4" />
                <label htmlFor="builder" className="text-sm">
                  Builder
                </label>
              </div>
            </div>
          </div>

          {/* Super Buildup Area Section */}
          <div className="mb-4">
            <h2 className="font-medium text-gray-800 py-2 border-b">
              Super Buildup Area
            </h2>
            <div className="py-4">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>0</span>
                <span>1,000,000+</span>
              </div>
              <div className="relative h-6">
                <div className="absolute h-1 bg-gray-300 rounded w-full top-3"></div>
                <div
                  className="absolute h-6 w-6 bg-white border-2 border-blue-500 rounded-full top-0 cursor-pointer"
                  style={{ left: `${areaRange[0]}%`, marginLeft: "-12px" }}
                  onMouseDown={(e) => {
                    const handleMouseMove = (e) => {
                      const container = e.target.parentElement;
                      const rect = container.getBoundingClientRect();
                      const newValue = Math.max(
                        0,
                        Math.min(
                          100,
                          ((e.clientX - rect.left) / rect.width) * 100
                        )
                      );
                      setAreaRange([newValue, areaRange[1]]);
                    };

                    const handleMouseUp = () => {
                      document.removeEventListener(
                        "mousemove",
                        handleMouseMove
                      );
                      document.removeEventListener("mouseup", handleMouseUp);
                    };

                    document.addEventListener("mousemove", handleMouseMove);
                    document.addEventListener("mouseup", handleMouseUp);
                  }}
                ></div>
                <div
                  className="absolute h-6 w-6 bg-white border-2 border-blue-500 rounded-full top-0 cursor-pointer"
                  style={{ left: `${areaRange[1]}%`, marginLeft: "-12px" }}
                  onMouseDown={(e) => {
                    const handleMouseMove = (e) => {
                      const container = e.target.parentElement;
                      const rect = container.getBoundingClientRect();
                      const newValue = Math.max(
                        0,
                        Math.min(
                          100,
                          ((e.clientX - rect.left) / rect.width) * 100
                        )
                      );
                      setAreaRange([areaRange[0], newValue]);
                    };

                    const handleMouseUp = () => {
                      document.removeEventListener(
                        "mousemove",
                        handleMouseMove
                      );
                      document.removeEventListener("mouseup", handleMouseUp);
                    };

                    document.addEventListener("mousemove", handleMouseMove);
                    document.addEventListener("mouseup", handleMouseUp);
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Add custom scrollbar styles
// const styles = document.createElement("style");
// styles.textContent = `
//   .custom-scrollbar::-webkit-scrollbar {
//     width: 4px;
//   }

//   .custom-scrollbar::-webkit-scrollbar-track {
//     background:rgb(14, 135, 216);
//   }

//   .custom-scrollbar::-webkit-scrollbar-thumb {
//     background-color: #cbd5e0;
//     border-radius: 20px;
//   }

//   .custom-scrollbar {
//     scrollbar-width: thin;
//     scrollbar-color: #cbd5e0 #f7fafc;
//   }
// `;
// document.head.appendChild(styles);

export default PropertyFilter;
