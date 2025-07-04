import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: {
    form_type: "car",
    title: "",
    subcategory_id: "",
    year: "",
    kilometers: "",
    brand_id: "",
    brand_name: "",
    model_name:"",
    model_id: "",
    fuel_type_id: "",
    transmission_id: "",
    number_of_owner_id: "",
    price: "",
    description: "",
    status: "",
    state_id: "",
    district_id: "",
    city_id: "",
    address: "",
    latitude: "",
    longitude: "",
    mobile_number: "",
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
  isLoading: false,
  apiError: null,
  autoPopulateData: null,
  // Add flag to track if we're auto-populating to prevent cascading dropdown resets
  isAutoPopulating: false,
};

const uploadcarformSlice = createSlice({
  name: "uploadcarform",
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
    // setAllTouched: (state, action) => {
    //   state.touched = action.payload;
    // },
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
        form_type: "car",
        title: "title",
        subcategory_id: "subcategory_id",
        year: "year",
        kilometers: "kilometers",
        brand_id: "brand_id",
        model_id: "model_id",
        fuel_type_id: "fuel_type_id",
        transmission_id: "transmission_id",
        number_of_owner_id: "number_of_owner_id",
        price: "price",
        description: "description",
        status: "status",
        state_id: "state_id",
        district_id: "district_id",
        city_id: "city_id",
        address: "address",
        latitude: "latitude",
        longitude: "longitude",
        mobile_number: "mobile_number",
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
        // Basic Information
        action_id: "action_id", // Add this line
        form_type: "car",
        title: "title",
        subcategory_id: "subcategory_id",
        year: "year",
        kilometers: "kilometers",
        brand_id: "brand_id",
        model_id: "model_id",
        fuel_type_id: "fuel_type_id",
        transmission_id: "transmission_id",
        number_of_owner_id: "number_of_owner_id",
        price: "price",
        description: "description",
        status: "status",
        state_id: "state_id",
        district_id: "district_id",
        city_id: "city_id",
        address: "address",
        latitude: "latitude",
        longitude: "longitude",
        mobile_number: "mobile_number",
        images: "images",
        videos: "videos",
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

    // Clear auto-populate data
    clearAutoPopulateData: (state) => {
      state.autoPopulateData = null;
      state.apiError = null;
      state.isAutoPopulating = false;
    },

    resetForm: (state) => {
      // Reset to initial state but preserve references
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
  clearAutoPopulateData,
  resetForm,
  updateMediaToDelete,
  addToMediaDeleteList,
} = uploadcarformSlice.actions;
export default uploadcarformSlice.reducer;


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