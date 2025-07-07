import { api } from "@/api/axios";

/**
 * Property Filter API Service
 * Handles all property filtering, search, and pagination functionality
 */

class PropertyFilterAPI {
  constructor() {
    this.baseEndpoint = "/filter";
    this.listEndpoint = "/properties/list";
  }

  /**
   * Build query parameters from filter object
   * @param {Object} filters - Filter parameters
   * @param {number} page - Page number for pagination
   * @returns {URLSearchParams} - Formatted query parameters
   */
  buildQueryParams(filters = {}, page = 1) {
    const params = new URLSearchParams();

    // Add page parameter
    params.append('page', page.toString());

    // Process each filter parameter
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        // Handle array values (if any)
        if (Array.isArray(value)) {
          value.forEach(v => params.append(`${key}[]`, v));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    return params;
  }

  /**
   * Apply filters to get property results
   * @param {Object} filters - Filter parameters
   * @param {number} page - Page number (default: 1)
   * @returns {Promise<Object>} - API response with filtered properties
   */
  async applyFilters(filters = {}, page = 1) {
    try {
      const params = this.buildQueryParams(filters, page);
      const response = await api.get(`${this.baseEndpoint}?${params.toString()}`);
      
      return this.formatResponse(response.data);
    } catch (error) {
      console.error("Error applying filters:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Get property list without filters (with location if available)
   * @param {number} page - Page number (default: 1)
   * @param {Object} location - Location coordinates {latitude, longitude}
   * @returns {Promise<Object>} - API response with properties
   */
  async getPropertyList(page = 1, location = null) {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());

      // Add location parameters if provided
      if (location && location.latitude && location.longitude) {
        params.append('latitude', location.latitude.toString());
        params.append('longitude', location.longitude.toString());
      }

      const response = await api.get(`${this.listEndpoint}?${params.toString()}`);
      
      return this.formatResponse(response.data?.data || response.data);
    } catch (error) {
      console.error("Error fetching property list:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Get location from localStorage (using existing Autocomplete location)
   * @returns {Object|null} - Location object or null
   */
  getLocationFromStorage() {
    try {
      const selectedLocationStr = localStorage.getItem('selectedLocation');
      
      if (!selectedLocationStr) {
        return null;
      }
      
      const selectedLocation = JSON.parse(selectedLocationStr);
      
      if (!selectedLocation.latitude || !selectedLocation.longitude) {
        return null;
      }
      
      return {
        latitude: parseFloat(selectedLocation.latitude),
        longitude: parseFloat(selectedLocation.longitude),
        address: selectedLocation.address || '',
        city: selectedLocation.city || '',
        state: selectedLocation.state || '',
        country: selectedLocation.country || ''
      };
    } catch (error) {
      console.error("Error reading selectedLocation from localStorage:", error);
      return null;
    }
  }

  /**
   * Search properties with filters and location
   * @param {Object} filters - Filter parameters
   * @param {number} page - Page number
   * @param {boolean} includeLocation - Whether to include location from storage
   * @returns {Promise<Object>} - Formatted response
   */
  async searchProperties(filters = {}, page = 1, includeLocation = true) {
    try {
      let searchFilters = { ...filters };

      // Include location from localStorage if requested and not already in filters
      if (includeLocation && !searchFilters.latitude && !searchFilters.longitude) {
        const location = this.getLocationFromStorage();
        if (location) {
          searchFilters.latitude = location.latitude;
          searchFilters.longitude = location.longitude;
        }
      }

      // Determine which endpoint to use
      const hasFilters = Object.keys(searchFilters).some(key => 
        !['latitude', 'longitude'].includes(key) && 
        searchFilters[key] !== '' && 
        searchFilters[key] !== null && 
        searchFilters[key] !== undefined
      );

      if (hasFilters) {
        return await this.applyFilters(searchFilters, page);
      } else {
        const location = searchFilters.latitude && searchFilters.longitude 
          ? { latitude: searchFilters.latitude, longitude: searchFilters.longitude }
          : null;
        return await this.getPropertyList(page, location);
      }
    } catch (error) {
      console.error("Error searching properties:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Format API response to ensure consistent structure
   * @param {Object} data - Raw API response data
   * @returns {Object} - Formatted response
   */
  formatResponse(data) {
    // Handle different response structures
    const responseData = data.data ? data : { data: data };
    
    return {
      data: responseData.data || [],
      pagination: {
        current_page: responseData.current_page || 1,
        last_page: responseData.last_page || 1,
        per_page: responseData.per_page || 10,
        total: responseData.total || 0,
        from: responseData.from || 0,
        to: responseData.to || 0,
        next_page_url: responseData.next_page_url || null,
        prev_page_url: responseData.prev_page_url || null,
        has_more: responseData.next_page_url !== null && 
                  responseData.current_page < responseData.last_page,
      },
      links: responseData.links || [],
      first_page_url: responseData.first_page_url,
      last_page_url: responseData.last_page_url,
      path: responseData.path,
      // Preserve original structure for compatibility
      ...responseData
    };
  }

  /**
   * Handle API errors consistently
   * @param {Error} error - Error object
   * @returns {Error} - Formatted error
   */
  handleError(error) {
    let errorMessage = "An error occurred while fetching properties";
    let statusCode = null;

    if (error.response) {
      statusCode = error.response.status;
      errorMessage = error.response.data?.message || 
        `Server error (${statusCode}): ${error.response.statusText}`;
    } else if (error.request) {
      errorMessage = "Network error: No response received from server";
    } else {
      errorMessage = error.message || errorMessage;
    }

    const customError = new Error(errorMessage);
    customError.statusCode = statusCode;
    customError.originalError = error;
    
    return customError;
  }

  /**
   * Validate filter parameters
   * @param {Object} filters - Filter object to validate
   * @returns {Object} - Validation result
   */
  validateFilters(filters) {
    const errors = [];
    const warnings = [];

    // Price range validation
    if (filters.price_range) {
      const pricePattern = /^\d+-\d+$/;
      if (!pricePattern.test(filters.price_range)) {
        errors.push("Invalid price range format. Expected format: '100000-200000'");
      }
    }

    // Area validation
    if (filters.super_area_min && filters.super_area_max) {
      const minArea = parseFloat(filters.super_area_min);
      const maxArea = parseFloat(filters.super_area_max);
      
      if (minArea >= maxArea) {
        errors.push("Minimum area must be less than maximum area");
      }
    }

    // Numeric validations
    const numericFields = ['bathroom_min', 'bedroom_min', 'super_area_min', 'super_area_max'];
    numericFields.forEach(field => {
      if (filters[field] && isNaN(parseFloat(filters[field]))) {
        errors.push(`${field} must be a valid number`);
      }
    });

    // ID validations (ensure they're valid integers)
    const idFields = [
      'furnished_id', 'bhk_id', 'maintenance_id', 'construction_status_id',
      'building_direction_id', 'subcategory_id'
    ];
    idFields.forEach(field => {
      if (filters[field] && (!Number.isInteger(parseFloat(filters[field])) || parseFloat(filters[field]) <= 0)) {
        errors.push(`${field} must be a positive integer`);
      }
    });

    // Location validation
    if ((filters.latitude && !filters.longitude) || (!filters.latitude && filters.longitude)) {
      warnings.push("Both latitude and longitude are required for location filtering");
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Get filter summary for display purposes
   * @param {Object} filters - Applied filters
   * @returns {Array} - Array of filter summaries
   */
  getFilterSummary(filters) {
    const summary = [];

    // Define filter labels and formatters
    const filterConfig = {
      price_range: {
        label: "Price Range",
        formatter: (value) => {
          const [min, max] = value.split('-');
          return `₹${parseInt(min).toLocaleString()} - ₹${parseInt(max).toLocaleString()}`;
        }
      },
      bathroom_min: {
        label: "Bathrooms",
        formatter: (value) => `${value}+ Bathrooms`
      },
      bedroom_min: {
        label: "Bedrooms", 
        formatter: (value) => `${value}+ Bedrooms`
      },
      super_area_min: {
        label: "Min Area",
        formatter: (value) => `${value}+ sq.ft`
      },
      super_area_max: {
        label: "Max Area",
        formatter: (value) => `${value} sq.ft`
      },
      // Add more as needed
    };

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '' && filterConfig[key]) {
        summary.push({
          key,
          label: filterConfig[key].label,
          value: filterConfig[key].formatter(value),
          rawValue: value
        });
      }
    });

    return summary;
  }

  /**
   * Convert filter object to URL-friendly query string
   * @param {Object} filters - Filter parameters
   * @returns {string} - Query string
   */
  filtersToQueryString(filters) {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });

    return params.toString();
  }

  /**
   * Parse query string back to filter object
   * @param {string} queryString - URL query string
   * @returns {Object} - Filter object
   */
  queryStringToFilters(queryString) {
    const params = new URLSearchParams(queryString);
    const filters = {};

    for (const [key, value] of params.entries()) {
      // Convert numeric strings back to numbers for specific fields
      const numericFields = ['bathroom_min', 'bedroom_min', 'super_area_min', 'super_area_max'];
      const idFields = [
        'furnished_id', 'bhk_id', 'maintenance_id', 'construction_status_id',
        'building_direction_id', 'subcategory_id'
      ];

      if (numericFields.includes(key) || idFields.includes(key)) {
        filters[key] = parseInt(value) || value;
      } else if (key === 'latitude' || key === 'longitude') {
        filters[key] = parseFloat(value) || value;
      } else {
        filters[key] = value;
      }
    }

    return filters;
  }

  /**
   * Save filters to localStorage
   * @param {Object} filters - Filter object to save
   * @param {string} key - Storage key (default: 'propertyFilters')
   */
  saveFiltersToStorage(filters, key = 'propertyFilters') {
    try {
      localStorage.setItem(key, JSON.stringify(filters));
    } catch (error) {
      console.warn("Failed to save filters to localStorage:", error);
    }
  }

  /**
   * Load filters from localStorage
   * @param {string} key - Storage key (default: 'propertyFilters')
   * @returns {Object} - Saved filters or empty object
   */
  loadFiltersFromStorage(key = 'propertyFilters') {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.warn("Failed to load filters from localStorage:", error);
      return {};
    }
  }

  /**
   * Clear saved filters from localStorage
   * @param {string} key - Storage key (default: 'propertyFilters')
   */
  clearSavedFilters(key = 'propertyFilters') {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn("Failed to clear saved filters:", error);
    }
  }
}

// Create and export singleton instance
export const propertyFilterAPI = new PropertyFilterAPI();

// Export class for potential extension
export { PropertyFilterAPI };

// Export convenience methods
export const {
  applyFilters,
  getPropertyList,
  searchProperties,
  validateFilters,
  getFilterSummary,
  filtersToQueryString,
  queryStringToFilters,
  saveFiltersToStorage,
  loadFiltersFromStorage,
  clearSavedFilters,
  getLocationFromStorage
} = propertyFilterAPI;