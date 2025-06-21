import { api } from "../api/axios";

// Dropdown API endpoints - updated to match common REST conventions
const DROPDOWN_ENDPOINTS = {
  buildingDirections: "/building-directions",
  constructionStatuses: "/construction-statuses",
  furnishingTypes: "/furnishing-types",
  listedBy: "/listed-by",
  maintenanceFrequencies: "/maintenance-frequencies",
  states: "/states",
  districts: "/get-districts", // Will use query params
  cities: "/get-cities", // Will use query params
  bhkTypes: "/get-bhk",
};

class DropdownService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache
  }

  // Update the generic fetch method to handle both GET and POST
  async fetchDropdownData(endpoint, params = {}, method = "GET") {
    const cacheKey = `${endpoint}_${JSON.stringify(params)}`;

    // Return cached data if still valid
    if (this.cache.has(cacheKey)) {
      const { data, timestamp } = this.cache.get(cacheKey);
      if (Date.now() - timestamp < this.cacheTimeout) {
        return data;
      }
      this.cache.delete(cacheKey); // Remove stale cache
    }

    try {
      let response;

      if (method === "POST") {
        // Handle POST requests with body
        response = await api.post(endpoint, params);
      } else {
        // Default to GET with query params
        response = await api.get(endpoint, { params });
      }

      if (!response.data) {
        throw new Error(`Empty response from ${endpoint}`);
      }

      // Cache the successful response
      this.cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
      });

      return response.data;
    } catch (error) {
      console.error(`DropdownService error for ${endpoint}:`, error);
      let errorMessage = `Failed to load ${endpoint.split("/").pop()}`;
      if (error.response) {
        errorMessage += ` (Status: ${error.response.status})`;
        if (error.response.data?.message) {
          errorMessage += `: ${error.response.data.message}`;
        }
      } else if (error.request) {
        errorMessage += ": No response received";
      }
      throw new Error(errorMessage);
    }
  }

  // Specific methods with improved parameter handling
  async getBuildingDirections() {
    return this.fetchDropdownData(DROPDOWN_ENDPOINTS.buildingDirections);
  }

  async getConstructionStatuses() {
    return this.fetchDropdownData(DROPDOWN_ENDPOINTS.constructionStatuses);
  }

  async getFurnishingTypes() {
    return this.fetchDropdownData(DROPDOWN_ENDPOINTS.furnishingTypes);
  }

  async getListedBy() {
    return this.fetchDropdownData(DROPDOWN_ENDPOINTS.listedBy);
  }

  async getMaintenanceFrequencies() {
    return this.fetchDropdownData(DROPDOWN_ENDPOINTS.maintenanceFrequencies);
  }

  async getStates() {
    return this.fetchDropdownData(DROPDOWN_ENDPOINTS.states);
  }

  // Then update the specific methods to use the appropriate HTTP method
  async getDistricts(stateId) {
    if (!stateId) {
      throw new Error("State ID is required to fetch districts");
    }
    return this.fetchDropdownData(
      DROPDOWN_ENDPOINTS.districts,
      { state_id: stateId },
      "POST" // Specify POST method
    );
  }

  async getCities(districtId) {
    if (!districtId) {
      throw new Error("District ID is required to fetch cities");
    }
    return this.fetchDropdownData(
      DROPDOWN_ENDPOINTS.cities,
      { district_id: districtId },
      'POST' // Specify POST method
    );
  }


  async getBHKTypes() {
    return this.fetchDropdownData(DROPDOWN_ENDPOINTS.bhkTypes);
  }

  // Improved preloading with progress tracking
  async preloadCommonDropdowns() {
    const dropdownsToPreload = [
      { name: "buildingDirections", method: this.getBuildingDirections },
      { name: "constructionStatuses", method: this.getConstructionStatuses },
      { name: "furnishingTypes", method: this.getFurnishingTypes },
      { name: "listedBy", method: this.getListedBy },
      {
        name: "maintenanceFrequencies",
        method: this.getMaintenanceFrequencies,
      },
      { name: "states", method: this.getStates },
      { name: "bhkTypes", method: this.getBHKTypes },
    ];

    const results = {};
    const errors = [];

    await Promise.all(
      dropdownsToPreload.map(async ({ name, method }) => {
        try {
          results[name] = await method.call(this);
        } catch (error) {
          errors.push({ name, error: error.message });
          results[name] = null;
        }
      })
    );

    if (errors.length > 0) {
      console.warn("Failed to preload some dropdowns:", errors);
    }

    return results;
  }

  // Get all dropdown data for a specific property type with better error recovery
  async getDropdownsForPropertyType(slug) {
    const commonDropdowns = {
      states: await this.getStates().catch(() => []),
      listedBy: await this.getListedBy().catch(() => []),
      buildingDirections: await this.getBuildingDirections().catch(() => []),
      constructionStatuses: await this.getConstructionStatuses().catch(
        () => []
      ),
      furnishingTypes: await this.getFurnishingTypes().catch(() => []),
      maintenanceFrequencies: await this.getMaintenanceFrequencies().catch(
        () => []
      ),
      bhkTypes: await this.getBHKTypes().catch(() => []),
    };

    const typeSpecificDropdowns = {
      // Land plots specific
      "lands-plots": {
        buildingDirections: await this.getBuildingDirections().catch(() => []),
      },
      // Residential properties
      "for-rent-houses-apartments": {
        constructionStatuses: await this.getConstructionStatuses().catch(
          () => []
        ),
        furnishingTypes: await this.getFurnishingTypes().catch(() => []),
        maintenanceFrequencies: await this.getMaintenanceFrequencies().catch(
          () => []
        ),
        bhkTypes: await this.getBHKTypes().catch(() => []),
      },
      
    };

    return {
      ...commonDropdowns,
      ...(typeSpecificDropdowns[slug] || {}),
    };
  }

  // Clear cache with optional key
  clearCache(key) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
}

// Create and export singleton instance
export const dropdownService = new DropdownService();

// Export individual methods for convenience
export const {
  getBuildingDirections,
  getConstructionStatuses,
  getFurnishingTypes,
  getListedBy,
  getMaintenanceFrequencies,
  getStates,
  getDistricts,
  getCities,
  getBHKTypes,
  preloadCommonDropdowns,
  getDropdownsForPropertyType,
} = dropdownService;