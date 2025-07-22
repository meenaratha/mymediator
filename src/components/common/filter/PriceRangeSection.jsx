// import React, { useState, useEffect } from "react";
// import { api } from "@/api/axios";

// const PriceRangeSection = ({ 
//   filters, 
//   setFilters, 
//   expandedSections, 
//   toggleSection 
// }) => {
//   const [priceRanges, setPriceRanges] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedPriceRange, setSelectedPriceRange] = useState("");

//   // Load price ranges from API on component mount
//   useEffect(() => {
//     fetchPriceRanges();
//   }, []);

//   // Set initial selected value from filters
//   useEffect(() => {
//     if (filters.price_range) {
//       setSelectedPriceRange(filters.price_range);
//     }
//   }, [filters.price_range]);

//   const fetchPriceRanges = async () => {
//     setLoading(true);
//     try {
//       const response = await api.get('/property/getprice/range');
//       console.log("Price ranges response:", response.data);
      
//       if (response.data && Array.isArray(response.data)) {
//         setPriceRanges(response.data);
//       } else {
//         console.error("Invalid price ranges response format");
//         setPriceRanges([]);
//       }
//     } catch (error) {
//       console.error("Error fetching price ranges:", error);
//       setPriceRanges([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePriceRangeSelect = (priceRange) => {
//     const newValue = selectedPriceRange === priceRange.value ? "" : priceRange.value;
    
//     setSelectedPriceRange(newValue);
    
//     // Update filters
//     setFilters(prev => ({
//       ...prev,
//       price_range: newValue
//     }));

//     console.log("Selected price range:", {
//       label: priceRange.label,
//       value: newValue,
//       count: priceRange.count
//     });
//   };

//   const formatCount = (count) => {
//     if (count >= 1000) {
//       return `${Math.floor(count / 1000)}k+ items`;
//     }
//     return `${count}+ items`;
//   };

//   if (loading) {
//     return (
//       <div className="mb-4">
//         <div className="flex justify-between items-center cursor-pointer py-2 border-b">
//           <h2 className="font-medium text-gray-800">Price Range</h2>
//         </div>
//         <div className="py-4 text-center">
//           <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="text-sm text-gray-500 mt-2">Loading price ranges...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="mb-4">
//       <div
//         className="flex justify-between items-center cursor-pointer py-2 border-b"
//         onClick={() => toggleSection("priceRange")}
//       >
//         <h2 className="font-medium text-gray-800">
//           Price Range
//           {selectedPriceRange && (
//             <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
//               Selected
//             </span>
//           )}
//         </h2>
//         <svg
//           className={`w-5 h-5 transition-transform duration-300 ${
//             expandedSections.priceRange ? "rotate-180" : ""
//           }`}
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth="2"
//             d="M19 9l-7 7-7-7"
//           />
//         </svg>
//       </div>

//       <div
//         className={`transition-all duration-300 ease-in-out overflow-hidden custom-scrollbar ${
//           expandedSections.priceRange ? "max-h-96 py-2" : "max-h-0"
//         }`}
//       >
//         {priceRanges.length > 0 ? (
//           <div className="grid grid-cols-1 gap-2 mb-2">
//             {priceRanges.map((range, index) => (
//               <div
//                 key={range.value || index}
//                 className={`rounded text-sm p-4 flex justify-between gap-[15px] cursor-pointer transition-all duration-200 hover:bg-blue-50 ${
//                   selectedPriceRange === range.value
//                     ? "bg-blue-100 border-2 border-blue-500"
//                     : "bg-gray-100 hover:bg-gray-200"
//                 }`}
//                 onClick={() => handlePriceRangeSelect(range)}
//               >
//                 <div className="font-medium flex items-center">
//                   {selectedPriceRange === range.value && (
//                     <svg
//                       className="w-4 h-4 mr-2 text-blue-600"
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                   )}
//                   {range.label}
//                 </div>
//                 <div className="text-gray-500 text-xs flex items-center">
//                   {range.count ? formatCount(range.count) : "0 items"}
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-4">
//             <p className="text-gray-500 text-sm">No price ranges available</p>
//             <button
//               onClick={fetchPriceRanges}
//               className="mt-2 text-blue-600 text-sm hover:underline"
//             >
//               Retry
//             </button>
//           </div>
//         )}

//         {/* Clear Selection Button */}
//         {selectedPriceRange && (
//           <div className="mt-3 pt-2 border-t">
//             <button
//               onClick={() => handlePriceRangeSelect({ value: "", label: "" })}
//               className="w-full text-sm text-red-600 hover:text-red-800 py-2 hover:bg-red-50 rounded transition-colors"
//             >
//               Clear Price Selection
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PriceRangeSection;





import React, { useState, useEffect } from "react";
import { api } from "@/api/axios";

