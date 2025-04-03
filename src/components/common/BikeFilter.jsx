import React, { useState } from "react";
import styles from "@/styles/Home.module.css";

const BikeFilter = ({ isFilterOpen, isMobile }) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    location: true,
    brand: true,
    kmDriven: true,
    year: true,
    price: true,
  });

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedBrands, setSelectedBrands] = useState([]);

  return (
    <div
      className={`${
        styles.mymediator__filterContainer
      } bg-white rounded-lg shadow-sm ${
        isMobile
          ? "w-full max-w-sm transform transition-transform duration-300 ease-in-out z-40 p-4 h-full"
          : "h-full"
      } ${
        isFilterOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      <div className="h-full overflow-y-auto pb-4 px-2">
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
            className={`transition-all duration-300 ease-in-out ${
              expandedSections.categories ? "max-h-60 py-2" : "max-h-0 overflow-hidden"
            }`}
          >
            <div className="text-sm py-1 font-medium bg-gray-100 p-2 rounded">
              Bike
            </div>
            <div className="flex items-center text-sm py-1">
              <div className="w-4 h-4 rounded-full bg-black mr-2"></div>
              <span>Motorcycles</span>
            </div>
            <div className="flex items-center text-sm py-1">
              <div className="w-4 h-4 rounded-full bg-black mr-2"></div>
              <span>Scooters</span>
            </div>
            <div className="flex items-center text-sm py-1">
              <div className="w-4 h-4 rounded-full bg-black mr-2"></div>
              <span>Bicycles</span>
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
            className={`transition-all duration-300 ease-in-out ${
              expandedSections.location ? "max-h-60 py-2" : "max-h-0 overflow-hidden"
            }`}
          >
            {/* Search bar */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search Your Location Need"
                className="w-full p-2 pl-8 border rounded-md text-sm"
              />
              <svg
                className="absolute left-2 top-2.5 w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div className="text-sm py-1">Chennai, Tamil Nadu</div>
          </div>
        </div>

        <div className="py-1 text-sm font-medium">Filter</div>

        {/* Select Brand Section */}
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Select Brand</h3>
          <div className="h-40 overflow-y-auto">
            <div className="flex items-center py-1">
              <input
                type="checkbox"
                id="maruti"
                className="mr-2 h-4 w-4"
              />
              <label htmlFor="maruti" className="text-sm">
                Maruti Suzuki (3,561)
              </label>
            </div>
            <div className="flex items-center py-1">
              <input type="checkbox" id="hyundai" className="mr-2 h-4 w-4" />
              <label htmlFor="hyundai" className="text-sm">
                Hyundai (3,002)
              </label>
            </div>
            <div className="flex items-center py-1">
              <input type="checkbox" id="honda" className="mr-2 h-4 w-4" />
              <label htmlFor="honda" className="text-sm">
                Honda (1,152)
              </label>
            </div>
            <div className="flex items-center py-1">
              <input type="checkbox" id="mahindra" className="mr-2 h-4 w-4" />
              <label htmlFor="mahindra" className="text-sm">
                Mahindra (1,139)
              </label>
            </div>
          </div>
        </div>

        {/* Select Model Section */}
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Select Model</h3>
          <div className="h-40 overflow-y-auto">
            <div className="flex items-center py-1">
              <input type="checkbox" id="model1" className="mr-2 h-4 w-4" />
              <label htmlFor="model1" className="text-sm">
                Maruti Suzuki (3,561)
              </label>
            </div>
            <div className="flex items-center py-1">
              <input type="checkbox" id="model2" className="mr-2 h-4 w-4" />
              <label htmlFor="model2" className="text-sm">
                Hyundai (3,002)
              </label>
            </div>
            <div className="flex items-center py-1">
              <input type="checkbox" id="model3" className="mr-2 h-4 w-4" />
              <label htmlFor="model3" className="text-sm">
                Honda (1,152)
              </label>
            </div>
            <div className="flex items-center py-1">
              <input type="checkbox" id="model4" className="mr-2 h-4 w-4" />
              <label htmlFor="model4" className="text-sm">
                Mahindra (1,139)
              </label>
            </div>
          </div>
        </div>

        {/* KM Driven Section */}
        <div className="mb-4">
          <div
            className="flex justify-between items-center cursor-pointer py-2 border-b"
            onClick={() => toggleSection("kmDriven")}
          >
            <h2 className="font-medium text-gray-800">KM Driven</h2>
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${
                expandedSections.kmDriven ? "rotate-180" : ""
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
            className={`transition-all duration-300 ease-in-out ${
              expandedSections.kmDriven ? "py-2" : "max-h-0 overflow-hidden"
            }`}
          >
            <div className="grid grid-cols-1 gap-2">
              <div className="bg-gray-100 rounded text-sm p-4 flex justify-between">
                <div className="font-medium">Below 25,000 Km</div>
                <div className="text-gray-500 text-xs">310+ items</div>
              </div>
              <div className="bg-gray-100 rounded p-4 flex justify-between text-sm">
                <div className="font-medium">25,000 Km - 50,000 Km</div>
                <div className="text-gray-500 text-xs">110+ items</div>
              </div>
              <div className="bg-gray-100 rounded p-4 flex justify-between text-sm">
                <div className="font-medium">50,000 Km - 75,000 Km</div>
                <div className="text-gray-500 text-xs">110+ items</div>
              </div>
              <div className="bg-gray-100 rounded p-4 flex justify-between text-sm">
                <div className="font-medium">75,000 Km - 85,000 Km</div>
                <div className="text-gray-500 text-xs">110+ items</div>
              </div>
              <div className="bg-gray-100 rounded p-4 flex justify-between text-sm">
                <div className="font-medium">90,000 Km - 100,000 Km</div>
                <div className="text-gray-500 text-xs">110+ items</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Year Section */}
        <div className="mb-4">
          <div
            className="flex justify-between items-center cursor-pointer py-2 border-b"
            onClick={() => toggleSection("year")}
          >
            <h2 className="font-medium text-gray-800">Year</h2>
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${
                expandedSections.year ? "rotate-180" : ""
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
            className={`transition-all duration-300 ease-in-out ${
              expandedSections.year ? "py-2" : "max-h-0 overflow-hidden"
            }`}
          >
            <div className="grid grid-cols-1 gap-2">
              <div className="bg-gray-100 rounded text-sm p-4 flex justify-between">
                <div className="font-medium">Under 3 Years</div>
                <div className="text-gray-500 text-xs">(1,000 + Bikes)</div>
              </div>
              <div className="bg-gray-100 rounded p-4 flex justify-between text-sm">
                <div className="font-medium">Under 5 Years</div>
                <div className="text-gray-500 text-xs">(1,524 + Bikes)</div>
              </div>
              <div className="bg-gray-100 rounded p-4 flex justify-between text-sm">
                <div className="font-medium">Under 7 Years</div>
                <div className="text-gray-500 text-xs">(2,453 + Bikes)</div>
              </div>
              <div className="bg-gray-100 rounded p-4 flex justify-between text-sm">
                <div className="font-medium">More then 3 Years</div>
                <div className="text-gray-500 text-xs">(500 + Bikes)</div>
              </div>
            </div>
          </div>
        </div>

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
            className={`transition-all duration-300 ease-in-out ${
              expandedSections.price ? "py-2" : "max-h-0 overflow-hidden"
            }`}
          >
            <div className="grid grid-cols-1 gap-2">
              <div className="bg-gray-100 rounded text-sm p-4 flex justify-between">
                <div className="font-medium">Below 1 Lac</div>
                <div className="text-gray-500 text-xs">310+ items</div>
              </div>
              <div className="bg-gray-100 rounded p-4 flex justify-between text-sm">
                <div className="font-medium">1 Lac - 2 Lac</div>
                <div className="text-gray-500 text-xs">1000+ items</div>
              </div>
              <div className="bg-gray-100 rounded p-4 flex justify-between text-sm">
                <div className="font-medium">2 Lac - 3 Lac</div>
                <div className="text-gray-500 text-xs">1400+ items</div>
              </div>
              <div className="bg-gray-100 rounded p-4 flex justify-between text-sm">
                <div className="font-medium">3 Lac - 5 Lac</div>
                <div className="text-gray-500 text-xs">3100+ items</div>
              </div>
              <div className="bg-gray-100 rounded p-4 flex justify-between text-sm">
                <div className="font-medium">5 Lac and Above</div>
                <div className="text-gray-500 text-xs">8700+ items</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BikeFilter;