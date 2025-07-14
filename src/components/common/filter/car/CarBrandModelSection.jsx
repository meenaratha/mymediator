import React, { useState, useEffect } from "react";
import { api } from "@/api/axios";

const CarBrandModelSection = ({
  filters,
  setFilters,
  expandedSections,
  toggleSection,
}) => {
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modelsLoading, setModelsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedModels, setSelectedModels] = useState([]);
  
    // Load brands from API on component mount and when subcategory changes
    useEffect(() => {
      fetchBrands();
    }, [filters.subcategory_id]); // Re-fetch when subcategory changes
  
    // Load models when brands are selected
    useEffect(() => {
      if (selectedBrands.length > 0) {
        // Fetch models for all selected brands
        selectedBrands.forEach((brandId) => {
          fetchModels(brandId);
        });
      } else {
        setModels([]);
      }
    }, [selectedBrands]);
  
    // Set initial selected values from filters (excluding subcategory changes)
    useEffect(() => {
      if (filters.brand_id) {
        const filterBrands = Array.isArray(filters.brand_id)
          ? filters.brand_id
          : [filters.brand_id];
        setSelectedBrands(filterBrands.filter((val) => val && val !== ""));
      } else {
        setSelectedBrands([]);
      }
  
      if (filters.model_id) {
        const filterModels = Array.isArray(filters.model_id)
          ? filters.model_id
          : [filters.model_id];
        setSelectedModels(filterModels.filter((val) => val && val !== ""));
      } else {
        setSelectedModels([]);
      }
    }, [filters.brand_id, filters.model_id]);
  
    // Clear selections when subcategory changes
    useEffect(() => {
      // Clear brand and model selections when subcategory changes
      setSelectedBrands([]);
      setSelectedModels([]);
      setModels([]);
      setFilters((prev) => ({
        ...prev,
        brand: "",
        model: "",
      }));
    }, [filters.subcategory_id]);
  
    const fetchBrands = async () => {
      setLoading(true);
      try {
        // Build the request based on whether subcategory_id exists
        let response;
        if (filters.subcategory_id) {
          // Use POST request with subcategory_id in body
          response = await api.get(
            `/car/get/brands?subcategory_id=${filters.subcategory_id}`
          );
        } else {
          // Use GET request without subcategory_id
          response = await api.get("/car/get/brands");
        }
  
        console.log("Brands response:", response.data);
  
        if (
          response.data &&
          response.data.brands &&
          Array.isArray(response.data.brands)
        ) {
          setBrands(response.data.brands);
        } else {
          console.error("Invalid brands response format");
          setBrands([]);
        }
      } catch (error) {
        console.error("Error fetching brands:", error);
        setBrands([]);
      } finally {
        setLoading(false);
      }
    };
  
    const fetchModels = async (brandId) => {
      setModelsLoading(true);
      try {
        const response = await api.post("/car/get/models/by-brand", {
          brand_id: brandId,
          // ...(filters.subcategory_id && {
          //   subcategory_id: filters.subcategory_id,
          // }),
        });
        console.log("Models response for brand", brandId, ":", response.data);
  
        if (
          response.data &&
          response.data.models &&
          Array.isArray(response.data.models)
        ) {
          // Add brand_id to each model for identification
          const modelsWithBrandId = response.data.models.map((model) => ({
            ...model,
            brand_id: brandId,
          }));
  
          // Update models state - append new models or replace existing ones from same brand
          setModels((prevModels) => {
            const filteredModels = prevModels.filter(
              (model) => model.brand_id !== brandId
            );
            return [...filteredModels, ...modelsWithBrandId];
          });
        }
      } catch (error) {
        console.error("Error fetching models for brand", brandId, ":", error);
      } finally {
        setModelsLoading(false);
      }
    };
  
    const handleBrandSelect = (brand) => {
      const isCurrentlySelected = selectedBrands.includes(brand.id);
      let newSelectedBrands;
  
      if (isCurrentlySelected) {
        // Remove from selection
        newSelectedBrands = selectedBrands.filter((id) => id !== brand.id);
        // Also remove related models
        setSelectedModels((prevModels) =>
          prevModels.filter((modelId) => {
            const model = models.find((m) => m.id === modelId);
            return model && model.brand_id !== brand.id;
          })
        );
      } else {
        // Add to selection
        newSelectedBrands = [...selectedBrands, brand.id];
      }
  
      setSelectedBrands(newSelectedBrands);
  
      // Update filters
      const brandFilterValue =
        newSelectedBrands.length === 0
          ? ""
          : newSelectedBrands.length === 1
          ? newSelectedBrands[0]
          : newSelectedBrands;
  
      setFilters((prev) => ({
        ...prev,
        brand: brandFilterValue,
      }));
    };
  
    const handleModelSelect = (model) => {
      const isCurrentlySelected = selectedModels.includes(model.id);
      let newSelectedModels;
  
      if (isCurrentlySelected) {
        // Remove from selection
        newSelectedModels = selectedModels.filter((id) => id !== model.id);
      } else {
        // Add to selection
        newSelectedModels = [...selectedModels, model.id];
      }
  
      setSelectedModels(newSelectedModels);
  
      // Update filters
      const modelFilterValue =
        newSelectedModels.length === 0
          ? ""
          : newSelectedModels.length === 1
          ? newSelectedModels[0]
          : newSelectedModels;
  
      setFilters((prev) => ({
        ...prev,
        model: modelFilterValue,
      }));
    };
  
    const clearAllSelections = () => {
      setSelectedBrands([]);
      setSelectedModels([]);
      setModels([]);
      setFilters((prev) => ({
        ...prev,
        brand: "",
        model: "",
      }));
    };
  
    const formatCount = (count) => {
      if (count === null || count === undefined) return "0";
      if (count >= 1000) {
        return `${Math.floor(count / 1000)}k+`;
      }
      return count.toString();
    };
  
    // Filter brands based on search term
    const filteredBrands = brands.filter((brand) =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    // Filter models based on search term
    const filteredModels = models.filter((model) =>
      model.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const getSelectedBrandNames = () => {
      return brands
        .filter((brand) => selectedBrands.includes(brand.id))
        .map((brand) => brand.name);
    };
  
    const getSelectedModelNames = () => {
      return models
        .filter((model) => selectedModels.includes(model.id))
        .map((model) => model.name);
    };
  
    if (loading) {
      return (
        <div className="mb-4">
          <div className="flex justify-between items-center cursor-pointer py-2 border-b">
            <h2 className="font-medium text-gray-800">Brand & Model</h2>
          </div>
          <div className="py-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Loading brands...</p>
          </div>
        </div>
      );
    }
  
    return (
      <div className="mb-4">
        <div
          className="flex justify-between items-center cursor-pointer py-2 border-b"
          onClick={() => toggleSection("brand")}
        >
          <h2 className="font-medium text-gray-800">
            Brand & Model
            {(selectedBrands.length > 0 || selectedModels.length > 0) && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {selectedBrands.length + selectedModels.length} selected
              </span>
            )}
          </h2>
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${
              expandedSections.brand ? "rotate-180" : ""
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
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            expandedSections.brand ? "max-h-[800px] py-2" : "max-h-0"
          }`}
        >
          {/* Search bar */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search your Brand & Model"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-8 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute left-2 top-2.5 w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
  
          {/* Selection Summary */}
          {(selectedBrands.length > 0 || selectedModels.length > 0) && (
            <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
              <div className="flex justify-between items-start">
                <div>
                  {selectedBrands.length > 0 && (
                    <div className="mb-1">
                      <span className="text-blue-800 font-medium">Brands: </span>
                      <span className="text-blue-600">
                        {getSelectedBrandNames().join(", ")}
                      </span>
                    </div>
                  )}
                  {selectedModels.length > 0 && (
                    <div>
                      <span className="text-blue-800 font-medium">Models: </span>
                      <span className="text-blue-600">
                        {getSelectedModelNames().join(", ")}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={clearAllSelections}
                  className="text-blue-600 hover:text-blue-800 text-xs underline ml-2"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
  
          {/* Select Brand Section */}
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Select Brand</h3>
            <div className="h-40 overflow-y-auto rounded-md p-2 border">
              {filteredBrands.length > 0 ? (
                filteredBrands.map((brand) => {
                  const isSelected = selectedBrands.includes(brand.id);
  
                  return (
                    <div
                      key={brand.id}
                      className={`flex items-center py-1 px-2 rounded cursor-pointer transition-colors ${
                        isSelected ? "bg-blue-100" : "hover:bg-gray-100"
                      }`}
                      onClick={() => handleBrandSelect(brand)}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleBrandSelect(brand)}
                        className="mr-2 h-4 w-4"
                      />
                      <label className="text-sm cursor-pointer flex-1">
                        {brand.name} ({formatCount(brand.car_count)})
                      </label>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">
                    {searchTerm
                      ? "No brands match your search"
                      : "No brands available"}
                  </p>
                </div>
              )}
            </div>
          </div>
  
          {/* Select Model Section */}
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">
              Select Model
              {modelsLoading && (
                <span className="ml-2 text-xs text-blue-600">Loading...</span>
              )}
            </h3>
            <div className="h-40 overflow-y-auto rounded-md p-2 border">
              {selectedBrands.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">
                    Please select a brand first to see available models
                  </p>
                </div>
              ) : filteredModels.length > 0 ? (
                filteredModels.map((model) => {
                  const isSelected = selectedModels.includes(model.id);
  
                  return (
                    <div
                      key={model.id}
                      className={`flex items-center py-1 px-2 rounded cursor-pointer transition-colors ${
                        isSelected ? "bg-blue-100" : "hover:bg-gray-100"
                      }`}
                      onClick={() => handleModelSelect(model)}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleModelSelect(model)}
                        className="mr-2 h-4 w-4"
                      />
                      <label className="text-sm cursor-pointer flex-1">
                        {model.name} ({formatCount(model.car_count)})
                      </label>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">
                    {modelsLoading
                      ? "Loading models..."
                      : searchTerm
                      ? "No models match your search"
                      : "No models available for selected brands"}
                  </p>
                </div>
              )}
            </div>
          </div>
  
          {/* Action Buttons */}
          {(selectedBrands.length > 0 || selectedModels.length > 0) && (
            <div className="mt-3 pt-2 border-t space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={clearAllSelections}
                  className="flex-1 text-sm text-red-600 hover:text-red-800 py-2 hover:bg-red-50 rounded transition-colors border border-red-200"
                >
                  Clear All
                </button>
                <button
                  onClick={() => {
                    // Select all visible brands
                    const allBrandIds = filteredBrands.map((b) => b.id);
                    setSelectedBrands(allBrandIds);
                    setFilters((prev) => ({
                      ...prev,
                      brand:
                        allBrandIds.length === 1 ? allBrandIds[0] : allBrandIds,
                    }));
                  }}
                  className="flex-1 text-sm text-blue-600 hover:text-blue-800 py-2 hover:bg-blue-50 rounded transition-colors border border-blue-200"
                >
                  Select All Brands
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
};

export default CarBrandModelSection;
