import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  formData: {
    propertyName: "",
    mobileNumber: "",
    propertyType: "",
    listedBy: "",
    plotarea: "",
    length: "",
    breadth: "",
    buildingDirection: "",
    amount: "",
    address: "",
    state: "",
    district: "",
    description: "",
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
};

const landplotformSlice = createSlice({
  name: 'landplotform',
  initialState,
  reducers: {
    setFormData: (state, action) => {
      state.formData = action.payload;
    },
    
    // Update specific field
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
      state.touched = action.payload;
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
      files.forEach(file => {
        currentFiles.push(file);
      });
      
      state.formData[type] = currentFiles;
      console.log(`Added files to ${type}, new count: ${currentFiles.length}`);
    },
    
    removeFile: (state, action) => {
      const { type, index } = action.payload;
      if (state.formData[type] && state.formData[type].length > index) {
        state.formData[type] = state.formData[type].filter((_, i) => i !== index);
        console.log(`Removed file at index ${index} from ${type}, new count: ${state.formData[type].length}`);
      }
    },
    
    clearFiles: (state, action) => {
      const type = action.payload;
      state.formData[type] = [];
      console.log(`Cleared all files from ${type}`);
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
    
    // Action to populate form with API data
    populateFormFromApi: (state, action) => {
      const apiData = action.payload;
      
      // Map API data to form fields
      if (apiData.propertyName) state.formData.propertyName = apiData.propertyName;
      if (apiData.mobile || apiData.mobileNumber) state.formData.mobileNumber = apiData.mobile || apiData.mobileNumber;
      if (apiData.propertyType) state.formData.propertyType = apiData.propertyType;
      if (apiData.listedBy) state.formData.listedBy = apiData.listedBy;
      if (apiData.plotArea || apiData.plotarea) state.formData.plotarea = apiData.plotArea || apiData.plotarea;
      if (apiData.length) state.formData.length = apiData.length;
      if (apiData.breadth || apiData.width) state.formData.breadth = apiData.breadth || apiData.width;
      if (apiData.buildingDirection || apiData.direction) state.formData.buildingDirection = apiData.buildingDirection || apiData.direction;
      if (apiData.amount || apiData.price) state.formData.amount = apiData.amount || apiData.price;
      if (apiData.address) state.formData.address = apiData.address;
      if (apiData.state) state.formData.state = apiData.state;
      if (apiData.district) state.formData.district = apiData.district;
      if (apiData.description) state.formData.description = apiData.description;
      
      // Handle arrays
      if (apiData.images && Array.isArray(apiData.images)) {
        state.formData.images = [...apiData.images];
      }
      if (apiData.videos && Array.isArray(apiData.videos)) {
        state.formData.videos = [...apiData.videos];
      }
      
      state.autoPopulateData = apiData;
      state.isLoading = false;
      state.apiError = null;
      
      console.log('Form populated from API data');
    },
    
    // Action to merge API data with existing form data
    mergeApiData: (state, action) => {
      const apiData = action.payload;
      const { overwriteExisting = false } = action.meta || {};
      
      Object.keys(apiData).forEach(key => {
        if (state.formData.hasOwnProperty(key)) {
          // Only update if field is empty or overwrite is enabled
          if (!state.formData[key] || overwriteExisting) {
            if (Array.isArray(apiData[key])) {
              state.formData[key] = [...apiData[key]];
            } else {
              state.formData[key] = apiData[key];
            }
          }
        }
      });
      
      state.autoPopulateData = apiData;
      state.isLoading = false;
      state.apiError = null;
      
      console.log('API data merged with form data');
    },
    
    // Load dummy data for testing
    loadDummyData: (state) => {
      const dummyData = {
        propertyName: "Green Valley Plot",
        mobileNumber: "+91 9876543210",
        propertyType: "Residential",
        listedBy: "Owner",
        plotarea: "2400",
        length: "60",
        breadth: "40",
        buildingDirection: "North",
        amount: "1500000",
        address: "Near City Center, Main Road",
        state: "Karnataka",
        district: "Bangalore Urban",
        description: "Premium residential plot in a well-developed area with all amenities nearby. Clear title, ready for construction.",
        images: [],
        videos: [],
      };
      
      // Populate form with dummy data
      Object.keys(dummyData).forEach(key => {
        if (state.formData.hasOwnProperty(key)) {
          state.formData[key] = dummyData[key];
        }
      });
      
      state.autoPopulateData = dummyData;
      console.log('Dummy data loaded into form');
    },
    
    // Clear auto-populate data
    clearAutoPopulateData: (state) => {
      state.autoPopulateData = null;
      state.apiError = null;
    },
    
    // Reset form to initial state
    resetForm: (state) => {
      Object.assign(state, initialState);
    }
  }
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
  populateFormFromApi,
  mergeApiData,
  loadDummyData,
  clearAutoPopulateData,
  resetForm,
} = landplotformSlice.actions;

export default landplotformSlice.reducer;

// Selectors for easy state access
export const selectFormData = (state) => state.landplotform.formData;
export const selectErrors = (state) => state.landplotform.errors;
export const selectTouched = (state) => state.landplotform.touched;
export const selectIsLoading = (state) => state.landplotform.isLoading;
export const selectApiError = (state) => state.landplotform.apiError;
export const selectAutoPopulateData = (state) => state.landplotform.autoPopulateData;