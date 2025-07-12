import React, { useState, useEffect } from "react";
import { api } from "@/api/axios";

const CarFuelTypeFilter = ({
  filters,
  setFilters,
  expandedSections,
  toggleSection,
}) => {
  const [fuelTypeOptions, setFuelTypeOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState([]);

  // Load fuel type options from API on component mount
  useEffect(() => {
    fetchFuelTypeOptions();
  }, []);

  // Set initial selected values from filters
  useEffect(() => {
    if (filters.fuel_type) {
      const filterValues = Array.isArray(filters.fuel_type)
        ? filters.fuel_type
        : [filters.fuel_type];

      setSelectedFuelTypes(filterValues.filter((val) => val && val !== ""));
    } else {
      setSelectedFuelTypes([]);
    }
  }, [filters.fuel_type]);

  const fetchFuelTypeOptions = async () => {
    setLoading(true);
    try {
      const response = await api.get('/car/get/fueltype');

      if (response.data && Array.isArray(response.data)) {
        setFuelTypeOptions(response.data);
      } else {
        setFuelTypeOptions([]);
      }
    } catch (error) {
      setFuelTypeOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFuelTypeSelect = (option) => {
    const isCurrentlySelected = selectedFuelTypes.includes(option.value);
    let newSelectedFuelTypes;

    if (isCurrentlySelected) {
      // Remove from selection
      newSelectedFuelTypes = selectedFuelTypes.filter(
        (val) => val !== option.value
      );
    } else {
      // Add to selection
      newSelectedFuelTypes = [...selectedFuelTypes, option.value];
    }

    setSelectedFuelTypes(newSelectedFuelTypes);

    // Update filters - send array or single value based on selection count
    const filterValue =
      newSelectedFuelTypes.length === 0
        ? ""
        : newSelectedFuelTypes.length === 1
        ? newSelectedFuelTypes[0] // Single value for single selection
        : newSelectedFuelTypes; // Array for multiple selections

    setFilters((prev) => ({
      ...prev,
      fuel_type: filterValue,
    }));
  };

  const clearAllSelections = () => {
    setSelectedFuelTypes([]);
    setFilters((prev) => ({
      ...prev,
      fuel_type: "",
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
    if (selectedFuelTypes.length === 0) return "";
    if (selectedFuelTypes.length === 1) {
      const option = fuelTypeOptions.find((o) => o.value === selectedFuelTypes[0]);
      return option?.label || selectedFuelTypes[0];
    }
    return `${selectedFuelTypes.length} types`;
  };

  if (loading) {
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center cursor-pointer py-2 border-b">
          <h2 className="font-medium text-gray-800">Fuel Type</h2>
        </div>
        <div className="py-4 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Loading...</p>
        </div>
      </div>
    );
  };

  return (
    <div className="mb-4">
      <div
        className="flex justify-between items-center cursor-pointer py-2 border-b"
        onClick={() => toggleSection("fuelType")}
      >
        <h2 className="font-medium text-gray-800">
          Fuel Type
          {selectedFuelTypes.length > 0 && (
            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {selectedFuelTypes.length} selected
            </span>
          )}
        </h2>
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${
            expandedSections.fuelType ? "rotate-180" : ""
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
          expandedSections.fuelType ? "max-h-96 py-2" : "max-h-0"
        }`}
      >
        {/* Selection Summary */}
        {selectedFuelTypes.length > 0 && (
          <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
            <div className="flex justify-between items-center">
              <span className="text-blue-800">
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

        {fuelTypeOptions.length > 0 ? (
          <div className="grid grid-cols-1 gap-2 mb-2">
            {fuelTypeOptions.map((option, index) => {
              const isSelected = selectedFuelTypes.includes(option.value);

              return (
                <div
                  key={option.value || index}
                  className={`rounded text-sm p-4 flex justify-between gap-[15px] cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "bg-blue-100 border-2 border-blue-500 shadow-sm"
                      : "bg-gray-100 hover:bg-blue-50 hover:border-blue-300 border-2 border-transparent"
                  }`}
                  onClick={() => handleFuelTypeSelect(option)}
                >
                  <div className="flex items-center">
                    {/* Checkbox style indicator */}
                    <div
                      className={`w-4 h-4 mr-3 border-2 rounded flex items-center justify-center ${
                        isSelected
                          ? "border-blue-500 bg-blue-500"
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
                        isSelected ? "text-blue-800" : ""
                      }`}
                    >
                      {option.label}
                    </span>
                  </div>
                  <div
                    className={`text-xs flex items-center ${
                      isSelected ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {option.count !== undefined
                      ? formatCount(option.count)
                      : "0 items"}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm">No options available</p>
            <button
              onClick={fetchFuelTypeOptions}
              className="mt-2 text-blue-600 text-sm hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Action Buttons */}
        {selectedFuelTypes.length > 0 && (
          <div className="mt-3 pt-2 border-t space-y-2">
            <div className="flex gap-2">
              <button
                onClick={clearAllSelections}
                className="flex-1 text-sm text-red-600 hover:text-red-800 py-2 hover:bg-red-50 rounded transition-colors border border-red-200"
              >
                Clear All ({selectedFuelTypes.length})
              </button>
              <button
                onClick={() => {
                  // Select all fuel type options
                  const allValues = fuelTypeOptions.map((o) => o.value);
                  setSelectedFuelTypes(allValues);
                  setFilters((prev) => ({
                    ...prev,
                    fuel_type:
                      allValues.length === 1 ? allValues[0] : allValues,
                  }));
                }}
                className="flex-1 text-sm text-blue-600 hover:text-blue-800 py-2 hover:bg-blue-50 rounded transition-colors border border-blue-200"
                disabled={selectedFuelTypes.length === fuelTypeOptions.length}
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

export default CarFuelTypeFilter;