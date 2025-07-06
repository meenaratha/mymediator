import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: {
    // Basic Information
    title: "",
    form_type: "electronics",
    
    // Electronics specific
    brand_id: "",
    brand_name: "",
    model_id: "",
    model_name: "",
     year: "",
    price: "",
    features: "",
    specifications: "",
    
    // Location
    address: "",
    latitude: "",
    longitude: "",
    state_id: "",
    district_id: "",
    city_id: "",
    
    // Contact
    mobile_number: "",
    description: "",
    
    // Media
    images: [],
    videos: [],
    media_to_delete: "",
    
    // System fields
    subcategory_id: "",
    action_id: "",
    status: "available",
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
  isAutoPopulating: false,
};

const uploadElectronicsFormSlice = createSlice({
  name: "uploadelectronicsform",
  initialState,
  reducers: {
    setFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    
    updateFormField: (state, action) => {
      const { field, value } = action.payload;
      state.formData[field] = value;
    },
    
    setErrors: (state, action) => {
      state.errors = action.payload;
    },
    
    setTouched: (state, action) => {
      if (typeof action.payload === "string") {
        state.touched[action.payload] = true;
      } else {
        state.touched = { ...state.touched, ...action.payload };
      }
    },
    
    setAllTouched: (state, action) => {
      state.touched = action.payload;
    },
    
    setFocusedField: (state, action) => {
      state.focusedField = action.payload;
    },
    
    clearFocusedField: (state) => {
      state.focusedField = null;
    },
    
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
    
    populateFormFromApi: (state, action) => {
      state.isAutoPopulating = true;
      state.formData = { ...state.formData, ...action.payload };
      // Clear errors when populating from API
      state.errors = {};
      state.touched = {};
      // Set auto-populating to false after a delay
      setTimeout(() => {
        state.isAutoPopulating = false;
      }, 1000);
    },
    
    setAutoPopulateData: (state, action) => {
      state.autoPopulateData = action.payload;
    },
    
    clearAutoPopulateData: (state) => {
      state.autoPopulateData = null;
      state.isAutoPopulating = false;
    },
    
    updateMediaToDelete: (state, action) => {
      state.formData.media_to_delete = action.payload;
    },
    
    resetForm: (state) => {
      return {
        ...initialState,
        formData: {
          ...initialState.formData,
        },
      };
    },
  },
});

export const {
  setFormData,
  updateFormField,
  setErrors,
  setTouched,
  setFocusedField,
  clearFocusedField,
  addFiles,
  removeFile,
  clearFiles,
  setLoading,
  setApiError,
  populateFormFromApi,
  setAutoPopulateData,
  clearAutoPopulateData,
  updateMediaToDelete,
  resetForm,
} = uploadElectronicsFormSlice.actions;

// Selectors
export const selectIsAutoPopulating = (state) => state.uploadelectronicsform.isAutoPopulating;

export default uploadElectronicsFormSlice.reducer;