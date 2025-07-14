import React, { useState, useEffect } from "react";
import { api } from "@/api/axios";
import SpeedIcon from "@mui/icons-material/Speed";

const BikeKilometersFilter = ({
  filters,
  setFilters,
  expandedSections,
  toggleSection,
}) => {
    const [kilometersRanges, setKilometersRanges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedKilometersRanges, setSelectedKilometersRanges] = useState(
      []
    ); // Array for multi-select

    // Load kilometers ranges from API on component mount
    useEffect(() => {
      fetchKilometersRanges();
    }, []);

    // Set initial selected values from filters
    useEffect(() => {
      if (filters.kilometer_range) {
        // Handle both single value and array
        const filterValues = Array.isArray(filters.kilometer_range)
          ? filters.kilometer_range
          : [filters.kilometer_range];

        setSelectedKilometersRanges(
          filterValues.filter((val) => val && val !== "")
        );
      } else {
        setSelectedKilometersRanges([]);
      }
    }, [filters.kilometer_range]);

    const fetchKilometersRanges = async () => {
      setLoading(true);
      try {
        const response = await api.get("bike/get/kilometers");
        console.log("Kilometers ranges response:", response.data);

        if (response.data && Array.isArray(response.data)) {
          setKilometersRanges(response.data);
        } else {
          console.error("Invalid kilometers ranges response format");
          setKilometersRanges([]);
        }
      } catch (error) {
        console.error("Error fetching kilometers ranges:", error);
        setKilometersRanges([]);
      } finally {
        setLoading(false);
      }
    };

    const handleKilometersRangeSelect = (kilometersRange) => {
      const isCurrentlySelected = selectedKilometersRanges.includes(
        kilometersRange.value
      );
      let newSelectedKilometersRanges;

      if (isCurrentlySelected) {
        // Remove from selection
        newSelectedKilometersRanges = selectedKilometersRanges.filter(
          (val) => val !== kilometersRange.value
        );
      } else {
        // Add to selection
        newSelectedKilometersRanges = [
          ...selectedKilometersRanges,
          kilometersRange.value,
        ];
      }

      console.log("Kilometers range multi-selection:", {
        currentSelected: selectedKilometersRanges,
        kilometersRangeValue: kilometersRange.value,
        isCurrentlySelected,
        newSelection: newSelectedKilometersRanges,
      });

      setSelectedKilometersRanges(newSelectedKilometersRanges);

      // Update filters - send array or single value based on API requirements
      const filterValue =
        newSelectedKilometersRanges.length === 0
          ? ""
          : newSelectedKilometersRanges.length === 1
          ? newSelectedKilometersRanges[0] // Single value for single selection
          : newSelectedKilometersRanges; // Array for multiple selections

      setFilters((prev) => ({
        ...prev,
        kilometer_range: filterValue,
      }));

      console.log("Selected kilometers ranges:", {
        selected: newSelectedKilometersRanges,
        filterValue: filterValue,
        count: newSelectedKilometersRanges.length,
      });
    };

    const clearAllSelections = () => {
      setSelectedKilometersRanges([]);
      setFilters((prev) => ({
        ...prev,
        kilometer_range: "",
      }));
    };

    const formatCount = (count) => {
      if (count >= 1000) {
        return `${Math.floor(count / 1000)}k+ vehicles`;
      }
      return `${count}+ vehicles`;
    };

    const getSelectedSummary = () => {
      if (selectedKilometersRanges.length === 0) return "";
      if (selectedKilometersRanges.length === 1) {
        const range = kilometersRanges.find(
          (r) => r.value === selectedKilometersRanges[0]
        );
        return range?.label || selectedKilometersRanges[0];
      }
      return `${selectedKilometersRanges.length} ranges`;
    };

    // Helper function to get icon color based on kilometers range
    const getKilometersIcon = (value) => {
      const [min] = value.split("-").map(Number);
      if (min < 25000) return "text-green-500"; // Low km - green
      if (min < 50000) return "text-yellow-500"; // Medium km - yellow
      if (min < 75000) return "text-orange-500"; // High km - orange
      return "text-red-500"; // Very high km - red
    };

    if (loading) {
      return (
        <div className="mb-4">
          <div className="flex justify-between items-center cursor-pointer py-2 border-b">
            <h2 className="font-medium text-gray-800 flex items-center">
              <SpeedIcon
                className="mr-2 text-blue-500"
                style={{ fontSize: 18 }}
              />
              Kilometers
            </h2>
          </div>
          <div className="py-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">
              Loading kilometers ranges...
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="mb-4">
        <div
          className="flex justify-between items-center cursor-pointer py-2 border-b"
          onClick={() => toggleSection("kilometersRange")}
        >
          <h2 className="font-medium text-gray-800 flex items-center">
            <SpeedIcon
              className="mr-2 text-blue-500"
              style={{ fontSize: 18 }}
            />
            Kilometers
            {selectedKilometersRanges.length > 0 && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {selectedKilometersRanges.length} selected
              </span>
            )}
          </h2>
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${
              expandedSections.kilometersRange ? "rotate-180" : ""
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
            expandedSections.kilometersRange ? "max-h-96 py-2" : "max-h-0"
          }`}
        >
          {/* Selection Summary */}
          {selectedKilometersRanges.length > 0 && (
            <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
              <div className="flex justify-between items-center">
                <span className="text-blue-800 flex items-center">
                  <SpeedIcon style={{ fontSize: 14 }} className="mr-1" />
                  Selected: {getSelectedSummary()}
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

          {kilometersRanges.length > 0 ? (
            <div className="grid grid-cols-1 gap-2 mb-2">
              {kilometersRanges.map((range, index) => {
                const isSelected = selectedKilometersRanges.includes(
                  range.value
                );
                const iconColorClass = getKilometersIcon(range.value);

                return (
                  <div
                    key={range.value || index}
                    className={`rounded text-sm p-4 flex justify-between gap-[15px] cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "bg-blue-100 border-2 border-blue-500 shadow-sm"
                        : "bg-gray-100 hover:bg-blue-50 hover:border-blue-300 border-2 border-transparent"
                    }`}
                    onClick={() => handleKilometersRangeSelect(range)}
                  >
                    <div className="flex items-center">
                      {/* Kilometers icon with color coding */}
                      <SpeedIcon
                        className={`mr-2 ${iconColorClass}`}
                        style={{ fontSize: 16 }}
                      />

                      <span
                        className={`font-medium ${
                          isSelected ? "text-blue-800" : ""
                        }`}
                      >
                        {range.label}
                      </span>
                    </div>

                    <div
                      className={`text-xs flex items-center ${
                        isSelected ? "text-blue-600" : "text-gray-500"
                      }`}
                    >
                      {range.count !== undefined
                        ? formatCount(range.count)
                        : "0 vehicles"}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4">
              <SpeedIcon
                className="mx-auto text-gray-400 mb-2"
                style={{ fontSize: 32 }}
              />
              <p className="text-gray-500 text-sm">
                No kilometers ranges available
              </p>
              <button
                onClick={fetchKilometersRanges}
                className="mt-2 text-blue-600 text-sm hover:underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Action Buttons */}
          {selectedKilometersRanges.length > 0 && (
            <div className="mt-3 pt-2 border-t space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={clearAllSelections}
                  className="flex-1 text-sm text-red-600 hover:text-red-800 py-2 hover:bg-red-50 rounded transition-colors border border-red-200"
                >
                  Clear All ({selectedKilometersRanges.length})
                </button>
                <button
                  onClick={() => {
                    // Select all kilometers ranges
                    const allValues = kilometersRanges.map((r) => r.value);
                    setSelectedKilometersRanges(allValues);
                    setFilters((prev) => ({
                      ...prev,
                      kilometer_range:
                        allValues.length === 1 ? allValues[0] : allValues,
                    }));
                  }}
                  className="flex-1 text-sm text-blue-600 hover:text-blue-800 py-2 hover:bg-blue-50 rounded transition-colors border border-blue-200"
                  disabled={
                    selectedKilometersRanges.length === kilometersRanges.length
                  }
                >
                  Select All
                </button>
              </div>
            </div>
          )}

          {/* Additional Info */}
          {kilometersRanges.length > 0 && (
            <div className="mt-3 pt-2 border-t">
              <div className="text-xs text-gray-500 text-center">
                💡 Lower kilometers usually indicate better vehicle condition
              </div>
              <div className="flex justify-center items-center mt-2 space-x-4 text-xs">
                <div className="flex items-center">
                  <SpeedIcon
                    className="text-green-500 mr-1"
                    style={{ fontSize: 12 }}
                  />
                  <span>Low</span>
                </div>
                <div className="flex items-center">
                  <SpeedIcon
                    className="text-yellow-500 mr-1"
                    style={{ fontSize: 12 }}
                  />
                  <span>Medium</span>
                </div>
                <div className="flex items-center">
                  <SpeedIcon
                    className="text-orange-500 mr-1"
                    style={{ fontSize: 12 }}
                  />
                  <span>High</span>
                </div>
                <div className="flex items-center">
                  <SpeedIcon
                    className="text-red-500 mr-1"
                    style={{ fontSize: 12 }}
                  />
                  <span>Very High</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
};

export default BikeKilometersFilter;