const PriceRangeSection = ({ 
  filters, 
  setFilters, 
  expandedSections, 
  toggleSection 
}) => {
  const [priceRanges, setPriceRanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]); // Array for multi-select

  // Load price ranges from API on component mount
  useEffect(() => {
    fetchPriceRanges();
  }, []);

  // Set initial selected values from filters
  useEffect(() => {
    if (filters.price_range) {
      // Handle both single value and array
      const filterValues = Array.isArray(filters.price_range) 
        ? filters.price_range 
        : [filters.price_range];
      
      setSelectedPriceRanges(filterValues.filter(val => val && val !== ""));
    } else {
      setSelectedPriceRanges([]);
    }
  }, [filters.price_range]);

  const fetchPriceRanges = async () => {
    setLoading(true);
    try {
      const response = await api.get('/property/getprice/range');
      console.log("Price ranges response:", response.data);
      
      if (response.data && Array.isArray(response.data)) {
        setPriceRanges(response.data);
      } else {
        console.error("Invalid price ranges response format");
        setPriceRanges([]);
      }
    } catch (error) {
      console.error("Error fetching price ranges:", error);
      setPriceRanges([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceRangeSelect = (priceRange) => {
    const isCurrentlySelected = selectedPriceRanges.includes(priceRange.value);
    let newSelectedPriceRanges;
    
    if (isCurrentlySelected) {
      // Remove from selection
      newSelectedPriceRanges = selectedPriceRanges.filter(val => val !== priceRange.value);
    } else {
      // Add to selection
      newSelectedPriceRanges = [...selectedPriceRanges, priceRange.value];
    }
    
    console.log("Price range multi-selection:", {
      currentSelected: selectedPriceRanges,
      priceRangeValue: priceRange.value,
      isCurrentlySelected,
      newSelection: newSelectedPriceRanges
    });
    
    setSelectedPriceRanges(newSelectedPriceRanges);
    
    // Update filters - send array or single value based on API requirements
    const filterValue = newSelectedPriceRanges.length === 0 
      ? "" 
      : newSelectedPriceRanges.length === 1 
        ? newSelectedPriceRanges[0] // Single value for single selection
        : newSelectedPriceRanges; // Array for multiple selections
    
    setFilters(prev => ({
      ...prev,
      price_range: filterValue
    }));

    console.log("Selected price ranges:", {
      selected: newSelectedPriceRanges,
      filterValue: filterValue,
      count: newSelectedPriceRanges.length
    });
  };

  const clearAllSelections = () => {
    setSelectedPriceRanges([]);
    setFilters(prev => ({
      ...prev,
      price_range: ""
    }));
  };

  const formatCount = (count) => {
    if (count >= 1000) {
      return `${Math.floor(count / 1000)}k+ items`;
    }
    return `${count}+ items`;
  };

  const getSelectedSummary = () => {
    if (selectedPriceRanges.length === 0) return "";
    if (selectedPriceRanges.length === 1) {
      const range = priceRanges.find(r => r.value === selectedPriceRanges[0]);
      return range?.label || selectedPriceRanges[0];
    }
    return `${selectedPriceRanges.length} ranges`;
  };

  if (loading) {
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center cursor-pointer py-2 border-b">
          <h2 className="font-medium text-gray-800">Price Range</h2>
        </div>
        <div className="py-4 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Loading price ranges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div
        className="flex justify-between items-center cursor-pointer py-2 border-b"
        onClick={() => toggleSection("priceRange")}
      >
        <h2 className="font-medium text-gray-800">
          Price Range
          {selectedPriceRanges.length > 0 && (
            <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
              {selectedPriceRanges.length} selected
            </span>
          )}
        </h2>
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${
            expandedSections.priceRange ? "rotate-180" : ""
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
        className={`transition-all duration-300 ease-in-out overflow-y-auto custom-scrollbar ${
          expandedSections.priceRange ? "max-h-96 py-2" : "max-h-0"
        }`}
      >
        {/* Selection Summary */}
        {selectedPriceRanges.length > 0 && (
          <div className="mb-3 p-2 bg-purple-50 border border-purple-200 rounded text-sm">
            <div className="flex justify-between items-center">
              <span className="text-purple-800">
                Selected: {getSelectedSummary()}
              </span>
              <button
                onClick={clearAllSelections}
                className="text-purple-600 hover:text-purple-800 text-xs underline"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {priceRanges.length > 0 ? (
          <div className="grid grid-cols-1 gap-2 mb-2">
            {priceRanges.map((range, index) => {
              const isSelected = selectedPriceRanges.includes(range.value);

              return (
                <div
                  key={range.value || index}
                  className={`rounded text-sm p-4 flex justify-between gap-[15px] cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "bg-purple-100 border-2 border-purple-500 shadow-sm"
                      : "bg-gray-100 hover:bg-purple-50 hover:border-purple-300 border-2 border-transparent"
                  }`}
                  onClick={() => handlePriceRangeSelect(range)}
                >
                  <div className="flex items-center">
                    {/* Checkbox style indicator */}
                    <div
                      className={`w-4 h-4 mr-3 border-2 rounded flex items-center justify-center ${
                        isSelected
                          ? "border-purple-500 bg-purple-500"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <span
                      className={`font-medium ${
                        isSelected ? "text-purple-800" : ""
                      }`}
                    >
                      {range.label}
                    </span>
                  </div>
                  <div
                    className={`text-xs flex items-center ${
                      isSelected ? "text-purple-600" : "text-gray-500"
                    }`}
                  >
                    {range.count ? formatCount(range.count) : "0 items"}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm">No price ranges available</p>
            <button
              onClick={fetchPriceRanges}
              className="mt-2 text-blue-600 text-sm hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Action Buttons */}
        {selectedPriceRanges.length > 0 && (
          <div className="mt-3 pt-2 border-t space-y-2">
            <div className="flex gap-2">
              <button
                onClick={clearAllSelections}
                className="flex-1 text-sm text-red-600 hover:text-red-800 py-2 hover:bg-red-50 rounded transition-colors border border-red-200"
              >
                Clear All ({selectedPriceRanges.length})
              </button>
              <button
                onClick={() => {
                  // Select all price ranges
                  const allValues = priceRanges.map((r) => r.value);
                  setSelectedPriceRanges(allValues);
                  setFilters((prev) => ({
                    ...prev,
                    price_range:
                      allValues.length === 1 ? allValues[0] : allValues,
                  }));
                }}
                className="flex-1 text-sm text-purple-600 hover:text-purple-800 py-2 hover:bg-purple-50 rounded transition-colors border border-purple-200"
                disabled={selectedPriceRanges.length === priceRanges.length}
              >
                Select All
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceRangeSection;