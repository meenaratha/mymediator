import React, { useState, useEffect } from "react";
import { api } from "@/api/axios";

const CategoriesSection = ({ 
  filters, 
  setFilters, 
  expandedSections, 
  toggleSection 
}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]); // Array for multi-select

  // Load categories from API on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Set initial selected values from filters
  useEffect(() => {
    if (filters.subcategory_id) {
      // Handle both single value and array
      const filterValues = Array.isArray(filters.subcategory_id) 
        ? filters.subcategory_id 
        : [filters.subcategory_id];
      
      setSelectedCategories(filterValues.filter(val => val && val !== ""));
    } else {
      setSelectedCategories([]);
    }
  }, [filters.subcategory_id]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get('/categories/1/subcategories');
      console.log("Categories response:", response.data);
      
      // Handle different response formats
      let categoriesData = [];
      if (response.data && Array.isArray(response.data)) {
        categoriesData = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        categoriesData = response.data.data;
      } else if (response.data && response.data.subcategories && Array.isArray(response.data.subcategories)) {
        categoriesData = response.data.subcategories;
      }

      // Format categories data based on your exact response structure
      const formattedCategories = categoriesData.map(item => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        form_type: item.form_type,
        category: item.category,
        image_url: item.image_url,
        value: item.id.toString(), // Use ID as value for filtering
        label: item.name, // Display name
        description: `${item.form_type} - ${item.category?.name || 'Property'}`,
        count: item.count || item.property_count || 0 // Add count if available in your API
      }));

      setCategories(formattedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (category) => {
    const isCurrentlySelected = selectedCategories.includes(category.value);
    let newSelectedCategories;
    
    if (isCurrentlySelected) {
      // Remove from selection
      newSelectedCategories = selectedCategories.filter(val => val !== category.value);
    } else {
      // Add to selection
      newSelectedCategories = [...selectedCategories, category.value];
    }
    
    console.log("Category multi-selection:", {
      currentSelected: selectedCategories,
      categoryValue: category.value,
      isCurrentlySelected,
      newSelection: newSelectedCategories
    });
    
    setSelectedCategories(newSelectedCategories);
    
    // Update filters - send array or single value based on API requirements
    const filterValue = newSelectedCategories.length === 0 
      ? "" 
      : newSelectedCategories.length === 1 
        ? newSelectedCategories[0] // Single value for single selection
        : newSelectedCategories; // Array for multiple selections
    
    setFilters(prev => ({
      ...prev,
      subcategory_id: filterValue
    }));

    console.log("Selected categories:", {
      selected: newSelectedCategories,
      filterValue: filterValue,
      count: newSelectedCategories.length
    });
  };

  const clearAllSelections = () => {
    setSelectedCategories([]);
    setFilters(prev => ({
      ...prev,
      subcategory_id: ""
    }));
  };

  const formatCount = (count) => {
    if (count >= 1000) {
      return `${Math.floor(count / 1000)}k+ properties`;
    }
    return `${count}+ properties`;
  };

  const getSelectedSummary = () => {
    if (selectedCategories.length === 0) return "";
    if (selectedCategories.length === 1) {
      const category = categories.find(c => c.value === selectedCategories[0]);
      return category?.label || selectedCategories[0];
    }
    return `${selectedCategories.length} categories`;
  };

  if (loading) {
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center cursor-pointer py-2 border-b">
          <h2 className="font-medium text-gray-800">Categories</h2>
        </div>
        <div className="py-4 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div
        className="flex justify-between items-center cursor-pointer py-2 border-b"
        onClick={() => toggleSection("categories")}
      >
        <h2 className="font-medium text-gray-800">
          Categories
          {selectedCategories.length > 0 && (
            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              {selectedCategories.length} selected
            </span>
          )}
        </h2>
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${
            expandedSections.categories ? "rotate-180" : ""
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
          expandedSections.categories
            ? "max-h-96 py-2"
            : "max-h-0 overflow-hidden"
        }`}
      >
        {/* Header Info */}
        {/* <div className="font-medium text-sm text-green-600 py-2 border-b border-green-100 mb-3">
          Property sale & Rent in Chennai
        </div> */}

        {/* Selection Summary */}
        {selectedCategories.length > 0 && (
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

        {categories.length > 0 ? (
          <div className="space-y-2">
            {categories.map((category) => {
              const isSelected = selectedCategories.includes(category.value);

              return (
                <div
                  key={category.id}
                  className={`rounded text-sm p-3 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "bg-green-100 border-2 border-green-500 shadow-sm"
                      : "bg-gray-50 hover:bg-green-50 hover:border-green-300 border-2 border-transparent"
                  }`}
                  onClick={() => handleCategorySelect(category)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {/* Checkbox style indicator */}
                      <div
                        className={`w-4 h-4 mr-3 rounded-full flex items-center justify-center ${
                          isSelected ? "bg-green-500" : "bg-gray-400"
                        }`}
                      >
                        {isSelected && (
                          <svg
                            className="w-1 h-1 text-white"
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
                      <div>
                        <span
                          className={`font-medium ${
                            isSelected ? "text-green-800" : ""
                          }`}
                        >
                          {category.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm">No categories available</p>
            <button
              onClick={fetchCategories}
              className="mt-2 text-green-600 text-sm hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Action Buttons */}
        {selectedCategories.length > 0 && (
          <div className="mt-3 pt-2 border-t space-y-2">
            <div className="flex gap-2">
              <button
                onClick={clearAllSelections}
                className="flex-1 text-sm text-red-600 hover:text-red-800 py-2 hover:bg-red-50 rounded transition-colors border border-red-200"
              >
                Clear All ({selectedCategories.length})
              </button>
              <button
                onClick={() => {
                  // Select all categories
                  const allValues = categories.map((c) => c.value);
                  setSelectedCategories(allValues);
                  setFilters((prev) => ({
                    ...prev,
                    subcategory_id:
                      allValues.length === 1 ? allValues[0] : allValues,
                  }));
                }}
                className="flex-1 text-sm text-green-600 hover:text-green-800 py-2 hover:bg-green-50 rounded transition-colors border border-green-200"
                disabled={selectedCategories.length === categories.length}
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

export default CategoriesSection;