// Auto-population handler that properly sequences dependent dropdown loading

import { useDispatch, useSelector } from "react-redux";
import {
  populateFormFromApi,
  setAutoPopulating,
  setLoading,
  setApiError,
  selectIsAutoPopulating,
} from "./propertyFormSlice";
import { dropdownService } from "./dropdownService";

export const useAutoPopulateWithDependentDropdowns = () => {
  const dispatch = useDispatch();
  const isAutoPopulating = useSelector(selectIsAutoPopulating);

  const autoPopulateForm = async (apiData) => {
    try {
      console.log("Starting auto-population with data:", apiData);

      // Set loading and auto-populating flags
      dispatch(setLoading(true));
      dispatch(setAutoPopulating(true));

      // Step 1: Populate the form with API data first
      dispatch(populateFormFromApi(apiData));

      // Step 2: If we have dependent dropdown data, preload them in sequence
      if (apiData.state_id || apiData.state) {
        const stateId = apiData.state_id || apiData.state;

        try {
          // Load districts for the state
          console.log("Preloading districts for state:", stateId);
          const districtsResponse = await dropdownService.getDistricts(stateId);
          console.log("Districts loaded:", districtsResponse);

          // If we also have district data, load cities
          if ((apiData.district_id || apiData.district) && districtsResponse) {
            const districtId = apiData.district_id || apiData.district;

            try {
              console.log("Preloading cities for district:", districtId);
              const citiesResponse = await dropdownService.getCities(
                districtId
              );
              console.log("Cities loaded:", citiesResponse);
            } catch (cityError) {
              console.warn("Failed to preload cities:", cityError);
              // Don't throw - we can still show the form with state and district
            }
          }
        } catch (districtError) {
          console.warn("Failed to preload districts:", districtError);
          // Don't throw - we can still show the form with state selected
        }
      }

      console.log("Auto-population completed successfully");

      // Reset flags after a brief delay to allow React to process updates
      setTimeout(() => {
        dispatch(setAutoPopulating(false));
        dispatch(setLoading(false));
      }, 200);
    } catch (error) {
      console.error("Error during auto-population:", error);
      dispatch(setApiError("Failed to auto-populate form data"));
      dispatch(setAutoPopulating(false));
      dispatch(setLoading(false));
      throw error;
    }
  };

  const preloadDependentDropdowns = async (stateId, districtId = null) => {
    const results = {
      districts: [],
      cities: [],
    };

    try {
      if (stateId) {
        console.log("Preloading districts for state:", stateId);
        const districtsResponse = await dropdownService.getDistricts(stateId);
        results.districts = Array.isArray(districtsResponse)
          ? districtsResponse
          : districtsResponse?.data || [];

        if (districtId && results.districts.length > 0) {
          console.log("Preloading cities for district:", districtId);
          const citiesResponse = await dropdownService.getCities(districtId);
          results.cities = Array.isArray(citiesResponse)
            ? citiesResponse
            : citiesResponse?.data || [];
        }
      }
    } catch (error) {
      console.error("Error preloading dependent dropdowns:", error);
    }

    return results;
  };

  return {
    autoPopulateForm,
    preloadDependentDropdowns,
    isAutoPopulating,
  };
};

// Hook for handling form initialization with auto-population
export const useFormInitialization = (propertyId, slug) => {
  const dispatch = useDispatch();
  const { autoPopulateForm } = useAutoPopulateWithDependentDropdowns();

  const initializeForm = async () => {
    if (!propertyId) return;

    try {
      dispatch(setLoading(true));

      // Fetch property data from API
      const response = await api.get(`/properties/${propertyId}`);
      const propertyData = response.data;

      // Transform API response to match expected format if needed
      const transformedData = transformApiDataToFormFormat(propertyData);

      // Auto-populate form with proper dependent dropdown handling
      await autoPopulateForm(transformedData);
    } catch (error) {
      console.error("Failed to initialize form:", error);
      dispatch(setApiError("Failed to load property data"));
      dispatch(setLoading(false));
    }
  };

  return { initializeForm };
};

// Helper function to transform API data to form format
const transformApiDataToFormFormat = (apiData) => {
  // Handle different API response formats
  const transformed = {
    // Basic fields with fallbacks
    property_name: apiData.property_name || apiData.name || apiData.title,
    mobile_number: apiData.mobile_number || apiData.mobile || apiData.phone,
    address: apiData.address,
    description: apiData.description,

    // Location fields - ensure we use IDs for dependent dropdowns
    state_id: apiData.state_id || apiData.state?.id || apiData.state,
    district_id:
      apiData.district_id || apiData.district?.id || apiData.district,
    city_id: apiData.city_id || apiData.city?.id || apiData.city,

    // Room details
    bathroom: apiData.bathroom || apiData.bathrooms,
    bedrooms: apiData.bedrooms || apiData.bedroom,
    wash_room: apiData.wash_room || apiData.washroom,
    bhk_id: apiData.bhk_id || apiData.bhk,

    // Property features
    furnished_id: apiData.furnished_id || apiData.furnished,
    listed_by: apiData.listed_by || apiData.listedBy,
    construction_status_id:
      apiData.construction_status_id || apiData.constructionStatus,
    maintenance_id: apiData.maintenance_id || apiData.maintenance,
    bachelor: apiData.bachelor,

    // Area measurements
    super_builtup_area: apiData.super_builtup_area || apiData.superBuildArea,
    carpet_area: apiData.carpet_area || apiData.carpetArea,
    plot_area: apiData.plot_area || apiData.plotArea,
    length: apiData.length,
    breadth: apiData.breadth,

    // Building details
    building_direction_id:
      apiData.building_direction_id || apiData.buildingDirection,
    floor_no: apiData.floor_no || apiData.floorNumber,
    total_floors: apiData.total_floors || apiData.totalFloor,

    // Parking
    bike_parking: apiData.bike_parking || apiData.bikeParking,
    car_parking: apiData.car_parking || apiData.carParking,

    // Financial
    amount: apiData.amount || apiData.price || apiData.rent,

    // Media
    images: apiData.images || [],
    videos: apiData.videos || [],
  };

  // Remove undefined values
  Object.keys(transformed).forEach((key) => {
    if (transformed[key] === undefined) {
      delete transformed[key];
    }
  });

  return transformed;
};

// Usage example in component
export const PropertyEditForm = ({ propertyId, slug }) => {
  const { initializeForm } = useFormInitialization(propertyId, slug);

  useEffect(() => {
    if (propertyId) {
      initializeForm();
    }
  }, [propertyId]);

  return <PropertyFormComponent />;
};

// Manual auto-populate example
export const useManualAutoPopulate = () => {
  const { autoPopulateForm } = useAutoPopulateWithDependentDropdowns();

  const handleAutoPopulate = async () => {
    const sampleData = {
      property_name: "Sample Property",
      mobile_number: "9876543210",
      address: "123 Sample Street",
      state_id: "1", // Must be ID that exists in your states dropdown
      district_id: "5", // Must be ID that exists for the selected state
      city_id: "25", // Must be ID that exists for the selected district
      bedrooms: "3",
      bathroom: "2",
      amount: "5000000",
    };

    try {
      await autoPopulateForm(sampleData);
      console.log("Manual auto-populate completed");
    } catch (error) {
      console.error("Manual auto-populate failed:", error);
    }
  };

  return { handleAutoPopulate };
};
