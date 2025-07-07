import React, { useState, useEffect } from "react";
import { api } from "@/api/axios";

const ConstructionStatusSection = ({ 
  filters, 
  setFilters, 
  expandedSections, 
  toggleSection 
}) => {
  const [constructionStatuses, setConstructionStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  // Load construction statuses from API on component mount
  useEffect(() => {
    fetchConstructionStatuses();
  }, []);

  // Set initial selected values from filters
  useEffect(() => {
    if (filters.construction_status_id) {
      // Handle both single value and array
      const filterValues = Array.isArray(filters.construction_status_id) 
        ? filters.construction_status_id 
        : [filters.construction_status_id];
      
      const numericValues = filterValues.map(val => Number(val)).filter(val => !isNaN(val));
      setSelectedStatuses(numericValues);
      console.log("Setting initial construction status selection:", numericValues);
    } else {
      setSelectedStatuses([]);
    }
  }, [filters.construction_status_id]);

  const fetchConstructionStatuses = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("🔄 Fetching construction statuses from /construction-statuses...");
      const response = await api.get('/construction-statuses');
      
      console.log("📥 Raw construction statuses response:", response);
      console.log("📦 Response data:", response.data);
      
      if (!response.data) {
        throw new Error("No data received from API");
      }
      
      let statusData = response.data;
      
      // Handle different response formats
      if (response.data.data && Array.isArray(response.data.data)) {
        statusData = response.data.data;
        console.log("📋 Using nested data property:", statusData);
      } else if (!Array.isArray(response.data)) {
        throw new Error("Response data is not an array");
      }
      
      console.log("📝 Construction status data to process:", statusData);
      console.log("📏 Number of construction statuses:", statusData.length);
      
      // Filter only active construction statuses
      const activeStatuses = statusData.filter(status => {
        console.log(`🔍 Checking status:`, status);
        console.log(`   - ID: ${status.id}, Name: ${status.name}, Active: ${status.active}`);
        return status.active === 1 || status.active === "1" || status.active === true;
      });
      
      console.log("✅ Active construction statuses:", activeStatuses);
      console.log("📊 Active count:", activeStatuses.length);
      
      setConstructionStatuses(activeStatuses);
      
      if (activeStatuses.length === 0) {
        console.warn("⚠️ No active construction statuses found");
        setError("No active construction statuses available");
      }
      
    } catch (error) {
      console.error("❌ Error fetching construction statuses:", error);
      console.error("❌ Error details:", {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      
      setError(error.message || "Failed to load construction statuses");
      setConstructionStatuses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusSelect = (status) => {
    const isCurrentlySelected = selectedStatuses.includes(status.id);
    let newSelectedStatuses;
    
    if (isCurrentlySelected) {
      // Remove from selection
      newSelectedStatuses = selectedStatuses.filter(val => val !== status.id);
    } else {
      // Add to selection
      newSelectedStatuses = [...selectedStatuses, status.id];
    }
    
    console.log("🏗️ Construction status selection change:", {
      currentSelected: selectedStatuses,
      statusId: status.id,
      statusName: status.name,
      isCurrentlySelected,
      newSelection: newSelectedStatuses
    });
    
    setSelectedStatuses(newSelectedStatuses);
    
    // Update filters - send array or single value based on API requirements
    const filterValue = newSelectedStatuses.length === 0 
      ? "" 
      : newSelectedStatuses.length === 1 
        ? newSelectedStatuses[0] // Single value for single selection
        : newSelectedStatuses; // Array for multiple selections
    
    setFilters(prev => ({
      ...prev,
      construction_status_id: filterValue
    }));

    console.log("🔄 Updated construction status filter:", {
      selected: newSelectedStatuses,
      filterValue: filterValue,
      count: newSelectedStatuses.length
    });
  };

  const clearAllSelections = () => {
    console.log("🧹 Clearing all construction status selections");
    setSelectedStatuses([]);
    setFilters(prev => ({
      ...prev,
      construction_status_id: ""
    }));
  };

  const getSelectedSummary = () => {
    if (selectedStatuses.length === 0) return "";
    
    const selectedNames = selectedStatuses.map(id => {
      const status = constructionStatuses.find(s => s.id === id);
      return status?.name || `ID ${id}`;
    });
    
    if (selectedNames.length === 1) return selectedNames[0];
    return `${selectedNames.length} statuses`;
  };

  const getStatusIcon = (statusName) => {
    const name = statusName.toLowerCase();
    
    if (name.includes('under') || name.includes('construction')) {
      // Under Construction icon
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      );
    } else if (name.includes('ready') || name.includes('move')) {
      // Ready to Move icon
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      );
    } else if (name.includes('new') || name.includes('launch')) {
      // New Launch icon
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    } else if (name.includes('completed') || name.includes('done')) {
      // Completed icon
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    
    // Default construction icon
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="mb-4">
        <h2 className="font-medium text-gray-800 py-2 border-b">
          Construction Status
        </h2>
        <div className="py-4 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Loading construction statuses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4">
        <h2 className="font-medium text-gray-800 py-2 border-b">
          Construction Status
        </h2>
        <div className="py-4 text-center">
          <div className="text-red-500 text-sm mb-2">⚠️ {error}</div>
          <button
            onClick={fetchConstructionStatuses}
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
        onClick={() => toggleSection && toggleSection("constructionStatus")}
      >
        <h2 className="font-medium text-gray-800">
          Construction Status
          {selectedStatuses.length > 0 && (
            <span className="ml-2 text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
              {selectedStatuses.length} selected
            </span>
          )}
        </h2>
        {toggleSection && (
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${
              expandedSections?.constructionStatus ? "rotate-180" : ""
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
          !toggleSection || expandedSections?.constructionStatus 
            ? "max-h-96 py-2" 
            : "max-h-0"
        }`}
      >
        {/* Selection Summary */}
        {selectedStatuses.length > 0 && (
          <div className="mb-3 p-2 bg-indigo-50 border border-indigo-200 rounded text-sm">
            <div className="flex justify-between items-center">
              <span className="text-indigo-800">
                Selected: {getSelectedSummary()}
              </span>
              <button
                onClick={clearAllSelections}
                className="text-indigo-600 hover:text-indigo-800 text-xs underline"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {constructionStatuses.length > 0 ? (
          <div 
            className="py-2 overflow-auto custom-scrollbar"
            style={{ maxHeight: "200px" }}
          >
            {constructionStatuses.map((status) => {
              const isSelected = selectedStatuses.includes(status.id);
              
              return (
                <div
                  key={status.id}
                  className={`flex items-center py-2 px-3 rounded-md cursor-pointer transition-all duration-200 mb-1 ${
                    isSelected
                      ? "bg-indigo-50 border border-indigo-200"
                      : "hover:bg-indigo-25 hover:border-indigo-100 border border-transparent"
                  }`}
                  onClick={() => handleStatusSelect(status)}
                >
                  {/* Custom checkbox */}
                  <div className={`w-4 h-4 mr-3 border-2 rounded flex items-center justify-center ${
                    isSelected 
                      ? "border-indigo-500 bg-indigo-500" 
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
                    <div className={`mr-2 ${isSelected ? 'text-indigo-600' : 'text-gray-400'}`}>
                      {getStatusIcon(status.name)}
                    </div>
                    <label 
                      className={`text-sm cursor-pointer ${isSelected ? 'text-indigo-800 font-medium' : 'text-gray-700'}`}
                    >
                      {status.name}
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm">No construction statuses available</p>
            <p className="text-gray-400 text-xs mt-1">Check console for details</p>
            <button
              onClick={fetchConstructionStatuses}
              className="mt-2 text-blue-600 text-sm hover:underline"
            >
              Retry Loading
            </button>
          </div>
        )}

        {/* Action Buttons */}
        {selectedStatuses.length > 0 && (
          <div className="mt-3 pt-2 border-t space-y-2">
            <div className="flex gap-2">
              <button
                onClick={clearAllSelections}
                className="flex-1 text-sm text-red-600 hover:text-red-800 py-2 hover:bg-red-50 rounded transition-colors border border-red-200"
              >
                Clear All ({selectedStatuses.length})
              </button>
              <button
                onClick={() => {
                  // Select all construction statuses
                  const allIds = constructionStatuses.map(s => s.id);
                  setSelectedStatuses(allIds);
                  setFilters(prev => ({
                    ...prev,
                    construction_status_id: allIds.length === 1 ? allIds[0] : allIds
                  }));
                }}
                className="flex-1 text-sm text-indigo-600 hover:text-indigo-800 py-2 hover:bg-indigo-50 rounded transition-colors border border-indigo-200"
                disabled={selectedStatuses.length === constructionStatuses.length}
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

export default ConstructionStatusSection;