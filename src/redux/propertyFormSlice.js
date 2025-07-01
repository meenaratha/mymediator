import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: {
    // Basic Information
    form_type: "",
    propertyName: "",
    mobileNumber: "",
    address: "",
    latitude: "",
    longitude:"",
    state: "",
    district: "",
    city: "",
    description: "",

    // Room Details
    bathroom: "",
    bedroom: "",
    washRoom: "",
    bhk: "",

    // Property Features
    furnished: "",
    listedBy: "",
    constructionStatus: "",
    maintenance: "",
    bachelor: "",

    // Area Measurements
    superBuildArea: "",
    carpetArea: "",
    plotArea: "",
    length: "",
    breadth: "",

    // Building Details
    buildingDirection: "",
    floorNumber: "",
    totalFloor: "",

    // Parking
    bikeParking: "",
    carParking: "",

    // Financial
    amount: "",

    // Media
    images: [],
    videos: [],

    action_id: null,
    media_to_delete: "", // Add this field
  },
  mediaToDelete: {
    images: [],
    videos: [],
  },
  errors: {},
  touched: {},
  focusedField: null,
  // New state for API handling
  isLoading: false,
  apiError: null,
  autoPopulateData: null,
  // Add flag to track if we're auto-populating to prevent cascading dropdown resets
  isAutoPopulating: false,
};


