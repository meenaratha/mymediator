import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: {
    // Basic Information
    propertyName: "",
    mobileNumber: "",
    address: "",
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
  },
  errors: {},
  touched: {},
  focusedField: null,
  // New state for API handling
  isLoading: false,
  apiError: null,
  autoPopulateData: null,
};


const propertyFormSlice = createSlice({
  name: "propertyform",
  initialState,
  reducers: {
    setFormData: (state, action) => {
      state.formData = action.payload;
    },

    // update specific fileds
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
      files.forEach((file) => {
        currentFiles.push(file);
      });

      state.formData[type] = currentFiles;
      console.log(`Added files to ${type}, new count: ${currentFiles.length}`);
    },

    removeFile: (state, action) => {
      const { type, index } = action.payload;
      if (state.formData[type] && state.formData[type].length > index) {
        state.formData[type] = state.formData[type].filter(
          (_, i) => i !== index
        );
        console.log(
          `Removed file at index ${index} from ${type}, new count: ${state.formData[type].length}`
        );
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

    // Action to populate form with API data - Updated with all fields
    populateFormFromApi: (state, action) => {
      const apiData = action.payload;

      // Basic Information
      if (apiData.propertyName)
        state.formData.propertyName = apiData.propertyName;
      if (apiData.mobile || apiData.mobileNumber)
        state.formData.mobileNumber = apiData.mobile || apiData.mobileNumber;
      if (apiData.address) state.formData.address = apiData.address;
      if (apiData.state) state.formData.state = apiData.state;
      if (apiData.district) state.formData.district = apiData.district;
      if (apiData.city) state.formData.city = apiData.city;
      if (apiData.description) state.formData.description = apiData.description;

      // Room Details
      if (apiData.bathroom || apiData.bathrooms)
        state.formData.bathroom = apiData.bathroom || apiData.bathrooms;
      if (apiData.bedroom || apiData.bedrooms)
        state.formData.bedroom = apiData.bedroom || apiData.bedrooms;
      if (apiData.washRoom || apiData.washrooms)
        state.formData.washRoom = apiData.washRoom || apiData.washrooms;
      if (apiData.bhk) state.formData.bhk = apiData.bhk;

      // Property Features
      if (apiData.furnished) state.formData.furnished = apiData.furnished;
      if (apiData.listedBy) state.formData.listedBy = apiData.listedBy;
      if (apiData.constructionStatus)
        state.formData.constructionStatus = apiData.constructionStatus;
      if (apiData.maintenance) state.formData.maintenance = apiData.maintenance;
      if (apiData.bachelor) state.formData.bachelor = apiData.bachelor;

      // Area Measurements
      if (apiData.superBuildArea || apiData.superBuiltupArea)
        state.formData.superBuildArea =
          apiData.superBuildArea || apiData.superBuiltupArea;
      if (apiData.carpetArea) state.formData.carpetArea = apiData.carpetArea;
      if (apiData.plotArea || apiData.plotarea)
        state.formData.plotArea = apiData.plotArea || apiData.plotarea;
      if (apiData.length) state.formData.length = apiData.length;
      if (apiData.breadth || apiData.width)
        state.formData.breadth = apiData.breadth || apiData.width;

      // Building Details
      if (apiData.buildingDirection || apiData.direction)
        state.formData.buildingDirection =
          apiData.buildingDirection || apiData.direction;
      if (apiData.floorNumber || apiData.floor)
        state.formData.floorNumber = apiData.floorNumber || apiData.floor;
      if (apiData.totalFloor || apiData.totalFloors)
        state.formData.totalFloor = apiData.totalFloor || apiData.totalFloors;

      // Parking
      if (apiData.bikeParking || apiData.twoWheelerParking)
        state.formData.bikeParking =
          apiData.bikeParking || apiData.twoWheelerParking;
      if (apiData.carParking || apiData.fourWheelerParking)
        state.formData.carParking =
          apiData.carParking || apiData.fourWheelerParking;

      // Financial
      if (apiData.amount || apiData.price || apiData.rent)
        state.formData.amount = apiData.amount || apiData.price || apiData.rent;

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

      console.log("Form populated from API data with all fields");
    },

    // Action to merge API data with existing form data
    mergeApiData: (state, action) => {
      const apiData = action.payload;
      const { overwriteExisting = false } = action.meta || {};

      // Field mapping for flexible API responses
      const fieldMappings = {
        mobileNumber: ["mobile", "mobileNumber", "phoneNumber"],
        bathroom: ["bathroom", "bathrooms"],
        bedroom: ["bedroom", "bedrooms"],
        washRoom: ["washRoom", "washrooms"],
        superBuildArea: ["superBuildArea", "superBuiltupArea", "superBuiltUp"],
        plotArea: ["plotArea", "plotarea"],
        breadth: ["breadth", "width"],
        buildingDirection: ["buildingDirection", "direction"],
        floorNumber: ["floorNumber", "floor"],
        totalFloor: ["totalFloor", "totalFloors"],
        bikeParking: ["bikeParking", "twoWheelerParking"],
        carParking: ["carParking", "fourWheelerParking"],
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
    },

    // Load comprehensive dummy data for testing all fields
    loadDummyData: (state) => {
      const dummyData = {
        // Basic Information
        propertyName: "Luxury Apartment Complex",
        mobileNumber: "+91 9876543210",
        address: "Plot No. 123, Sector 45, Near Metro Station",
        state: "Karnataka",
        district: "Bangalore Urban",
        city: "Bangalore",
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
  populateFormFromApi,
  mergeApiData,
  loadDummyData,
  clearAutoPopulateData,
  resetForm,
} = propertyFormSlice.actions;


export default propertyFormSlice.reducer;

// Selectors for easy state access
export const selectFormData = (state) => state.propertyform.formData;
export const selectErrors = (state) => state.propertyform.errors;
export const selectTouched = (state) => state.propertyform.touched;
export const selectIsLoading = (state) => state.propertyform.isLoading;
export const selectApiError = (state) => state.propertyform.apiError;
export const selectAutoPopulateData = (state) => state.propertyform.autoPopulateData;