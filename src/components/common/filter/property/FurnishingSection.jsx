import React, { useState, useEffect } from "react";
import { api } from "@/api/axios";

const FurnishingSection = ({ 
  filters, 
  setFilters, 
  expandedSections, 
  toggleSection 
}) => {
  const [furnishingTypes, setFurnishingTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFurnishing, setSelectedFurnishing] = useState([]);

  // Load furnishing types from API on component mount
  useEffect(() => {
    fetchFurnishingTypes();
  }, []);

  // Set initial selected values from filters
  useEffect(() => {
    if (filters.furnished_id) {
      // Handle both single value and array
      const filterValues = Array.isArray(filters.furnished_id) 
        ? filters.furnished_id 
        : [filters.furnished_id];
      
      const numericValues = filterValues.map(val => Number(val)).filter(val => !isNaN(val));
      setSelectedFurnishing(numericValues);
      console.log("Setting initial furnishing selection:", numericValues);
    } else {
      setSelectedFurnishing([]);
    }
  }, [filters.furnished_id]);

  const fetchFurnishingTypes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("🔄 Fetching furnishing types from /furnishing-types...");
      const response = await api.get('/furnishing-types');
      
      console.log("📥 Raw furnishing types response:", response);
      console.log("📦 Response data:", response.data);
      console.log("📊 Response status:", response.status);
      
      // Check if response has data
      if (!response.data) {
        throw new Error("No data received from API");
      }
      
      let furnishingData = response.data;
      
      // Handle different response formats
      if (response.data.data && Array.isArray(response.data.data)) {
        // If data is nested under 'data' property
        furnishingData = response.data.data;
        console.log("📋 Using nested data property:", furnishingData);
      } else if (!Array.isArray(response.data)) {
        throw new Error("Response data is not an array");
      }
      
      console.log("📝 Furnishing data to process:", furnishingData);
      console.log("📏 Number of furnishing types:", furnishingData.length);
      
      // Filter only active furnishing types
      const activeFurnishingTypes = furnishingData.filter(type => {
        console.log(`🔍 Checking type:`, type);
        console.log(`   - ID: ${type.id}, Name: ${type.name}, Active: ${type.active}`);
        return type.active === 1 || type.active === "1" || type.active === true;
      });
      
      console.log("✅ Active furnishing types:", activeFurnishingTypes);
      console.log("📊 Active count:", activeFurnishingTypes.length);
      
      setFurnishingTypes(activeFurnishingTypes);
      
      if (activeFurnishingTypes.length === 0) {
        console.warn("⚠️ No active furnishing types found");
        setError("No active furnishing types available");
      }
      
    } catch (error) {
      console.error("❌ Error fetching furnishing types:", error);
      console.error("❌ Error details:", {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      
      setError(error.message || "Failed to load furnishing types");
      setFurnishingTypes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFurnishingSelect = (furnishing) => {
    const isCurrentlySelected = selectedFurnishing.includes(furnishing.id);
    let newSelectedFurnishing;
    
    if (isCurrentlySelected) {
      // Remove from selection
      newSelectedFurnishing = selectedFurnishing.filter(val => val !== furnishing.id);
    } else {
      // Add to selection
      newSelectedFurnishing = [...selectedFurnishing, furnishing.id];
    }
    
    console.log("🏠 Furnishing selection change:", {
      currentSelected: selectedFurnishing,
      furnishingId: furnishing.id,
      furnishingName: furnishing.name,
      isCurrentlySelected,
      newSelection: newSelectedFurnishing
    });
    
    setSelectedFurnishing(newSelectedFurnishing);
    
    // Update filters - send array or single value based on API requirements
    const filterValue = newSelectedFurnishing.length === 0 
      ? "" 
      : newSelectedFurnishing.length === 1 
        ? newSelectedFurnishing[0] // Single value for single selection
        : newSelectedFurnishing; // Array for multiple selections
    
    setFilters(prev => ({
      ...prev,
      furnished_id: filterValue
    }));

    console.log("🔄 Updated filter state:", {
      selected: newSelectedFurnishing,
      filterValue: filterValue,
      count: newSelectedFurnishing.length
    });
  };

  const clearAllSelections = () => {
    console.log("🧹 Clearing all furnishing selections");
    setSelectedFurnishing([]);
    setFilters(prev => ({
      ...prev,
      furnished_id: ""
    }));
  };

  const getSelectedSummary = () => {
    if (selectedFurnishing.length === 0) return "";
    
    const selectedNames = selectedFurnishing.map(id => {
      const furnishing = furnishingTypes.find(f => f.id === id);
      return furnishing?.name || `ID ${id}`;
    });
    
    if (selectedNames.length === 1) return selectedNames[0];
    return `${selectedNames.length} types`;
  };

  const getFurnishingIcon = (furnishingName) => {
    const name = furnishingName.toLowerCase();
    
    if (name.includes('furnished') && !name.includes('un')) {
      // Furnished icon
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0" />
        </svg>
      );
    } else if (name.includes('unfurnished') || name.includes('un')) {
      // Unfurnished icon
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      );
    } else if (name.includes('semi')) {
      // Semi-furnished icon
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      );
    }
    
    // Default furnishing icon
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="mb-4">
        <h2 className="font-medium text-gray-800 py-2 border-b">
          Furnishing
        </h2>
        <div className="py-4 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Loading furnishing types...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4">
        <h2 className="font-medium text-gray-800 py-2 border-b">
          Furnishing
        </h2>
        <div className="py-4 text-center">
          <div className="text-red-500 text-sm mb-2">⚠️ {error}</div>
          <button
            onClick={fetchFurnishingTypes}
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
        onClick={() => toggleSection && toggleSection("furnishing")}
      >
        <h2 className="font-medium text-gray-800">
          Furnishing
          {selectedFurnishing.length > 0 && (
            <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
              {selectedFurnishing.length} selected
            </span>
          )}
        </h2>
        {toggleSection && (
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${
              expandedSections?.furnishing ? "rotate-180" : ""
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
        className={`transition-all duration-300 ease-in-out overflow-hidden custom-scrollbar ${
          !toggleSection || expandedSections?.furnishing 
            ? "max-h-96 py-2" 
            : "max-h-0"
        }`}
      >
        {/* Selection Summary */}
        {selectedFurnishing.length > 0 && (
          <div className="mb-3 p-2 bg-orange-50 border border-orange-200 rounded text-sm">
            <div className="flex justify-between items-center">
              <span className="text-orange-800">
                Selected: {getSelectedSummary()}
              </span>
              <button
                onClick={clearAllSelections}
                className="text-orange-600 hover:text-orange-800 text-xs underline"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {furnishingTypes.length > 0 ? (
          <div className="grid grid-cols-1 gap-2">
            {furnishingTypes.map((furnishing) => {
              const isSelected = selectedFurnishing.includes(furnishing.id);
              
              return (
                <div
                  key={furnishing.id}
                  className={`border rounded-md p-3 text-left text-sm cursor-pointer transition-all duration-200 flex justify-between items-center ${
                    isSelected
                      ? "border-orange-500 bg-orange-50 shadow-sm"
                      : "hover:border-orange-400 hover:bg-orange-25"
                  }`}
                  onClick={() => handleFurnishingSelect(furnishing)}
                >
                  <div className="flex items-center">
                    {/* Checkbox style indicator */}
                    <div className={`w-4 h-4 mr-3 border-2 rounded flex items-center justify-center ${
                      isSelected 
                        ? "border-orange-500 bg-orange-500" 
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
                    <span className={`font-medium ${isSelected ? 'text-orange-800' : ''}`}>
                      {furnishing.name}
                    </span>
                  </div>
                  
                  {/* Furnishing type icon */}
                  <div className={`${isSelected ? 'text-orange-600' : 'text-gray-400'}`}>
                    {getFurnishingIcon(furnishing.name)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm">No furnishing types available</p>
            <p className="text-gray-400 text-xs mt-1">Check console for details</p>
            <button
              onClick={fetchFurnishingTypes}
              className="mt-2 text-blue-600 text-sm hover:underline"
            >
              Retry Loading
            </button>
          </div>
        )}

        {/* Action Buttons */}
        {selectedFurnishing.length > 0 && (
          <div className="mt-3 pt-2 border-t space-y-2">
            <div className="flex gap-2">
              <button
                onClick={clearAllSelections}
                className="flex-1 text-sm text-red-600 hover:text-red-800 py-2 hover:bg-red-50 rounded transition-colors border border-red-200"
              >
                Clear All ({selectedFurnishing.length})
              </button>
              <button
                onClick={() => {
                  // Select all furnishing types
                  const allIds = furnishingTypes.map(f => f.id);
                  setSelectedFurnishing(allIds);
                  setFilters(prev => ({
                    ...prev,
                    furnished_id: allIds.length === 1 ? allIds[0] : allIds
                  }));
                }}
                className="flex-1 text-sm text-orange-600 hover:text-orange-800 py-2 hover:bg-orange-50 rounded transition-colors border border-orange-200"
                disabled={selectedFurnishing.length === furnishingTypes.length}
              >
                Select All
              </button>
            </div>
          </div>
        )}

        {/* Debug info - Always visible in development */}
        {/* {process.env.NODE_ENV === 'development' && (
          <div className="mt-2 p-2 bg-gray-100 rounded text-xs space-y-1">
            <div><strong>API Status:</strong> {error ? '❌ Error' : '✅ Success'}</div>
            <div><strong>Available Types:</strong> {furnishingTypes.length}</div>
            <div><strong>Selected IDs:</strong> [{selectedFurnishing.join(', ')}]</div>
            <div><strong>Filter Value:</strong> {JSON.stringify(filters.furnished_id)}</div>
            <div><strong>Raw Data:</strong> {JSON.stringify(furnishingTypes.slice(0, 2), null, 1)}</div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default FurnishingSection;