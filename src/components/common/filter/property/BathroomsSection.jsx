// import React, { useState, useEffect } from "react";
// import { api } from "@/api/axios";

// const BathroomsSection = ({ 
//   filters, 
//   setFilters, 
//   expandedSections, 
//   toggleSection 
// }) => {
//   const [bathrooms, setBathrooms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedBathroom, setSelectedBathroom] = useState("");

//   // Load bathrooms from API on component mount
//   useEffect(() => {
//     fetchBathrooms();
//   }, []);

//   // Set initial selected value from filters
//   useEffect(() => {
//     if (filters.bathroom_min) {
//       setSelectedBathroom(filters.bathroom_min);
//     }
//   }, [filters.bathroom_min]);

//   const fetchBathrooms = async () => {
//     setLoading(true);
//     try {
//       const response = await api.get('/property/getbathrooms');
//       console.log("Bathrooms response:", response.data);
      
//       if (response.data && Array.isArray(response.data)) {
//         setBathrooms(response.data);
//       } else {
//         console.error("Invalid bathrooms response format");
//         setBathrooms([]);
//       }
//     } catch (error) {
//       console.error("Error fetching bathrooms:", error);
//       setBathrooms([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBathroomSelect = (bathroom) => {
//     const newValue = selectedBathroom === bathroom.value ? "" : bathroom.value;
    
//     setSelectedBathroom(newValue);
    
//     // Update filters
//     setFilters(prev => ({
//       ...prev,
//       bathroom_min: newValue
//     }));

//     console.log("Selected bathroom:", {
//       label: bathroom.label,
//       value: newValue,
//       count: bathroom.count
//     });
//   };

//   const formatLabel = (bathroom) => {
//     // Format the label to show count if available
//     if (bathroom.count) {
//       return bathroom.label; // Label already includes count like "1+ Bathroom (5)"
//     }
//     return bathroom.label || `${bathroom.value}+ Bathrooms`;
//   };

//   if (loading) {
//     return (
//       <div className="mb-4">
//         <h2 className="font-medium text-gray-800 py-2 border-b">
//           Bathrooms
//         </h2>
//         <div className="py-4 text-center">
//           <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="text-sm text-gray-500 mt-2">Loading bathrooms...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="mb-4">
//       <div
//         className="flex justify-between items-center cursor-pointer py-2 border-b"
//         onClick={() => toggleSection && toggleSection("bathrooms")}
//       >
//         <h2 className="font-medium text-gray-800">
//           Bathrooms
//           {selectedBathroom && (
//             <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
//               {selectedBathroom}+
//             </span>
//           )}
//         </h2>
//         {toggleSection && (
//           <svg
//             className={`w-5 h-5 transition-transform duration-300 ${
//               expandedSections?.bathrooms ? "rotate-180" : ""
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
//           !toggleSection || expandedSections?.bathrooms 
//             ? "max-h-96 py-2" 
//             : "max-h-0"
//         }`}
//       >
//         {bathrooms.length > 0 ? (
//           <div className="grid grid-cols-1 gap-2 py-2">
//             {bathrooms.map((bathroom, index) => (
//               <div
//                 key={bathroom.value || index}
//                 className={`border rounded-md p-2 text-left text-sm cursor-pointer transition-all duration-200 flex justify-between items-center ${
//                   selectedBathroom === bathroom.value
//                     ? "border-green-500 bg-green-50"
//                     : "hover:border-green-500 hover:bg-green-25"
//                 }`}
//                 onClick={() => handleBathroomSelect(bathroom)}
//               >
//                 <div className="flex items-center">
//                   {selectedBathroom === bathroom.value && (
//                     <svg
//                       className="w-4 h-4 mr-2 text-green-600"
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
//                     {formatLabel(bathroom)}
//                   </span>
//                 </div>
                
