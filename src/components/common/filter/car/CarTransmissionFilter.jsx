import React, { useState, useEffect } from "react";
import { api } from "@/api/axios";
import SettingsIcon from "@mui/icons-material/Settings";
import DriveEtaIcon from "@mui/icons-material/DriveEta";

const CarTransmissionFilter = ({
  filters,
  setFilters,
  expandedSections,
  toggleSection,
}) => {
  const [transmissionTypes, setTransmissionTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTransmission, setSelectedTransmission] = useState([]);

  // Load transmission types from API on component mount
  useEffect(() => {
    fetchTransmissionTypes();
  }, []);

  // Set initial selected values from filters
  useEffect(() => {
    if (filters.transmission_id) {
      // Handle both single value and array
      const filterValues = Array.isArray(filters.transmission_id)
        ? filters.transmission_id
        : [filters.transmission_id];

      // Convert to strings since API returns string values
      const stringValues = filterValues
        .map((val) => String(val))
        .filter((val) => val && val !== "");
      setSelectedTransmission(stringValues);
      console.log("Setting initial transmission selection:", stringValues);
    } else {
      setSelectedTransmission([]);
    }
  }, [filters.transmission_id]);

  const fetchTransmissionTypes = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log(
        "🔄 Fetching transmission types from /car/get/transmission..."
      );
      const response = await api.get("/car/get/transmission");

      console.log("📥 Raw transmission response:", response);
      console.log("📦 Response data:", response.data);
      console.log("📊 Response status:", response.status);

      // Check if response has data
      if (!response.data) {
        throw new Error("No data received from API");
      }

      let transmissionData = response.data;

      // Handle different response formats
      if (response.data.data && Array.isArray(response.data.data)) {
        // If data is nested under 'data' property
        transmissionData = response.data.data;
        console.log("📋 Using nested data property:", transmissionData);
      } else if (!Array.isArray(response.data)) {
        throw new Error("Response data is not an array");
      }

      console.log("📝 Transmission data to process:", transmissionData);
      console.log("📏 Number of transmission types:", transmissionData.length);

      setTransmissionTypes(transmissionData);

      if (transmissionData.length === 0) {
        console.warn("⚠️ No transmission types found");
        setError("No transmission types available");
      }
    } catch (error) {
      console.error("❌ Error fetching transmission types:", error);
      console.error("❌ Error details:", {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data,
      });

      setError(error.message || "Failed to load transmission types");
      setTransmissionTypes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTransmissionSelect = (transmission) => {
    const isCurrentlySelected = selectedTransmission.includes(
      transmission.value
    );
    let newSelectedTransmission;

    if (isCurrentlySelected) {
      // Remove from selection
      newSelectedTransmission = selectedTransmission.filter(
        (val) => val !== transmission.value
      );
    } else {
      // Add to selection
      newSelectedTransmission = [...selectedTransmission, transmission.value];
    }

    console.log("⚙️ Transmission selection change:", {
      currentSelected: selectedTransmission,
      transmissionValue: transmission.value,
      transmissionLabel: transmission.label,
      isCurrentlySelected,
      newSelection: newSelectedTransmission,
    });

    setSelectedTransmission(newSelectedTransmission);

    // Update filters - send array or single value based on API requirements
    const filterValue =
      newSelectedTransmission.length === 0
        ? ""
        : newSelectedTransmission.length === 1
        ? newSelectedTransmission[0] // Single value for single selection
        : newSelectedTransmission; // Array for multiple selections

    setFilters((prev) => ({
      ...prev,
      transmission_id: filterValue,
    }));

    console.log("🔄 Updated transmission filter state:", {
      selected: newSelectedTransmission,
      filterValue: filterValue,
      count: newSelectedTransmission.length,
    });
  };

  const clearAllSelections = () => {
    console.log("🧹 Clearing all transmission selections");
    setSelectedTransmission([]);
    setFilters((prev) => ({
      ...prev,
      transmission_id: "",
    }));
  };

  const formatCount = (count) => {
    if (count >= 1000) {
      return `${Math.floor(count / 1000)}k+ vehicles`;
    }
    return `${count}+ vehicles`;
  };

  const getSelectedSummary = () => {
    if (selectedTransmission.length === 0) return "";

    const selectedLabels = selectedTransmission.map((value) => {
      const transmission = transmissionTypes.find((t) => t.value === value);
      return transmission?.label || value;
    });

    if (selectedLabels.length === 1) return selectedLabels[0];
    return `${selectedLabels.length} types`;
  };

  const getTransmissionIcon = (transmissionLabel) => {
    const label = transmissionLabel.toLowerCase();

    if (label.includes("manual")) {
      // Manual transmission icon
      return (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
          />
        </svg>
      );
    } else if (label.includes("automatic") || label.includes("auto")) {
      // Automatic transmission icon
      return (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      );
    } else if (label.includes("cvt")) {
      // CVT transmission icon
      return (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      );
    }

    // Default transmission icon
    return <SettingsIcon style={{ fontSize: 16 }} />;
  };

  const getTransmissionColor = (transmissionLabel) => {
    const label = transmissionLabel.toLowerCase();

    if (label.includes("manual")) {
      return "text-blue-500"; // Blue for manual
    } else if (label.includes("automatic") || label.includes("auto")) {
      return "text-green-500"; // Green for automatic
    } else if (label.includes("cvt")) {
      return "text-purple-500"; // Purple for CVT
    }

    return "text-gray-500"; // Default gray
  };

  if (loading) {
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center cursor-pointer py-2 border-b">
          <h2 className="font-medium text-gray-800 flex items-center">
            <SettingsIcon
              className="mr-2 text-gray-500"
              style={{ fontSize: 18 }}
            />
            Transmission
          </h2>
        </div>
        <div className="py-4 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">
            Loading transmission types...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center cursor-pointer py-2 border-b">
          <h2 className="font-medium text-gray-800 flex items-center">
            <SettingsIcon
              className="mr-2 text-gray-500"
              style={{ fontSize: 18 }}
            />
            Transmission
          </h2>
        </div>
        <div className="py-4 text-center">
          <div className="text-red-500 text-sm mb-2">⚠️ {error}</div>
          <button
            onClick={fetchTransmissionTypes}
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
        onClick={() => toggleSection && toggleSection("transmission")}
      >
        <h2 className="font-medium text-gray-800 flex items-center">
          <SettingsIcon
            className="mr-2 text-gray-500"
            style={{ fontSize: 18 }}
          />
          Transmission
          {selectedTransmission.length > 0 && (
            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {selectedTransmission.length} selected
            </span>
          )}
        </h2>
        {toggleSection && (
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${
              expandedSections?.transmission ? "rotate-180" : ""
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
          !toggleSection || expandedSections?.transmission
            ? "max-h-96 py-2"
            : "max-h-0"
        }`}
      >
        {/* Selection Summary */}
        {selectedTransmission.length > 0 && (
          <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
            <div className="flex justify-between items-center">
              <span className="text-blue-800 flex items-center">
                <SettingsIcon style={{ fontSize: 14 }} className="mr-1" />
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

        {transmissionTypes.length > 0 ? (
          <div className="grid grid-cols-1 gap-2">
            {transmissionTypes.map((transmission, index) => {
              const isSelected = selectedTransmission.includes(
                transmission.value
              );
              const iconColorClass = getTransmissionColor(transmission.label);

              return (
                <div
                  key={transmission.value || index}
                  className={`rounded text-sm p-4 flex justify-between gap-[15px] cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "bg-blue-100 border-2 border-blue-500 shadow-sm"
                      : "bg-gray-100 hover:bg-blue-50 hover:border-blue-300 border-2 border-transparent"
                  }`}
                  onClick={() => handleTransmissionSelect(transmission)}
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

                    {/* Transmission icon with color coding */}
                    <div className={`mr-2 ${iconColorClass}`}>
                      {getTransmissionIcon(transmission.label)}
                    </div>

                    <span
                      className={`font-medium ${
                        isSelected ? "text-blue-800" : ""
                      }`}
                    >
                      {transmission.label}
                    </span>
                  </div>

                  <div
                    className={`text-xs flex items-center ${
                      isSelected ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {transmission.count !== undefined
                      ? formatCount(transmission.count)
                      : "0 vehicles"}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4">
            <SettingsIcon
              className="mx-auto text-gray-400 mb-2"
              style={{ fontSize: 32 }}
            />
            <p className="text-gray-500 text-sm">
              No transmission types available
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Check console for details
            </p>
            <button
              onClick={fetchTransmissionTypes}
              className="mt-2 text-blue-600 text-sm hover:underline"
            >
              Retry Loading
            </button>
          </div>
        )}

        {/* Action Buttons */}
        {selectedTransmission.length > 0 && (
          <div className="mt-3 pt-2 border-t space-y-2">
            <div className="flex gap-2">
              <button
                onClick={clearAllSelections}
                className="flex-1 text-sm text-red-600 hover:text-red-800 py-2 hover:bg-red-50 rounded transition-colors border border-red-200"
              >
                Clear All ({selectedTransmission.length})
              </button>
              <button
                onClick={() => {
                  // Select all transmission types
                  const allValues = transmissionTypes.map((t) => t.value);
                  setSelectedTransmission(allValues);
                  setFilters((prev) => ({
                    ...prev,
                    transmission_id:
                      allValues.length === 1 ? allValues[0] : allValues,
                  }));
                }}
                className="flex-1 text-sm text-blue-600 hover:text-blue-800 py-2 hover:bg-blue-50 rounded transition-colors border border-blue-200"
                disabled={
                  selectedTransmission.length === transmissionTypes.length
                }
              >
                Select All
              </button>
            </div>
          </div>
        )}

        {/* Additional Info with Transmission Type Legend */}
        {transmissionTypes.length > 0 && (
          <div className="mt-3 pt-2 border-t">
            <div className="text-xs text-gray-500 text-center mb-2">
              💡 Choose based on your driving preference
            </div>
            <div className="flex justify-center items-center space-x-3 text-xs">
              <div className="flex items-center">
                <div className="text-blue-500 mr-1">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                    />
                  </svg>
                </div>
                <span>Manual</span>
              </div>
              <div className="flex items-center">
                <div className="text-green-500 mr-1">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <span>Automatic</span>
              </div>
              <div className="flex items-center">
                <div className="text-purple-500 mr-1">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
                <span>CVT</span>
              </div>
            </div>
          </div>
        )}

       
      </div>
    </div>
  );
};

export default CarTransmissionFilter;
