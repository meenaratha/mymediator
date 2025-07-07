// import React, { useState, useEffect } from "react";
// import { api } from "@/api/axios";

// const BedroomsSection = ({ 
//   filters, 
//   setFilters, 
//   expandedSections, 
//   toggleSection 
// }) => {
//   const [bedrooms, setBedrooms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedBedroom, setSelectedBedroom] = useState("");

//   // Load bedrooms from API on component mount
//   useEffect(() => {
//     fetchBedrooms();
//   }, []);

//   // Set initial selected value from filters
//   useEffect(() => {
//     if (filters.bedroom_min) {
//       setSelectedBedroom(filters.bedroom_min);
//     }
//   }, [filters.bedroom_min]);

//   const fetchBedrooms = async () => {
//     setLoading(true);
//     try {
//       const response = await api.get('/property/getbedrooms');
//       console.log("Bedrooms response:", response.data);
      
//       if (response.data && Array.isArray(response.data)) {
//         setBedrooms(response.data);
//       } else {
//         console.error("Invalid bedrooms response format");
//         setBedrooms([]);
//       }
//     } catch (error) {
//       console.error("Error fetching bedrooms:", error);
//       setBedrooms([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBedroomSelect = (bedroom) => {
//     const newValue = selectedBedroom === bedroom.value ? "" : bedroom.value;
    
//     setSelectedBedroom(newValue);
    
//     // Update filters
//     setFilters(prev => ({
//       ...prev,
//       bedroom_min: newValue
//     }));

//     console.log("Selected bedroom:", {
//       label: bedroom.label,
//       value: newValue,
//       count: bedroom.count
//     });
//   };

//   const formatLabel = (bedroom) => {
//     // Format the label to show count if available
//     if (bedroom.count) {
//       return bedroom.label; // Label already includes count like "1+ Bedrooms (7)"
//     }
//     return bedroom.label || `${bedroom.value}+ Bedrooms`;
//   };

//   if (loading) {
//     return (
//       <div className="mb-4">
//         <h2 className="font-medium text-gray-800 py-2 border-b">
//           Bedrooms
//         </h2>
//         <div className="py-4 text-center">
//           <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="text-sm text-gray-500 mt-2">Loading bedrooms...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="mb-4">
//       <div
//         className="flex justify-between items-center cursor-pointer py-2 border-b"
//         onClick={() => toggleSection && toggleSection("bedrooms")}
//       >
//         <h2 className="font-medium text-gray-800">
//           Bedrooms
//           {selectedBedroom && (
//             <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
//               {selectedBedroom}+
//             </span>
//           )}
//         </h2>
//         {toggleSection && (
//           <svg
//             className={`w-5 h-5 transition-transform duration-300 ${
//               expandedSections?.bedrooms ? "rotate-180" : ""
//             }`}
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M19 9l-7 7-7-7"
//             />
//           </svg>
//         )}
//       </div>

//       <div
//         className={`transition-all duration-300 ease-in-out overflow-hidden ${
//           !toggleSection || expandedSections?.bedrooms 
//             ? "max-h-96 py-2" 
//             : "max-h-0"
//         }`}
//       >
//         {bedrooms.length > 0 ? (
//           <div className="grid grid-cols-1 gap-2 py-2">
//             {bedrooms.map((bedroom, index) => (
//               <div
//                 key={bedroom.value || index}
//                 className={`border rounded-md p-2 text-left text-sm cursor-pointer transition-all duration-200 flex justify-between items-center ${
//                   selectedBedroom === bedroom.value
//                     ? "border-blue-500 bg-blue-50"
//                     : "hover:border-blue-500 hover:bg-blue-25"
//                 }`}
//                 onClick={() => handleBedroomSelect(bedroom)}
//               >
//                 <div className="flex items-center">
//                   {selectedBedroom === bedroom.value && (
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
//                   <span className="font-medium">
//                     {formatLabel(bedroom)}
//                   </span>
//                 </div>
                
