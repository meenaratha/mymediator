import React, { useState, useEffect } from "react";
import { api } from "@/api/axios";

const BikeOwnerFilter = ({
  filters,
  setFilters,
  expandedSections,
  toggleSection,
}) => {
  const [listedByOptions, setListedByOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedListedBy, setSelectedListedBy] = useState([]);
  
    // Load listed by options from API on component mount
    useEffect(() => {
      fetchListedByOptions();
    }, []);
  
    // Set initial selected values from filters
    useEffect(() => {
      if (filters.listed_by_id) {
        // Handle both single value and array
        const filterValues = Array.isArray(filters.listed_by_id) 
          ? filters.listed_by_id 
          : [filters.listed_by_id];
        
        const numericValues = filterValues.map(val => Number(val)).filter(val => !isNaN(val));
        setSelectedListedBy(numericValues);
        console.log("Setting initial listed by selection:", numericValues);
      } else {
        setSelectedListedBy([]);
      }
    }, [filters.listed_by_id]);
  
    const fetchListedByOptions = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log("🔄 Fetching listed by options from /listed-by...");
        const response = await api.get('/listed-by');
        
        console.log("📥 Raw listed by response:", response);
        console.log("📦 Response data:", response.data);
        
        if (!response.data) {
          throw new Error("No data received from API");
        }
        
        let listedByData = response.data;
        
        // Handle different response formats
        if (response.data.data && Array.isArray(response.data.data)) {
          listedByData = response.data.data;
          console.log("📋 Using nested data property:", listedByData);
        } else if (!Array.isArray(response.data)) {
          throw new Error("Response data is not an array");
        }
        
        console.log("📝 Listed by data to process:", listedByData);
        console.log("📏 Number of listed by options:", listedByData.length);
        
        // Filter only active listed by options
        const activeOptions = listedByData.filter(option => {
          console.log(`🔍 Checking option:`, option);
          console.log(`   - ID: ${option.id}, Name: ${option.name}, Active: ${option.active}`);
          return option.active === 1 || option.active === "1" || option.active === true;
        });
        
        console.log("✅ Active listed by options:", activeOptions);
        console.log("📊 Active count:", activeOptions.length);
        
        setListedByOptions(activeOptions);
        
        if (activeOptions.length === 0) {
          console.warn("⚠️ No active listed by options found");
          setError("No active listed by options available");
        }
        
      } catch (error) {
        console.error("❌ Error fetching listed by options:", error);
        console.error("❌ Error details:", {
          message: error.message,
          response: error.response,
          status: error.response?.status,
          data: error.response?.data
        });
        
        setError(error.message || "Failed to load listed by options");
        setListedByOptions([]);
      } finally {
        setLoading(false);
      }
    };
  
    const handleListedBySelect = (option) => {
      const isCurrentlySelected = selectedListedBy.includes(option.id);
      let newSelectedListedBy;
      
      if (isCurrentlySelected) {
        // Remove from selection
        newSelectedListedBy = selectedListedBy.filter(val => val !== option.id);
      } else {
        // Add to selection
        newSelectedListedBy = [...selectedListedBy, option.id];
      }
      
      console.log("👤 Listed by selection change:", {
        currentSelected: selectedListedBy,
        optionId: option.id,
        optionName: option.name,
        isCurrentlySelected,
        newSelection: newSelectedListedBy
      });
      
      setSelectedListedBy(newSelectedListedBy);
      
      // Update filters - send array or single value based on API requirements
      const filterValue = newSelectedListedBy.length === 0 
        ? "" 
        : newSelectedListedBy.length === 1 
          ? newSelectedListedBy[0] // Single value for single selection
          : newSelectedListedBy; // Array for multiple selections
      
      setFilters(prev => ({
        ...prev,
        listed_by_id: filterValue
      }));
  
      console.log("🔄 Updated listed by filter:", {
        selected: newSelectedListedBy,
        filterValue: filterValue,
        count: newSelectedListedBy.length
      });
    };
  
    const clearAllSelections = () => {
      console.log("🧹 Clearing all listed by selections");
      setSelectedListedBy([]);
      setFilters(prev => ({
        ...prev,
        listed_by_id: ""
      }));
    };
  
    const getSelectedSummary = () => {
      if (selectedListedBy.length === 0) return "";
      
      const selectedNames = selectedListedBy.map(id => {
        const option = listedByOptions.find(o => o.id === id);
        return option?.name || `ID ${id}`;
      });
      
      if (selectedNames.length === 1) return selectedNames[0];
      return `${selectedNames.length} types`;
    };
  
    const getListedByIcon = (optionName) => {
      const name = optionName.toLowerCase();
      
      if (name.includes('owner')) {
        // Owner icon
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      } else if (name.includes('dealer') || name.includes('agent')) {
        // Dealer/Agent icon
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2m0 2H8v-2m8 0v2m-8-2v2m0 0v8a2 2 0 002 2h4a2 2 0 002-2v-8m-8 0h8" />
          </svg>
        );
      } else if (name.includes('builder') || name.includes('developer')) {
        // Builder/Developer icon
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      } else if (name.includes('broker') || name.includes('consultant')) {
        // Broker/Consultant icon
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      }
      
      // Default person icon
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      );
    };
  
    if (loading) {
      return (
        <div className="mb-4">
          <h2 className="font-medium text-gray-800 py-2 border-b">
            Listed By
          </h2>
          <div className="py-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Loading listed by options...</p>
          </div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="mb-4">
          <h2 className="font-medium text-gray-800 py-2 border-b">
            Listed By
          </h2>
          <div className="py-4 text-center">
            <div className="text-red-500 text-sm mb-2">⚠️ {error}</div>
            <button
              onClick={fetchListedByOptions}
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
          onClick={() => toggleSection && toggleSection("listedBy")}
        >
          <h2 className="font-medium text-gray-800">
            Listed By
            {selectedListedBy.length > 0 && (
              <span className="ml-2 text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                {selectedListedBy.length} selected
              </span>
            )}
          </h2>
          {toggleSection && (
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${
                expandedSections?.listedBy ? "rotate-180" : ""
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
            !toggleSection || expandedSections?.listedBy 
              ? "max-h-96 py-2" 
              : "max-h-0"
          }`}
        >
          {/* Selection Summary */}
          {selectedListedBy.length > 0 && (
            <div className="mb-3 p-2 bg-emerald-50 border border-emerald-200 rounded text-sm">
              <div className="flex justify-between items-center">
                <span className="text-emerald-800">
                  Selected: {getSelectedSummary()}
                </span>
                <button
                  onClick={clearAllSelections}
                  className="text-emerald-600 hover:text-emerald-800 text-xs underline"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
  
          {listedByOptions.length > 0 ? (
            <div 
              className="py-2 overflow-auto custom-scrollbar"
              style={{ maxHeight: "150px" }}
            >
              {listedByOptions.map((option) => {
                const isSelected = selectedListedBy.includes(option.id);
                
                return (
                  <div
                    key={option.id}
                    className={`flex items-center py-2 px-2 rounded-md cursor-pointer transition-all duration-200 mb-1 ${
                      isSelected
                        ? "bg-emerald-50 border border-emerald-200"
                        : "hover:bg-emerald-25 hover:border-emerald-100 border border-transparent"
                    }`}
                    onClick={() => handleListedBySelect(option)}
                  >
                    {/* Custom checkbox */}
                    <div className={`w-4 h-4 mr-3 border-2 rounded flex items-center justify-center ${
                      isSelected 
                        ? "border-emerald-500 bg-emerald-500" 
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
                    
                    <div className="flex items-center flex-1">
                      <div className={`mr-2 ${isSelected ? 'text-emerald-600' : 'text-gray-400'}`}>
                        {getListedByIcon(option.name)}
                      </div>
                      <label 
                        htmlFor={`listed-by-${option.id}`}
                        className={`text-sm cursor-pointer ${isSelected ? 'text-emerald-800 font-medium' : 'text-gray-700'}`}
                      >
                        {option.name}
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm">No listed by options available</p>
              <p className="text-gray-400 text-xs mt-1">Check console for details</p>
              <button
                onClick={fetchListedByOptions}
                className="mt-2 text-blue-600 text-sm hover:underline"
              >
                Retry Loading
              </button>
            </div>
          )}
  
          {/* Action Buttons */}
          {selectedListedBy.length > 0 && (
            <div className="mt-3 pt-2 border-t space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={clearAllSelections}
                  className="flex-1 text-sm text-red-600 hover:text-red-800 py-2 hover:bg-red-50 rounded transition-colors border border-red-200"
                >
                  Clear All ({selectedListedBy.length})
                </button>
                <button
                  onClick={() => {
                    // Select all listed by options
                    const allIds = listedByOptions.map(o => o.id);
                    setSelectedListedBy(allIds);
                    setFilters(prev => ({
                      ...prev,
                      listed_by_id: allIds.length === 1 ? allIds[0] : allIds
                    }));
                  }}
                  className="flex-1 text-sm text-emerald-600 hover:text-emerald-800 py-2 hover:bg-emerald-50 rounded transition-colors border border-emerald-200"
                  disabled={selectedListedBy.length === listedByOptions.length}
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

export default BikeOwnerFilter;
