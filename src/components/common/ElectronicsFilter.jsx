import React, { useState } from "react";
import styles from "@/styles/Home.module.css";
import IMAGES from "@/utils/images.js";

const ElectronicsFilter = ({ isFilterOpen, isMobile }) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    location: true,
    brand: true,
    price: true,
    year: true,
    condition: false,
    warranty: false,
  });

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCondition, setSelectedCondition] = useState(null);

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
            <div className="font-medium text-sm text-green-600 py-1">
              Electronics & Appliances in Chennai
            </div>
            <div className="flex items-center text-sm py-1">
              <div className="w-4 h-4 rounded-full bg-black mr-2"></div>
              <span>Television</span>
            </div>
            <div className="flex items-center text-sm py-1">
              <div className="w-4 h-4 rounded-full bg-black mr-2"></div>
              <span>Computer</span>
            </div>
            <div className="flex items-center text-sm py-1">
              <div className="w-4 h-4 rounded-full bg-black mr-2"></div>
              <span>Washing Machine</span>
            </div>
            <div className="flex items-center text-sm py-1">
              <div className="w-4 h-4 rounded-full bg-black mr-2"></div>
              <span>Refrigerator</span>
            </div>
            <div className="flex items-center text-sm py-1">
              <div className="w-4 h-4 rounded-full bg-black mr-2"></div>
              <span>Air Conditioner</span>
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
                  src={IMAGES.hplogo}
                  alt="HP"
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div className="border rounded-md p-2 flex items-center justify-center">
                <img
                  src={IMAGES.delllogo}
                  alt="Dell"
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div className="border rounded-md p-2 flex items-center justify-center">
                <img
                  src={IMAGES.applelogo}
                  alt="Apple"
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div className="border rounded-md p-2 flex items-center justify-center">
                <img
                  src={IMAGES.lenovalogo}
                  alt="Lenovo"
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div className="border rounded-md p-2 flex items-center justify-center">
                <img
                  src={IMAGES.thinkpadlogo}
                  alt="ThinkPad"
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div className="border rounded-md p-2 flex items-center justify-center">
                <img
                  src={IMAGES.acerlogo}
                  alt="Acer"
                  className="h-10 w-10 object-contain"
                />
              </div>
            </div>

            {/* Select Brand Section */}
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Select Brand</h3>
              <div className="h-40 overflow-y-auto  rounded-md p-2">
                <div className="flex items-center py-1">
                  <input type="checkbox" id="lenovo" className="mr-2 h-4 w-4" />
                  <label htmlFor="lenovo" className="text-sm">
                    Lenovo (3,561)
                  </label>
                </div>
                <div className="flex items-center py-1">
                  <input type="checkbox" id="dell" className="mr-2 h-4 w-4" />
                  <label htmlFor="dell" className="text-sm">
                    Dell (3,002)
                  </label>
                </div>
                <div className="flex items-center py-1">
                  <input type="checkbox" id="asus" className="mr-2 h-4 w-4" />
                  <label htmlFor="asus" className="text-sm">
                    Asus (1,152)
                  </label>
                </div>
                <div className="flex items-center py-1">
                  <input type="checkbox" id="hp" className="mr-2 h-4 w-4" />
                  <label htmlFor="hp" className="text-sm">
                    HP (1,139)
                  </label>
                </div>
                <div className="flex items-center py-1">
                  <input type="checkbox" id="acer" className="mr-2 h-4 w-4" />
                  <label htmlFor="acer" className="text-sm">
                    Acer (982)
                  </label>
                </div>
                <div className="flex items-center py-1">
                  <input type="checkbox" id="msi" className="mr-2 h-4 w-4" />
                  <label htmlFor="msi" className="text-sm">
                    MSI (756)
                  </label>
                </div>
                <div className="flex items-center py-1">
                  <input
                    type="checkbox"
                    id="samsung"
                    className="mr-2 h-4 w-4"
                  />
                  <label htmlFor="samsung" className="text-sm">
                    Samsung (703)
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
                    15-fd0006TU (3,561)
                  </label>
                </div>
                <div className="flex items-center py-1">
                  <input type="checkbox" id="model2" className="mr-2 h-4 w-4" />
                  <label htmlFor="model2" className="text-sm">
                    18-fd0006TZ (3,002)
                  </label>
                </div>
                <div className="flex items-center py-1">
                  <input type="checkbox" id="model3" className="mr-2 h-4 w-4" />
                  <label htmlFor="model3" className="text-sm">
                    15-fd0006TU (1,152)
                  </label>
                </div>
                <div className="flex items-center py-1">
                  <input type="checkbox" id="model4" className="mr-2 h-4 w-4" />
                  <label htmlFor="model4" className="text-sm">
                    15-fd0006TU (1,139)
                  </label>
                </div>
                <div className="flex items-center py-1">
                  <input type="checkbox" id="model5" className="mr-2 h-4 w-4" />
                  <label htmlFor="model5" className="text-sm">
                    ThinkPad X1 (956)
                  </label>
                </div>
                <div className="flex items-center py-1">
                  <input type="checkbox" id="model6" className="mr-2 h-4 w-4" />
                  <label htmlFor="model6" className="text-sm">
                    MacBook Pro (852)
                  </label>
                </div>
                <div className="flex items-center py-1">
                  <input type="checkbox" id="model7" className="mr-2 h-4 w-4" />
                  <label htmlFor="model7" className="text-sm">
                    Inspiron 15 (783)
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
              <div className="border rounded-md p-2 text-sm cursor-pointer hover:border-blue-500">
                Under 3 Years
              </div>
              <div className="border rounded-md p-2 text-sm cursor-pointer hover:border-blue-500">
                Under 5 Years
              </div>
              <div className="border rounded-md p-2 text-sm cursor-pointer hover:border-blue-500">
                Under 7 Years
              </div>
              <div className="border rounded-md p-2 text-sm cursor-pointer hover:border-blue-500">
                More than 3 Years
              </div>
            </div>
          </div>
        </div>

        {/* Condition Section */}
        <div className="mb-4">
          <div
            className="flex justify-between items-center cursor-pointer py-2 border-b"
            onClick={() => toggleSection("condition")}
          >
            <h2 className="font-medium text-gray-800">Condition</h2>
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${
                expandedSections.condition ? "rotate-180" : ""
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
              expandedSections.condition ? "py-2" : "max-h-0 overflow-hidden"
            }`}
          >
            <div className="grid grid-cols-1 gap-2">
              <div
                className={`border rounded-md p-2 text-sm cursor-pointer transition-colors ${
                  selectedCondition === "new"
                    ? "border-blue-500 bg-blue-50"
                    : "hover:border-blue-500"
                }`}
                onClick={() => setSelectedCondition("new")}
              >
                New
              </div>
              <div
                className={`border rounded-md p-2 text-sm cursor-pointer transition-colors ${
                  selectedCondition === "likeNew"
                    ? "border-blue-500 bg-blue-50"
                    : "hover:border-blue-500"
                }`}
                onClick={() => setSelectedCondition("likeNew")}
              >
                Like New
              </div>
              <div
                className={`border rounded-md p-2 text-sm cursor-pointer transition-colors ${
                  selectedCondition === "good"
                    ? "border-blue-500 bg-blue-50"
                    : "hover:border-blue-500"
                }`}
                onClick={() => setSelectedCondition("good")}
              >
                Good
              </div>
              <div
                className={`border rounded-md p-2 text-sm cursor-pointer transition-colors ${
                  selectedCondition === "fair"
                    ? "border-blue-500 bg-blue-50"
                    : "hover:border-blue-500"
                }`}
                onClick={() => setSelectedCondition("fair")}
              >
                Fair
              </div>
            </div>
          </div>
        </div>

        {/* Warranty Section */}
        <div className="mb-4">
          <div
            className="flex justify-between items-center cursor-pointer py-2 border-b"
            onClick={() => toggleSection("warranty")}
          >
            <h2 className="font-medium text-gray-800">Warranty</h2>
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${
                expandedSections.warranty ? "rotate-180" : ""
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
              expandedSections.warranty ? "py-2" : "max-h-0 overflow-hidden"
            }`}
          >
            <div className="py-2">
              <div className="flex items-center py-1">
                <input
                  type="checkbox"
                  id="under-warranty"
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="under-warranty" className="text-sm">
                  Under Warranty
                </label>
              </div>
              <div className="flex items-center py-1">
                <input
                  type="checkbox"
                  id="no-warranty"
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="no-warranty" className="text-sm">
                  No Warranty
                </label>
              </div>
              <div className="flex items-center py-1">
                <input
                  type="checkbox"
                  id="extended-warranty"
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="extended-warranty" className="text-sm">
                  Extended Warranty Available
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectronicsFilter;