const propertyFormSlice = createSlice({
  name: "propertyform",
  initialState,
  reducers: {
    setFormData: (state, action) => {
      state.formData = action.payload;
    },

    // update specific fields
    updateFormField: (state, action) => {
      const { field, value } = action.payload;
      state.formData[field] = value;
    },

    setErrors: (state, action) => {
      state.errors = action.payload;
    },

    setTouched: (state, action) => {
      state.touched[action.payload] = true;
    },

    setAllTouched: (state, action) => {
      state.touched = { ...state.touched, ...action.payload };
    },

    setFocusedField: (state, action) => {
      state.focusedField = action.payload;
    },

    clearFocusedField: (state) => {
      state.focusedField = null;
    },

    clearError: (state, action) => {
      const fieldName = action.payload;
      if (state.errors[fieldName]) {
        state.errors[fieldName] = "";
      }
    },

    // File handling actions
    addFiles: (state, action) => {
      const { type, files } = action.payload;
      if (!state.formData[type]) {
        state.formData[type] = [];
      }

      const currentFiles = [...state.formData[type]];
      files.forEach((file) => {
        currentFiles.push(file);
      });

      state.formData[type] = currentFiles;
      console.log(`Added files to ${type}, new count: ${currentFiles.length}`);
    },

    // Updated removeFile reducer
    // removeFile: (state, action) => {
    //   const { type, index } = action.payload;
    //   if (state.formData[type] && state.formData[type].length > index) {
    //     const fileToRemove = state.formData[type][index];

    //     // If file has an ID (existing media from backend)
    //     if (fileToRemove.id) {
    //       const currentIds = state.formData.media_to_delete
    //         ? state.formData.media_to_delete.split(",")
    //         : [];

    //       // Add the ID if not already present
    //       if (!currentIds.includes(fileToRemove.id.toString())) {
    //         const newIds = [...currentIds, fileToRemove.id.toString()].join(
    //           ","
    //         );
    //         state.formData.media_to_delete = newIds;
    //       }
    //     }

    //     // Remove the file from the array
    //     state.formData[type] = state.formData[type].filter(
    //       (_, i) => i !== index
    //     );
    //   }
    // },

    // Updated clearFiles reducer
    // clearFiles: (state, action) => {
    //   const type = action.payload;
    //   const files = state.formData[type] || [];

    //   // Get IDs of all existing media files being cleared
    //   const idsToDelete = files
    //     .filter((file) => file.id)
    //     .map((file) => file.id.toString());

    //   if (idsToDelete.length > 0) {
    //     const currentIds = state.formData.media_to_delete
    //       ? state.formData.media_to_delete.split(",")
    //       : [];

    //     // Combine with existing IDs, remove duplicates
    //     const allIds = [...new Set([...currentIds, ...idsToDelete])].join(",");
    //     state.formData.media_to_delete = allIds;
    //   }

    //   // Clear the files array
    //   state.formData[type] = [];
    // },

    // Add this new reducer to manually update media_to_delete
    updateMediaToDelete: (state, action) => {
      state.formData.media_to_delete = action.payload;
    },

    // Add this to your reducers
    addMediaToDelete: (state, action) => {
      const { id } = action.payload;
      const currentIds = state.formData.media_to_delete
        ? state.formData.media_to_delete.split(",")
        : [];

      if (!currentIds.includes(id.toString())) {
        const newIds = [...currentIds, id.toString()].join(",");
        state.formData.media_to_delete = newIds;
      }
    },

    // In your propertyFormSlice.js

    // Add these reducers to your propertyFormSlice

    // Action to add specific media IDs to deletion list
    addToMediaDeleteList: (state, action) => {
      const { id } = action.payload;
      const currentIds = state.formData.media_to_delete
        ? state.formData.media_to_delete.split(",")
        : [];

      if (id && !currentIds.includes(id.toString())) {
        const newIds = [...currentIds, id.toString()].join(",");
        state.formData.media_to_delete = newIds;
      }
    },

    // Updated removeFile reducer
    removeFile: (state, action) => {
      const { type, index } = action.payload;
      if (state.formData[type] && state.formData[type].length > index) {
        const file = state.formData[type][index];

        // Add to delete list if it's an existing media file
        if (file?.media_image_id) {
          const currentIds = state.formData.media_to_delete
            ? state.formData.media_to_delete.split(",")
            : [];

          if (!currentIds.includes(file.media_image_id.toString())) {
            const newIds = [...currentIds, file.media_image_id.toString()].join(
              ","
            );
            state.formData.media_to_delete = newIds;
          }
        }

        // Remove from current files
        state.formData[type] = state.formData[type].filter(
          (_, i) => i !== index
        );
      }
    },

    // Updated clearFiles reducer
    clearFiles: (state, action) => {
      const type = action.payload;
      const files = state.formData[type] || [];

      // Get all media_image_ids being cleared
      const idsToDelete = files
        .filter((file) => file?.media_image_id)
        .map((file) => file.media_image_id.toString());

      if (idsToDelete.length > 0) {
        const currentIds = state.formData.media_to_delete
          ? state.formData.media_to_delete.split(",")
          : [];

        const allIds = [...new Set([...currentIds, ...idsToDelete])].join(",");
        state.formData.media_to_delete = allIds;
      }

      state.formData[type] = [];
    },
    // API auto-populate actions
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setApiError: (state, action) => {
      state.apiError = action.payload;
      state.isLoading = false;
    },

    // Action to store raw API data
    setAutoPopulateData: (state, action) => {
      state.autoPopulateData = action.payload;
      state.isLoading = false;
      state.apiError = null;
    },

    // Set auto-populating flag
    setAutoPopulating: (state, action) => {
      state.isAutoPopulating = action.payload;
    },

    // Action to populate form with API data - Updated with proper field mapping
    populateFormFromApi: (state, action) => {
      const apiData = action.payload;

      // Set auto-populating flag to prevent cascading dropdown resets
      state.isAutoPopulating = true;

      // Create a mapping for API fields to form fields
      const fieldMapping = {
        // Basic Information
        action_id: "action_id", // Add this line
        id: "action_id", // Alternative if API uses 'id'
        property_name: "propertyName",
        mobile_number: "mobileNumber",
        address: "address",
        state_id: "state",
        district_id: "district",
        city_id: "city",
        description: "description",

        // Room Details
        bathroom: "bathroom",
        bedrooms: "bedroom",
        bedroom: "bedroom", // Handle both variations
        wash_room: "washRoom",
        washroom: "washRoom", // Handle variation
        bhk_id: "bhk",

        // Property Features
        furnished_id: "furnished",
        listed_by: "listedBy",
        construction_status_id: "constructionStatus",
        maintenance_id: "maintenance",
        bachelor: "bachelor",

        // Area Measurements
        super_builtup_area: "superBuildArea",
        super_built_area: "superBuildArea", // Handle variation
        carpet_area: "carpetArea",
        plot_area: "plotArea",
        length: "length",
        breadth: "breadth",

        // Building Details
        building_direction_id: "buildingDirection",
        floor_no: "floorNumber",
        floor_number: "floorNumber", // Handle variation
        total_floors: "totalFloor",

        // Parking
        bike_parking: "bikeParking",
        car_parking: "carParking",

        // Financial
        amount: "amount",
        price: "amount", // Handle variation
        rent: "amount", // Handle variation

        // Media
        images: "images",
        videos: "videos",
      };
      // Process images array from API
      if (apiData.images && Array.isArray(apiData.images)) {
        state.formData.images = apiData.images.map((image) => ({
          id: image.media_image_id,
          url: image.url,
          name: `image_${image.media_image_id}`,
          isFromApi: true, // Mark as from API
          type: "image/jpeg", // Add dummy type that passes validation
          size: 0, // Add dummy size that passes validation
        }));
      }

      // Populate form fields using the mapping
      Object.keys(apiData).forEach((apiKey) => {
        const formField = fieldMapping[apiKey] || apiKey;

        if (state.formData.hasOwnProperty(formField)) {
          const value = apiData[apiKey];

          if (Array.isArray(value)) {
            state.formData[formField] = [...value];
          } else if (value !== null && value !== undefined) {
            // Convert to string for form fields (except arrays)
            state.formData[formField] =
              typeof value === "object" ? JSON.stringify(value) : String(value);
          }
        }
      });

      state.autoPopulateData = apiData;
      state.isLoading = false;
      state.apiError = null;

      console.log("Form populated from API data with proper field mapping");

      // Reset auto-populating flag after a brief delay to allow dropdown loading
      setTimeout(() => {
        state.isAutoPopulating = false;
      }, 100);
    },

    // Action to merge API data with existing form data
    mergeApiData: (state, action) => {
      const apiData = action.payload;
      const { overwriteExisting = false } = action.meta || {};

      state.isAutoPopulating = true;

      // Enhanced field mapping for flexible API responses
      const fieldMappings = {
        propertyName: ["property_name", "propertyName", "name"],
        mobileNumber: [
          "mobile_number",
          "mobile",
          "mobileNumber",
          "phoneNumber",
          "phone",
        ],
        state: ["state_id", "state", "stateId"],
        images: "images",
        videos: "videos",
        district: ["district_id", "district", "districtId"],
        city: ["city_id", "city", "cityId"],
        bathroom: ["bathroom", "bathrooms"],
        bedroom: ["bedroom", "bedrooms"],
        washRoom: ["wash_room", "washRoom", "washrooms"],
        bhk: ["bhk_id", "bhk"],
        furnished: ["furnished_id", "furnished"],
        listedBy: ["listed_by", "listedBy"],
        constructionStatus: ["construction_status_id", "constructionStatus"],
        maintenance: ["maintenance_id", "maintenance"],
        superBuildArea: [
          "super_builtup_area",
          "super_built_area",
          "superBuildArea",
          "superBuiltupArea",
          "superBuiltUp",
        ],
        plotArea: ["plot_area", "plotArea", "plotarea"],
        breadth: ["breadth", "width"],
        buildingDirection: [
          "building_direction_id",
          "buildingDirection",
          "direction",
        ],
        floorNumber: ["floor_no", "floor_number", "floorNumber", "floor"],
        totalFloor: ["total_floors", "totalFloor", "totalFloors"],
        bikeParking: ["bike_parking", "bikeParking", "twoWheelerParking"],
        carParking: ["car_parking", "carParking", "fourWheelerParking"],
        amount: ["amount", "price", "rent", "cost"],
      };

      Object.keys(apiData).forEach((key) => {
        // Direct mapping
        if (state.formData.hasOwnProperty(key)) {
          if (!state.formData[key] || overwriteExisting) {
            if (Array.isArray(apiData[key])) {
              state.formData[key] = [...apiData[key]];
            } else {
              state.formData[key] = apiData[key];
            }
          }
        }

        // Alternative field mappings
        Object.keys(fieldMappings).forEach((formField) => {
          if (fieldMappings[formField].includes(key)) {
            if (!state.formData[formField] || overwriteExisting) {
              if (Array.isArray(apiData[key])) {
                state.formData[formField] = [...apiData[key]];
              } else {
                state.formData[formField] = apiData[key];
              }
            }
          }
        });
      });

      state.autoPopulateData = apiData;
      state.isLoading = false;
      state.apiError = null;

      console.log("API data merged with form data using field mappings");

      // Reset auto-populating flag
      setTimeout(() => {
        state.isAutoPopulating = false;
      }, 100);
    },

    // Load comprehensive dummy data for testing all fields
    loadDummyData: (state) => {
      const dummyData = {
        // Basic Information
        propertyName: "Luxury Apartment Complex",
        mobileNumber: "+91 9876543210",
        address: "Plot No. 123, Sector 45, Near Metro Station",
        state: "1", // Use ID format
        district: "5", // Use ID format
        city: "25", // Use ID format
        description:
          "Premium residential property with modern amenities, excellent connectivity, and peaceful environment. Perfect for families looking for comfort and convenience.",

        // Room Details
        bathroom: "3",
        bedroom: "3",
        washRoom: "1",
        bhk: "3BHK",

        // Property Features
        furnished: "Semi-Furnished",
        listedBy: "Owner",
        constructionStatus: "Ready to Move",
        maintenance: "Included",
        bachelor: "Yes",

        // Area Measurements
        superBuildArea: "1450",
        carpetArea: "1200",
        plotArea: "2400",
        length: "60",
        breadth: "40",

        // Building Details
        buildingDirection: "North-East",
        floorNumber: "5",
        totalFloor: "12",

        // Parking
        bikeParking: "2",
        carParking: "1",

        // Financial
        amount: "8500000",

        // Media
        images: [],
        videos: [],
      };

      // Populate form with dummy data
      Object.keys(dummyData).forEach((key) => {
        if (state.formData.hasOwnProperty(key)) {
          state.formData[key] = dummyData[key];
        }
      });

      state.autoPopulateData = dummyData;
      console.log("Comprehensive dummy data loaded into all form fields");
    },

    // Clear auto-populate data
    clearAutoPopulateData: (state) => {
      state.autoPopulateData = null;
      state.apiError = null;
      state.isAutoPopulating = false;
    },

    // Reset form to initial state
    resetForm: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setFormData,
  updateFormField,
  setErrors,
  setTouched,
  setAllTouched,
  setFocusedField,
  clearFocusedField,
  clearError,
  addFiles,
  removeFile,
  clearFiles,
  setLoading,
  setApiError,
  setAutoPopulateData,
  setAutoPopulating,
  populateFormFromApi,
  mergeApiData,
  loadDummyData,
  clearAutoPopulateData,
  resetForm,
  updateMediaToDelete,
  addToMediaDeleteList,
} = propertyFormSlice.actions;

export default propertyFormSlice.reducer;

// Selectors for easy state access
export const selectFormData = (state) => state.propertyform.formData;
export const selectErrors = (state) => state.propertyform.errors;
export const selectTouched = (state) => state.propertyform.touched;
export const selectIsLoading = (state) => state.propertyform.isLoading;
export const selectApiError = (state) => state.propertyform.apiError;
export const selectAutoPopulateData = (state) =>
  state.propertyform.autoPopulateData;
export const selectIsAutoPopulating = (state) =>
  state.propertyform.isAutoPopulating;