//                 {/* Bathroom icon */}
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
//                     d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M13 7a4 4 0 11-8 0 4 4 0 018 0zM13 7V3a2 2 0 012 2v2M11 7V3a2 2 0 00-2 2v2"
//                   />
//                 </svg>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-4">
//             <p className="text-gray-500 text-sm">No bathroom options available</p>
//             <button
//               onClick={fetchBathrooms}
//               className="mt-2 text-blue-600 text-sm hover:underline"
//             >
//               Retry
//             </button>
//           </div>
//         )}

//         {/* Clear Selection Button */}
//         {selectedBathroom && (
//           <div className="mt-3 pt-2 border-t">
//             <button
//               onClick={() => handleBathroomSelect({ value: "", label: "" })}
//               className="w-full text-sm text-red-600 hover:text-red-800 py-2 hover:bg-red-50 rounded transition-colors"
//             >
//               Clear Bathroom Selection
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BathroomsSection;



import React, { useState, useEffect } from "react";
import { api } from "@/api/axios";

const BathroomsSection = ({ 
  filters, 
  setFilters, 
  expandedSections, 
  toggleSection 
}) => {
  const [bathrooms, setBathrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBathrooms, setSelectedBathrooms] = useState([]); // Array for multi-select

  // Load bathrooms from API on component mount
  useEffect(() => {
    fetchBathrooms();
  }, []);

  // Set initial selected values from filters
  useEffect(() => {
    if (filters.bathroom_min) {
      // Handle both single value and array
      const filterValues = Array.isArray(filters.bathroom_min) 
        ? filters.bathroom_min 
        : [filters.bathroom_min];
      
      const numericValues = filterValues.map(val => Number(val)).filter(val => !isNaN(val));
      setSelectedBathrooms(numericValues);
    } else {
      setSelectedBathrooms([]);
    }
  }, [filters.bathroom_min]);

  const fetchBathrooms = async () => {
    setLoading(true);
    try {
      const response = await api.get('/property/getbathrooms');
      console.log("Bathrooms response:", response.data);
      
      if (response.data && Array.isArray(response.data)) {
        setBathrooms(response.data);
      } else {
        console.error("Invalid bathrooms response format");
        setBathrooms([]);
      }
    } catch (error) {
      console.error("Error fetching bathrooms:", error);
      setBathrooms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBathroomSelect = (bathroom) => {
    const isCurrentlySelected = selectedBathrooms.includes(bathroom.value);
    let newSelectedBathrooms;
    
    if (isCurrentlySelected) {
      // Remove from selection
      newSelectedBathrooms = selectedBathrooms.filter(val => val !== bathroom.value);
    } else {
      // Add to selection
      newSelectedBathrooms = [...selectedBathrooms, bathroom.value];
    }
    
    console.log("Bathroom multi-selection:", {
      currentSelected: selectedBathrooms,
      bathroomValue: bathroom.value,
      isCurrentlySelected,
      newSelection: newSelectedBathrooms
    });
    
    setSelectedBathrooms(newSelectedBathrooms);
    
    // Update filters - send array or single value based on API requirements
    const filterValue = newSelectedBathrooms.length === 0 
      ? "" 
      : newSelectedBathrooms.length === 1 
        ? newSelectedBathrooms[0] // Single value for single selection
        : newSelectedBathrooms; // Array for multiple selections
    
    setFilters(prev => ({
      ...prev,
      bathroom_min: filterValue
    }));

    console.log("Selected bathrooms:", {
      selected: newSelectedBathrooms,
      filterValue: filterValue,
      count: newSelectedBathrooms.length
    });
  };

  const clearAllSelections = () => {
    setSelectedBathrooms([]);
    setFilters(prev => ({
      ...prev,
      bathroom_min: ""
    }));
  };

  const formatLabel = (bathroom) => {
    if (bathroom.count) {
      return bathroom.label;
    }
    return bathroom.label || `${bathroom.value}+ Bathrooms`;
  };

  const getSelectedSummary = () => {
    if (selectedBathrooms.length === 0) return "";
    if (selectedBathrooms.length === 1) return `${selectedBathrooms[0]}+`;
    
    const sortedValues = [...selectedBathrooms].sort((a, b) => a - b);
    return `${sortedValues.join(', ')}+`;
  };

  if (loading) {
    return (
      <div className="mb-4">
        <h2 className="font-medium text-gray-800 py-2 border-b">
          Bathrooms
        </h2>
        <div className="py-4 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Loading bathrooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div
        className="flex justify-between items-center cursor-pointer py-2 border-b"
        onClick={() => toggleSection && toggleSection("bathrooms")}
      >
        <h2 className="font-medium text-gray-800">
          Bathrooms
          {selectedBathrooms.length > 0 && (
            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              {selectedBathrooms.length} selected
            </span>
          )}
        </h2>
        {toggleSection && (
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${
              expandedSections?.bathrooms ? "rotate-180" : ""
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
          !toggleSection || expandedSections?.bathrooms 
            ? "max-h-96 py-2" 
            : "max-h-0"
        }`}
      >
        {/* Selection Summary */}
        {selectedBathrooms.length > 0 && (
          <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded text-sm">
            <div className="flex justify-between items-center">
              <span className="text-green-800">
                Selected: {getSelectedSummary()} Bathrooms
              </span>
              <button
                onClick={clearAllSelections}
                className="text-green-600 hover:text-green-800 text-xs underline"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {bathrooms.length > 0 ? (
          <div className="grid grid-cols-1 gap-2 py-2">
            {bathrooms.map((bathroom, index) => {
              const isSelected = selectedBathrooms.includes(bathroom.value);
              
              return (
                <div
                  key={bathroom.value || index}
                  className={`border rounded-md p-3 text-left text-sm cursor-pointer transition-all duration-200 flex justify-between items-center ${
                    isSelected
                      ? "border-green-500 bg-green-50 shadow-sm"
                      : "hover:border-green-400 hover:bg-green-25"
                  }`}
                  onClick={() => handleBathroomSelect(bathroom)}
                >
                  <div className="flex items-center">
                    {/* Checkbox style indicator */}
                    <div className={`w-4 h-4 mr-3 border-2 rounded flex items-center justify-center ${
                      isSelected 
                        ? "border-green-500 bg-green-500" 
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
                    <span className={`font-medium ${isSelected ? 'text-green-800' : ''}`}>
                      {formatLabel(bathroom)}
                    </span>
                  </div>
                  
                  {/* Bathroom icon */}
                  <svg 
                    className={`w-4 h-4 ${isSelected ? 'text-green-600' : 'text-gray-400'}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M13 7a4 4 0 11-8 0 4 4 0 018 0zM13 7V3a2 2 0 012 2v2M11 7V3a2 2 0 00-2 2v2"
                    />
                  </svg>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm">No bathroom options available</p>
            <button
              onClick={fetchBathrooms}
              className="mt-2 text-blue-600 text-sm hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Action Buttons */}
        {selectedBathrooms.length > 0 && (
          <div className="mt-3 pt-2 border-t space-y-2">
            <div className="flex gap-2">
              <button
                onClick={clearAllSelections}
                className="flex-1 text-sm text-red-600 hover:text-red-800 py-2 hover:bg-red-50 rounded transition-colors border border-red-200"
              >
                Clear All ({selectedBathrooms.length})
              </button>
              <button
                onClick={() => {
                  // Select all bathrooms
                  const allValues = bathrooms.map(b => b.value);
                  setSelectedBathrooms(allValues);
                  setFilters(prev => ({
                    ...prev,
                    bathroom_min: allValues.length === 1 ? allValues[0] : allValues
                  }));
                }}
                className="flex-1 text-sm text-green-600 hover:text-green-800 py-2 hover:bg-green-50 rounded transition-colors border border-green-200"
                disabled={selectedBathrooms.length === bathrooms.length}
              >
                Select All
              </button>
            </div>
          </div>
        )}

        {/* Debug info - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
            <div>Selected Array: [{selectedBathrooms.join(', ')}]</div>
            <div>Filter Value: {JSON.stringify(filters.bathroom_min)}</div>
            <div>Count: {selectedBathrooms.length}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BathroomsSection;