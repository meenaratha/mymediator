import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: {
    form_type: "bike",
    title: "",
    subcategory_id: "",
    year: "",
    kilometers: "",
    engine_cc: "",
    brand_id: "",
    brand_name: "",
    model_name: "",
    model_id: "",
    fuel_type_id: "",
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
    media_to_delete: "",
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

const uploadBikeFormSlice = createSlice({
  name: "uploadbikeform",
  initialState,
  reducers: {
    setFormData: (state, action) => {
      state.formData = action.payload;
    },

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

    removeFile: (state, action) => {
      const { type, index } = action.payload;
      if (state.formData[type] && state.formData[type].length > index) {
        const file = state.formData[type][index];

        if (file?.media_image_id || file?.media_video_id) {
          const id = file.media_image_id || file.media_video_id;
          const currentIds = state.formData.media_to_delete
            ? state.formData.media_to_delete.split(",")
            : [];

          if (!currentIds.includes(id.toString())) {
            const newIds = [...currentIds, id.toString()].join(",");
            state.formData.media_to_delete = newIds;
          }
        }

        state.formData[type] = state.formData[type].filter(
          (_, i) => i !== index
        );
      }
    },

    clearFiles: (state, action) => {
      const type = action.payload;
      const files = state.formData[type] || [];

      const idsToDelete = files
        .filter((file) => file?.media_image_id || file?.media_video_id)
        .map((file) => file.media_image_id || file.media_video_id);

      if (idsToDelete.length > 0) {
        const currentIds = state.formData.media_to_delete
          ? state.formData.media_to_delete.split(",")
          : [];

        const allIds = [...new Set([...currentIds, ...idsToDelete])].join(",");
        state.formData.media_to_delete = allIds;
      }

      state.formData[type] = [];
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setApiError: (state, action) => {
      state.apiError = action.payload;
      state.isLoading = false;
    },

    setAutoPopulateData: (state, action) => {
      state.autoPopulateData = action.payload;
      state.isLoading = false;
      state.apiError = null;
    },

    setAutoPopulating: (state, action) => {
      state.isAutoPopulating = action.payload;
    },

    populateFormFromApi: (state, action) => {
      const apiData = action.payload;

      state.isAutoPopulating = true;

      const fieldMapping = {
        action_id: "action_id",
        form_type: "bike",
        title: "title",
        subcategory_id: "subcategory_id",
        year: "year",
        kilometers: "kilometers",
        engine_cc: "engine_cc",
        brand_id: "brand_id",
        brand_name: "brand_name",
        model_id: "model_id",
        model_name: "model_name",
        fuel_type_id: "fuel_type_id",
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

      if (apiData.images && Array.isArray(apiData.images)) {
        state.formData.images = apiData.images;
        console.log("📸 Set images:", state.formData.images.length);
      }

      if (apiData.videos && Array.isArray(apiData.videos)) {
        state.formData.videos = apiData.videos;
        console.log("🎥 Set videos:", state.formData.videos.length);
      }

      if (!state.formData.action_id && apiData.id) {
        state.formData.action_id = String(apiData.id);
        console.log("🆔 Action ID set from id:", state.formData.action_id);
      }

      Object.keys(apiData).forEach((apiKey) => {
        const formField = fieldMapping[apiKey] || apiKey;

        if (state.formData.hasOwnProperty(formField)) {
          const value = apiData[apiKey];

          if (Array.isArray(value)) {
            state.formData[formField] = [...value];
          } else if (value !== null && value !== undefined) {
            state.formData[formField] =
              typeof value === "object" ? JSON.stringify(value) : String(value);
          }
        }
      });

      state.autoPopulateData = apiData;
      state.isLoading = false;
      state.apiError = null;

      console.log("Bike form populated from API data with proper field mapping");

      setTimeout(() => {
        state.isAutoPopulating = false;
      }, 100);
    },

    clearAutoPopulateData: (state) => {
      state.autoPopulateData = null;
      state.apiError = null;
      state.isAutoPopulating = false;
    },

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
  clearAutoPopulateData,
  resetForm,
  updateMediaToDelete,
  addToMediaDeleteList,
} = uploadBikeFormSlice.actions;

export default uploadBikeFormSlice.reducer;

// Selectors
export const selectFormData = (state) => state.uploadbikeform.formData;
export const selectErrors = (state) => state.uploadbikeform.errors;
export const selectTouched = (state) => state.uploadbikeform.touched;
export const selectIsLoading = (state) => state.uploadbikeform.isLoading;
export const selectApiError = (state) => state.uploadbikeform.apiError;
export const selectAutoPopulateData = (state) => state.uploadbikeform.autoPopulateData;
export const selectIsAutoPopulating = (state) => state.uploadbikeform.isAutoPopulating;