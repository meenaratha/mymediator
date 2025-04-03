import React, { useState } from "react";
import styles from "@/styles/Home.module.css";
import IMAGES from "@/utils/images.js";

const CarFilter = ({ isFilterOpen, isMobile }) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    location: true,
    brand: true,
    price: true,
    kmDriven: true,
    year: true,
    owners: true,
    fuel: true,
    inspection: true,
    transmission: true,
  });

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedFuelType, setSelectedFuelType] = useState(null);

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
              expandedSections.categories
                ? "max-h-60 py-2"
                : "max-h-0 overflow-hidden"
            }`}
          >
            <div className="text-sm py-1 font-medium bg-gray-100 p-4 py-4 rounded">
              Car (15,000)
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
              expandedSections.location
                ? "max-h-20 py-2"
                : "max-h-0 overflow-hidden"
            }`}
          >
            <div className="text-sm py-1">Chennai, Tamil Nadu</div>
          </div>
        </div>

        <div className="py-1 text-sm font-medium">Filter</div>

        {/* Brand & Model Section */}
        <div className="mb-4">
          <div
            className="flex justify-between items-center cursor-pointer py-2 border-b"
            onClick={() => toggleSection("brand")}
          >
            <h2 className="font-medium text-gray-800">Brand & Model</h2>
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${
                expandedSections.brand ? "rotate-180" : ""
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
              expandedSections.brand ? "py-2" : "max-h-0 overflow-hidden"
            }`}
          >
            {/* Search bar */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search your Brand & Model"
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

            {/* Brand logos */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="border rounded-md p-2 flex items-center justify-center">
                <img
                  src={IMAGES.toyotoLogo}
                  alt="Toyota"
                  className="h-15 w-15 object-contain"
                />
              </div>
              <div className="border rounded-md p-2 flex items-center justify-center">
                <img
                  src={IMAGES.maruthiLogo}
                  alt="Maruti Suzuki"
                  className="h-15 w-15 object-contain"
                />
              </div>
              <div className="border rounded-md p-2 flex items-center justify-center">
                <img
                  src={IMAGES.hondaLogo}
                  alt="Hyundai"
                  className="h-15 w-15 object-contain"
                />
              </div>
              <div className="border rounded-md p-2 flex items-center justify-center">
                <img
                  src={IMAGES.mahendraLogo}
                  alt="Mahindra"
                  className="h-15 w-15 object-contain"
                />
              </div>
              <div className="border rounded-md p-2 flex items-center justify-center">
                <img
                  src={IMAGES.tataLogo}
                  alt="Tata"
                  className="h-15 w-15 object-contain"
                />
              </div>
              <div className="border rounded-md p-2 flex items-center justify-center">
                <img
                  src={IMAGES.hondaLogo}
                  alt="Honda"
                  className="h-15 w-15 object-contain"
                />
              </div>
            </div>

            {/* Select Brand Section */}
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Select Brand</h3>
              <div className="h-40 overflow-y-auto  rounded-md p-2">
                <div className="flex items-center py-1">
                  <input type="checkbox" id="maruti" className="mr-2 h-4 w-4" />
                  <label htmlFor="maruti" className="text-sm">
                    Maruti Suzuki (3,561)
                  </label>
                </div>
                <div className="flex items-center py-1">
                  <input
                    type="checkbox"
                    id="hyundai"
                    className="mr-2 h-4 w-4"
                  />
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
                  <input
                    type="checkbox"
                    id="mahindra"
                    className="mr-2 h-4 w-4"
                  />
                  <label htmlFor="mahindra" className="text-sm">
                    Mahindra (1,139)
                  </label>
                </div>
              </div>
            </div>

            {/* Select Model Section */}
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Select Model</h3>
              <div className="h-40 overflow-y-auto  rounded-md p-2">
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
                <div className="text-gray-500 text-xs">(1,000 + Cars)</div>
              </div>
              <div className="bg-gray-100 rounded p-4 flex justify-between text-sm">
                <div className="font-medium">Under 5 Years</div>
                <div className="text-gray-500 text-xs">(1,524 + Cars)</div>
              </div>
              <div className="bg-gray-100 rounded p-4 flex justify-between text-sm">
                <div className="font-medium">Under 7 Years</div>
                <div className="text-gray-500 text-xs">(2,453 + Cars)</div>
              </div>
              <div className="bg-gray-100 rounded p-4 flex justify-between text-sm">
                <div className="font-medium">More than 3 Years</div>
                <div className="text-gray-500 text-xs">(500 + Cars)</div>
              </div>
            </div>
          </div>
        </div>

        {/* No of owner Section */}
        <div className="mb-4">
          <div
            className="flex justify-between items-center cursor-pointer py-2 border-b"
            onClick={() => toggleSection("owners")}
          >
            <h2 className="font-medium text-gray-800">No of owner</h2>
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${
                expandedSections.owners ? "rotate-180" : ""
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
              expandedSections.owners ? "py-2" : "max-h-0 overflow-hidden"
            }`}
          >
            <div className="py-2">
              <div className="flex items-center py-1">
                <input
                  type="checkbox"
                  id="first-owner"
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="first-owner" className="text-sm">
                  First (3,561)
                </label>
              </div>
              <div className="flex items-center py-1">
                <input
                  type="checkbox"
                  id="second-owner"
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="second-owner" className="text-sm">
                  Second (3,002)
                </label>
              </div>
              <div className="flex items-center py-1">
                <input
                  type="checkbox"
                  id="third-owner"
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="third-owner" className="text-sm">
                  Third (1,152)
                </label>
              </div>
              <div className="flex items-center py-1">
                <input
                  type="checkbox"
                  id="fourth-owner"
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="fourth-owner" className="text-sm">
                  Fourth (1,139)
                </label>
              </div>
              <div className="flex items-center py-1">
                <input
                  type="checkbox"
                  id="more-owners"
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="more-owners" className="text-sm">
                  More than Fourth (27)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Fuel Section */}
        <div className="mb-4">
          <div
            className="flex justify-between items-center cursor-pointer py-2 border-b"
            onClick={() => toggleSection("fuel")}
          >
            <h2 className="font-medium text-gray-800">Fuel</h2>
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${
                expandedSections.fuel ? "rotate-180" : ""
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
              expandedSections.fuel ? "py-2" : "max-h-0 overflow-hidden"
            }`}
          >
            <div className="py-2">
              <div className="flex items-center py-1">
                <input type="checkbox" id="petrol" className="mr-2 h-4 w-4" />
                <label htmlFor="petrol" className="text-sm">
                  Petrol (3,561)
                </label>
              </div>
              <div className="flex items-center py-1">
                <input type="checkbox" id="diesel" className="mr-2 h-4 w-4" />
                <label htmlFor="diesel" className="text-sm">
                  Diesel (3,002)
                </label>
              </div>
              <div className="flex items-center py-1">
                <input type="checkbox" id="lpg" className="mr-2 h-4 w-4" />
                <label htmlFor="lpg" className="text-sm">
                  LPG (1,152)
                </label>
              </div>
              <div className="flex items-center py-1">
                <input type="checkbox" id="cng" className="mr-2 h-4 w-4" />
                <label htmlFor="cng" className="text-sm">
                  CNG & Hybrid (1,139)
                </label>
              </div>
              <div className="flex items-center py-1">
                <input type="checkbox" id="electric" className="mr-2 h-4 w-4" />
                <label htmlFor="electric" className="text-sm">
                  Electric (27)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* INSPECTION STATUS Section */}
        <div className="mb-4">
          <div
            className="flex justify-between items-center cursor-pointer py-2 border-b"
            onClick={() => toggleSection("inspection")}
          >
            <h2 className="font-medium text-gray-800">INSPECTION STATUS</h2>
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${
                expandedSections.inspection ? "rotate-180" : ""
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
              expandedSections.inspection ? "py-2" : "max-h-0 overflow-hidden"
            }`}
          >
            <div className="py-2">
              <div className="flex items-center py-1">
                <input
                  type="checkbox"
                  id="inspected"
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="inspected" className="text-sm">
                  Inspected Cars Only (0)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* TRANSMISSION Section */}
        <div className="mb-4">
          <div
            className="flex justify-between items-center cursor-pointer py-2 border-b"
            onClick={() => toggleSection("transmission")}
          >
            <h2 className="font-medium text-gray-800">TRANSMISSION</h2>
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${
                expandedSections.transmission ? "rotate-180" : ""
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
              expandedSections.transmission ? "py-2" : "max-h-0 overflow-hidden"
            }`}
          >
            <div className="py-2">
              <div className="flex items-center py-1">
                <input
                  type="checkbox"
                  id="automatic"
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="automatic" className="text-sm">
                  Automatic (2,522)
                </label>
              </div>
              <div className="flex items-center py-1">
                <input type="checkbox" id="manual" className="mr-2 h-4 w-4" />
                <label htmlFor="manual" className="text-sm">
                  Manual (2,496)
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarFilter;
