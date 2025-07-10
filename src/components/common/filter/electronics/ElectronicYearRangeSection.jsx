import React, { useState, useEffect } from "react";
import { api } from "@/api/axios";
const ElectronicYearRangeSection = ({
  filters,
  setFilters,
  expandedSections,
  toggleSection,
}) => {
    const [yearRanges, setYearRanges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedYearRanges, setSelectedYearRanges] = useState([]);

    // Load year ranges from API on component mount and when subcategory changes
    useEffect(() => {
      fetchYearRanges();
    }, [filters.subcategory_id]);

    // Set initial selected values from filters
    useEffect(() => {
      if (filters.year_filter) {
        const filterValues = Array.isArray(filters.year_filter)
          ? filters.year_filter
          : [filters.year_filter];

        setSelectedYearRanges(filterValues.filter((val) => val && val !== ""));
      } else {
        setSelectedYearRanges([]);
      }
    }, [filters.year_filter]);

    // Clear selections when subcategory changes
    useEffect(() => {
      setSelectedYearRanges([]);
      setFilters((prev) => ({
        ...prev,
        year_filter: "",
      }));
    }, [filters.subcategory_id]);

    const fetchYearRanges = async () => {
      setLoading(true);
      try {
        // Build the request based on whether subcategory_id exists
        let response;
        if (filters.subcategory_id) {
          // Use POST request with subcategory_id in body
          response = await api.get("/electronic/year-ranges")
        } else {
          // Use GET request without subcategory_id
          response = await api.get("/electronic/year-ranges");
        }

        console.log("Year ranges response:", response.data);

        if (response.data && Array.isArray(response.data)) {
          setYearRanges(response.data);
        } else {
          console.error("Invalid year ranges response format");
          setYearRanges([]);
        }
      } catch (error) {
        console.error("Error fetching year ranges:", error);
        setYearRanges([]);
      } finally {
        setLoading(false);
      }
    };

    const handleYearRangeSelect = (yearRange) => {
      const isCurrentlySelected = selectedYearRanges.includes(yearRange.value);
      let newSelectedYearRanges;

      if (isCurrentlySelected) {
        // Remove from selection
        newSelectedYearRanges = selectedYearRanges.filter(
          (val) => val !== yearRange.value
        );
      } else {
        // Add to selection
        newSelectedYearRanges = [...selectedYearRanges, yearRange.value];
      }

      console.log("Year range multi-selection:", {
        currentSelected: selectedYearRanges,
        yearRangeValue: yearRange.value,
        isCurrentlySelected,
        newSelection: newSelectedYearRanges,
      });

      setSelectedYearRanges(newSelectedYearRanges);

      // Update filters - send array or single value based on selection count
      const filterValue =
        newSelectedYearRanges.length === 0
          ? ""
          : newSelectedYearRanges.length === 1
          ? newSelectedYearRanges[0] // Single value for single selection
          : newSelectedYearRanges; // Array for multiple selections

      setFilters((prev) => ({
        ...prev,
        year_filter: filterValue,
      }));

      console.log("Selected year ranges:", {
        selected: newSelectedYearRanges,
        filterValue: filterValue,
        count: newSelectedYearRanges.length,
      });
    };

    const clearAllSelections = () => {
      setSelectedYearRanges([]);
      setFilters((prev) => ({
        ...prev,
        year_filter: "",
      }));
    };

    const formatCount = (count) => {
      if (count === null || count === undefined) return "0";
      if (count >= 1000) {
        return `${Math.floor(count / 1000)}k+ items`;
      }
      return `${count}+ items`;
    };

    const getSelectedSummary = () => {
      if (selectedYearRanges.length === 0) return "";
      if (selectedYearRanges.length === 1) {
        const range = yearRanges.find((r) => r.value === selectedYearRanges[0]);
        return range?.label || selectedYearRanges[0];
      }
      return `${selectedYearRanges.length} ranges`;
    };

    if (loading) {
      return (
        <div className="mb-4">
          <div className="flex justify-between items-center cursor-pointer py-2 border-b">
            <h2 className="font-medium text-gray-800">Year Range</h2>
          </div>
          <div className="py-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Loading year ranges...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="mb-4">
        <div
          className="flex justify-between items-center cursor-pointer py-2 border-b"
          onClick={() => toggleSection("yearRange")}
        >
          <h2 className="font-medium text-gray-800">
            Year Range
            {selectedYearRanges.length > 0 && (
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                {selectedYearRanges.length} selected
              </span>
            )}
          </h2>
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${
              expandedSections.yearRange ? "rotate-180" : ""
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
          className={`transition-all duration-300 ease-in-out overflow-hidden custom-scrollbar ${
            expandedSections.yearRange ? "max-h-96 py-2" : "max-h-0"
          }`}
        >
          {/* Selection Summary */}
          {selectedYearRanges.length > 0 && (
            <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded text-sm">
              <div className="flex justify-between items-center">
                <span className="text-green-800">
                  Selected: {getSelectedSummary()}
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

          {yearRanges.length > 0 ? (
            <div className="grid grid-cols-1 gap-2 mb-2">
              {yearRanges.map((range, index) => {
                const isSelected = selectedYearRanges.includes(range.value);

                return (
                  <div
                    key={range.value || index}
                    className={`rounded text-sm p-4 flex justify-between gap-[15px] cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "bg-green-100 border-2 border-green-500 shadow-sm"
                        : "bg-gray-100 hover:bg-green-50 hover:border-green-300 border-2 border-transparent"
                    }`}
                    onClick={() => handleYearRangeSelect(range)}
                  >
                    <div className="flex items-center">
                      {/* Checkbox style indicator */}
                      <div
                        className={`w-4 h-4 mr-3 border-2 rounded flex items-center justify-center ${
                          isSelected
                            ? "border-green-500 bg-green-500"
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
                          isSelected ? "text-green-800" : ""
                        }`}
                      >
                        {range.label}
                      </span>
                    </div>
                    <div
                      className={`text-xs flex items-center ${
                        isSelected ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {range.count !== undefined
                        ? formatCount(range.count)
                        : "0 items"}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm">No year ranges available</p>
              <button
                onClick={fetchYearRanges}
                className="mt-2 text-blue-600 text-sm hover:underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Action Buttons */}
          {selectedYearRanges.length > 0 && (
            <div className="mt-3 pt-2 border-t space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={clearAllSelections}
                  className="flex-1 text-sm text-red-600 hover:text-red-800 py-2 hover:bg-red-50 rounded transition-colors border border-red-200"
                >
                  Clear All ({selectedYearRanges.length})
                </button>
                <button
                  onClick={() => {
                    // Select all year ranges
                    const allValues = yearRanges.map((r) => r.value);
                    setSelectedYearRanges(allValues);
                    setFilters((prev) => ({
                      ...prev,
                      year_filter:
                        allValues.length === 1 ? allValues[0] : allValues,
                    }));
                  }}
                  className="flex-1 text-sm text-green-600 hover:text-green-800 py-2 hover:bg-green-50 rounded transition-colors border border-green-200"
                  disabled={selectedYearRanges.length === yearRanges.length}
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

export default ElectronicYearRangeSection;