//                 {/* Bedroom icon */}
//                 <svg 
//                   className="w-4 h-4 text-gray-400" 
//                   fill="none" 
//                   stroke="currentColor" 
//                   viewBox="0 0 24 24"
//                 >
//                   <path 
//                     strokeLinecap="round" 
//                     strokeLinejoin="round" 
//                     strokeWidth="2" 
//                     d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
//                   />
//                 </svg>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-4">
//             <p className="text-gray-500 text-sm">No bedroom options available</p>
//             <button
//               onClick={fetchBedrooms}
//               className="mt-2 text-blue-600 text-sm hover:underline"
//             >
//               Retry
//             </button>
//           </div>
//         )}

//         {/* Clear Selection Button */}
//         {selectedBedroom && (
//           <div className="mt-3 pt-2 border-t">
//             <button
//               onClick={() => handleBedroomSelect({ value: "", label: "" })}
//               className="w-full text-sm text-red-600 hover:text-red-800 py-2 hover:bg-red-50 rounded transition-colors"
//             >
//               Clear Bedroom Selection
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BedroomsSection;




import React, { useState, useEffect } from "react";
import { api } from "@/api/axios";

const BedroomsSection = ({ 
  filters, 
  setFilters, 
  expandedSections, 
  toggleSection 
}) => {
  const [bedrooms, setBedrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBedrooms, setSelectedBedrooms] = useState([]); // Array for multi-select

  // Load bedrooms from API on component mount
  useEffect(() => {
    fetchBedrooms();
  }, []);

  // Set initial selected values from filters
  useEffect(() => {
    if (filters.bedroom_min) {
      // Handle both single value and array
      const filterValues = Array.isArray(filters.bedroom_min) 
        ? filters.bedroom_min 
        : [filters.bedroom_min];
      
      const numericValues = filterValues.map(val => Number(val)).filter(val => !isNaN(val));
      setSelectedBedrooms(numericValues);
    } else {
      setSelectedBedrooms([]);
    }
  }, [filters.bedroom_min]);

  const fetchBedrooms = async () => {
    setLoading(true);
    try {
      const response = await api.get('/property/getbedrooms');
      console.log("Bedrooms response:", response.data);
      
      if (response.data && Array.isArray(response.data)) {
        setBedrooms(response.data);
      } else {
        console.error("Invalid bedrooms response format");
        setBedrooms([]);
      }
    } catch (error) {
      console.error("Error fetching bedrooms:", error);
      setBedrooms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBedroomSelect = (bedroom) => {
    const isCurrentlySelected = selectedBedrooms.includes(bedroom.value);
    let newSelectedBedrooms;
    
    if (isCurrentlySelected) {
      // Remove from selection
      newSelectedBedrooms = selectedBedrooms.filter(val => val !== bedroom.value);
    } else {
      // Add to selection
      newSelectedBedrooms = [...selectedBedrooms, bedroom.value];
    }
    
    console.log("Bedroom multi-selection:", {
      currentSelected: selectedBedrooms,
      bedroomValue: bedroom.value,
      isCurrentlySelected,
      newSelection: newSelectedBedrooms
    });
    
    setSelectedBedrooms(newSelectedBedrooms);
    
    // Update filters - send array or single value based on API requirements
    const filterValue = newSelectedBedrooms.length === 0 
      ? "" 
      : newSelectedBedrooms.length === 1 
        ? newSelectedBedrooms[0] // Single value for single selection
        : newSelectedBedrooms; // Array for multiple selections
    
    setFilters(prev => ({
      ...prev,
      bedroom_min: filterValue
    }));

    console.log("Selected bedrooms:", {
      selected: newSelectedBedrooms,
      filterValue: filterValue,
      count: newSelectedBedrooms.length
    });
  };

  const clearAllSelections = () => {
    setSelectedBedrooms([]);
    setFilters(prev => ({
      ...prev,
      bedroom_min: ""
    }));
  };

  const formatLabel = (bedroom) => {
    if (bedroom.count) {
      return bedroom.label;
    }
    return bedroom.label || `${bedroom.value}+ Bedrooms`;
  };

  const getSelectedSummary = () => {
    if (selectedBedrooms.length === 0) return "";
    if (selectedBedrooms.length === 1) return `${selectedBedrooms[0]}+`;
    
    const sortedValues = [...selectedBedrooms].sort((a, b) => a - b);
    return `${sortedValues.join(', ')}+`;
  };

  if (loading) {
    return (
      <div className="mb-4">
        <h2 className="font-medium text-gray-800 py-2 border-b">
          Bedrooms
        </h2>
        <div className="py-4 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Loading bedrooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div
        className="flex justify-between items-center cursor-pointer py-2 border-b"
        onClick={() => toggleSection && toggleSection("bedrooms")}
      >
        <h2 className="font-medium text-gray-800">
          Bedrooms
          {selectedBedrooms.length > 0 && (
            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {selectedBedrooms.length} selected
            </span>
          )}
        </h2>
        {toggleSection && (
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${
              expandedSections?.bedrooms ? "rotate-180" : ""
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
        )}
      </div>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          !toggleSection || expandedSections?.bedrooms 
            ? "max-h-96 py-2" 
            : "max-h-0"
        }`}
      >
        {/* Selection Summary */}
        {selectedBedrooms.length > 0 && (
          <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
            <div className="flex justify-between items-center">
              <span className="text-blue-800">
                Selected: {getSelectedSummary()} Bedrooms
              </span>
              <button
                onClick={clearAllSelections}
                className="text-blue-600 hover:text-blue-800 text-xs underline"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {bedrooms.length > 0 ? (
          <div className="grid grid-cols-1 gap-2 py-2">
            {bedrooms.map((bedroom, index) => {
              const isSelected = selectedBedrooms.includes(bedroom.value);
              
              return (
                <div
                  key={bedroom.value || index}
                  className={`border rounded-md p-3 text-left text-sm cursor-pointer transition-all duration-200 flex justify-between items-center ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "hover:border-blue-400 hover:bg-blue-25"
                  }`}
                  onClick={() => handleBedroomSelect(bedroom)}
                >
                  <div className="flex items-center">
                    {/* Checkbox style indicator */}
                    <div className={`w-4 h-4 mr-3 border-2 rounded flex items-center justify-center ${
                      isSelected 
                        ? "border-blue-500 bg-blue-500" 
                        : "border-gray-300"
                    }`}>
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
                    <span className={`font-medium ${isSelected ? 'text-blue-800' : ''}`}>
                      {formatLabel(bedroom)}
                    </span>
                  </div>
                  
                  {/* Bedroom icon */}
                  <svg 
                    className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm">No bedroom options available</p>
            <button
              onClick={fetchBedrooms}
              className="mt-2 text-blue-600 text-sm hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Action Buttons */}
        {selectedBedrooms.length > 0 && (
          <div className="mt-3 pt-2 border-t space-y-2">
            <div className="flex gap-2">
              <button
                onClick={clearAllSelections}
                className="flex-1 text-sm text-red-600 hover:text-red-800 py-2 hover:bg-red-50 rounded transition-colors border border-red-200"
              >
                Clear All ({selectedBedrooms.length})
              </button>
              <button
                onClick={() => {
                  // Select all bedrooms
                  const allValues = bedrooms.map(b => b.value);
                  setSelectedBedrooms(allValues);
                  setFilters(prev => ({
                    ...prev,
                    bedroom_min: allValues.length === 1 ? allValues[0] : allValues
                  }));
                }}
                className="flex-1 text-sm text-blue-600 hover:text-blue-800 py-2 hover:bg-blue-50 rounded transition-colors border border-blue-200"
                disabled={selectedBedrooms.length === bedrooms.length}
              >
                Select All
              </button>
            </div>
          </div>
        )}

        {/* Debug info - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
            <div>Selected Array: [{selectedBedrooms.join(', ')}]</div>
            <div>Filter Value: {JSON.stringify(filters.bedroom_min)}</div>
            <div>Count: {selectedBedrooms.length}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BedroomsSection;