import React, { useState, useEffect } from "react";
import { api } from "@/api/axios";

const BuildingDirectionSection = ({ 
  filters, 
  setFilters, 
  expandedSections, 
  toggleSection 
}) => {
  const [buildingDirections, setBuildingDirections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDirections, setSelectedDirections] = useState([]);

  // Load building directions from API on component mount
  useEffect(() => {
    fetchBuildingDirections();
  }, []);

  // Set initial selected values from filters
  useEffect(() => {
    if (filters.building_direction_id) {
      // Handle both single value and array
      const filterValues = Array.isArray(filters.building_direction_id) 
        ? filters.building_direction_id 
        : [filters.building_direction_id];
      
      const numericValues = filterValues.map(val => Number(val)).filter(val => !isNaN(val));
      setSelectedDirections(numericValues);
      console.log("Setting initial building direction selection:", numericValues);
    } else {
      setSelectedDirections([]);
    }
  }, [filters.building_direction_id]);

  const fetchBuildingDirections = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("🔄 Fetching building directions from /building-directions...");
      const response = await api.get('/building-directions');
      
      console.log("📥 Raw building directions response:", response);
      console.log("📦 Response data:", response.data);
      
      if (!response.data) {
        throw new Error("No data received from API");
      }
      
      let directionsData = response.data;
      
      // Handle different response formats
      if (response.data.data && Array.isArray(response.data.data)) {
        directionsData = response.data.data;
        console.log("📋 Using nested data property:", directionsData);
      } else if (!Array.isArray(response.data)) {
        throw new Error("Response data is not an array");
      }
      
      console.log("📝 Building directions data to process:", directionsData);
      console.log("📏 Number of building directions:", directionsData.length);
      
      // Filter only active building directions
      const activeDirections = directionsData.filter(direction => {
        console.log(`🔍 Checking direction:`, direction);
        console.log(`   - ID: ${direction.id}, Name: ${direction.name}, Active: ${direction.active}`);
        return direction.active === 1 || direction.active === "1" || direction.active === true;
      });
      
      console.log("✅ Active building directions:", activeDirections);
      console.log("📊 Active count:", activeDirections.length);
      
      setBuildingDirections(activeDirections);
      
      if (activeDirections.length === 0) {
        console.warn("⚠️ No active building directions found");
        setError("No active building directions available");
      }
      
    } catch (error) {
      console.error("❌ Error fetching building directions:", error);
      console.error("❌ Error details:", {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      
      setError(error.message || "Failed to load building directions");
      setBuildingDirections([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDirectionSelect = (direction) => {
    const isCurrentlySelected = selectedDirections.includes(direction.id);
    let newSelectedDirections;
    
    if (isCurrentlySelected) {
      // Remove from selection
      newSelectedDirections = selectedDirections.filter(val => val !== direction.id);
    } else {
      // Add to selection
      newSelectedDirections = [...selectedDirections, direction.id];
    }
    
    console.log("🧭 Building direction selection change:", {
      currentSelected: selectedDirections,
      directionId: direction.id,
      directionName: direction.name,
      isCurrentlySelected,
      newSelection: newSelectedDirections
    });
    
    setSelectedDirections(newSelectedDirections);
    
    // Update filters - send array or single value based on API requirements
    const filterValue = newSelectedDirections.length === 0 
      ? "" 
      : newSelectedDirections.length === 1 
        ? newSelectedDirections[0] // Single value for single selection
        : newSelectedDirections; // Array for multiple selections
    
    setFilters(prev => ({
      ...prev,
      building_direction_id: filterValue
    }));

    console.log("🔄 Updated building direction filter:", {
      selected: newSelectedDirections,
      filterValue: filterValue,
      count: newSelectedDirections.length
    });
  };

  const clearAllSelections = () => {
    console.log("🧹 Clearing all building direction selections");
    setSelectedDirections([]);
    setFilters(prev => ({
      ...prev,
      building_direction_id: ""
    }));
  };

  const getSelectedSummary = () => {
    if (selectedDirections.length === 0) return "";
    
    const selectedNames = selectedDirections.map(id => {
      const direction = buildingDirections.find(d => d.id === id);
      return direction?.name || `ID ${id}`;
    });
    
    if (selectedNames.length === 1) return selectedNames[0];
    return `${selectedNames.length} directions`;
  };

  const getDirectionIcon = (directionName) => {
    const name = directionName.toLowerCase();
    
    if (name.includes('east')) {
      // East icon (arrow pointing right)
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      );
    } else if (name.includes('west')) {
      // West icon (arrow pointing left)
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
        </svg>
      );
    } else if (name.includes('north')) {
      // North icon (arrow pointing up)
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7l4-4m0 0l4 4m-4-4v18" />
        </svg>
      );
    } else if (name.includes('south')) {
      // South icon (arrow pointing down)
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 17l-4 4m0 0l-4-4m4 4V3" />
        </svg>
      );
    } else if (name.includes('northeast') || name.includes('ne')) {
      // Northeast icon (diagonal arrow)
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7H7M17 7v10" />
        </svg>
      );
    } else if (name.includes('northwest') || name.includes('nw')) {
      // Northwest icon (diagonal arrow)
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17L7 7M7 7h10M7 7v10" />
        </svg>
      );
    } else if (name.includes('southeast') || name.includes('se')) {
      // Southeast icon (diagonal arrow)
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7l10 10M17 17V7M17 17H7" />
        </svg>
      );
    } else if (name.includes('southwest') || name.includes('sw')) {
      // Southwest icon (diagonal arrow)
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 7L7 17M7 17h10M7 17V7" />
        </svg>
      );
    }
    
    // Default compass icon
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="mb-4">
        <h2 className="font-medium text-gray-800 py-2 border-b">
          Building Direction
        </h2>
        <div className="py-4 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Loading building directions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4">
        <h2 className="font-medium text-gray-800 py-2 border-b">
          Building Direction
        </h2>
        <div className="py-4 text-center">
          <div className="text-red-500 text-sm mb-2">⚠️ {error}</div>
          <button
            onClick={fetchBuildingDirections}
            className="text-blue-600 text-sm hover:underline"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div
        className="flex justify-between items-center cursor-pointer py-2 border-b"
        onClick={() => toggleSection && toggleSection("buildingDirection")}
      >
        <h2 className="font-medium text-gray-800">
          Building Direction
          {selectedDirections.length > 0 && (
            <span className="ml-2 text-xs bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full">
              {selectedDirections.length} selected
            </span>
          )}
        </h2>
        {toggleSection && (
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${
              expandedSections?.buildingDirection ? "rotate-180" : ""
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
          !toggleSection || expandedSections?.buildingDirection 
            ? "max-h-96 py-2" 
            : "max-h-0"
        }`}
      >
        {/* Selection Summary */}
        {selectedDirections.length > 0 && (
          <div className="mb-3 p-2 bg-cyan-50 border border-cyan-200 rounded text-sm">
            <div className="flex justify-between items-center">
              <span className="text-cyan-800">
                Selected: {getSelectedSummary()}
              </span>
              <button
                onClick={clearAllSelections}
                className="text-cyan-600 hover:text-cyan-800 text-xs underline"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {buildingDirections.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 py-2">
            {buildingDirections.map((direction) => {
              const isSelected = selectedDirections.includes(direction.id);
              
              return (
                <div
                  key={direction.id}
                  className={`flex items-center justify-center p-3 rounded-md cursor-pointer transition-all duration-200 border-2 ${
                    isSelected
                      ? "border-cyan-500 bg-cyan-50 shadow-sm"
                      : "border-gray-200 hover:border-cyan-300 hover:bg-cyan-25"
                  }`}
                  onClick={() => handleDirectionSelect(direction)}
                >
                  <div className="flex flex-col items-center space-y-2">
                    {/* Direction icon */}
                    <div className={`${isSelected ? 'text-cyan-600' : 'text-gray-400'}`}>
                      {getDirectionIcon(direction.name)}
                    </div>
                    
                    {/* Direction name */}
                    <span className={`text-xs font-medium text-center ${
                      isSelected ? 'text-cyan-800' : 'text-gray-700'
                    }`}>
                      {direction.name}
                    </span>
                    
                    {/* Checkbox indicator */}
                    <div className={`w-3 h-3 border rounded-full flex items-center justify-center ${
                      isSelected 
                        ? "border-cyan-500 bg-cyan-500" 
                        : "border-gray-300"
                    }`}>
                      {isSelected && (
                        <svg
                          className="w-2 h-2 text-white"
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
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm">No building directions available</p>
            <p className="text-gray-400 text-xs mt-1">Check console for details</p>
            <button
              onClick={fetchBuildingDirections}
              className="mt-2 text-blue-600 text-sm hover:underline"
            >
              Retry Loading
            </button>
          </div>
        )}

        {/* Action Buttons */}
        {selectedDirections.length > 0 && (
          <div className="mt-3 pt-2 border-t space-y-2">
            <div className="flex gap-2">
              <button
                onClick={clearAllSelections}
                className="flex-1 text-sm text-red-600 hover:text-red-800 py-2 hover:bg-red-50 rounded transition-colors border border-red-200"
              >
                Clear All ({selectedDirections.length})
              </button>
              <button
                onClick={() => {
                  // Select all building directions
                  const allIds = buildingDirections.map(d => d.id);
                  setSelectedDirections(allIds);
                  setFilters(prev => ({
                    ...prev,
                    building_direction_id: allIds.length === 1 ? allIds[0] : allIds
                  }));
                }}
                className="flex-1 text-sm text-cyan-600 hover:text-cyan-800 py-2 hover:bg-cyan-50 rounded transition-colors border border-cyan-200"
                disabled={selectedDirections.length === buildingDirections.length}
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

export default BuildingDirectionSection;