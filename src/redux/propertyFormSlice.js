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
      if (apiData.property_name)
        state.formData.propertyName = apiData.property_name;
      if (apiData.mobile_number)
        state.formData.mobileNumber = apiData.mobile_number;
      if (apiData.address) state.formData.address = apiData.address;
      if (apiData.state_id) state.formData.state = apiData.state_id;
      if (apiData.district_id) state.formData.district = apiData.district_id;
      if (apiData.city_id) state.formData.city = apiData.city_id;
      if (apiData.description) state.formData.description = apiData.description;

      // Room Details
      if (apiData.bathroom) state.formData.bathroom = apiData.bathroom;
      if (apiData.bedrooms) state.formData.bedroom = apiData.bedrooms;
      if (apiData.wash_room) state.formData.washRoom = apiData.wash_room;
      if (apiData.bhk_id) state.formData.bhk = apiData.bhk_id;

      // Property Features
      if (apiData.furnished_id) state.formData.furnished = apiData.furnished_id;
      if (apiData.listed_by) state.formData.listedBy = apiData.listed_by;
      if (apiData.construction_status_id)
        state.formData.constructionStatus = apiData.construction_status_id;
      if (apiData.maintenance_id)
        state.formData.maintenance = apiData.maintenance_id;
      if (apiData.bachelor) state.formData.bachelor = apiData.bachelor;

      // Area Measurements
      if (apiData.super_builtup_area)
        state.formData.superBuildArea = apiData.super_builtup_area;
      if (apiData.carpet_area) state.formData.carpetArea = apiData.carpet_area;
      if (apiData.plot_area) state.formData.plotArea = apiData.plot_area;
      if (apiData.length) state.formData.length = apiData.length;
      if (apiData.breadth) state.formData.breadth = apiData.breadth;

      // Building Details
      if (apiData.building_direction_id)
        state.formData.buildingDirection = apiData.building_direction_id;
      if (apiData.floor_no) state.formData.floorNumber = apiData.floor_no;
      if (apiData.total_floors)
        state.formData.totalFloor = apiData.total_floors;

      // Parking
      if (apiData.bike_parking)
        state.formData.bikeParking = apiData.bike_parking;
      if (apiData.car_parking) state.formData.carParking = apiData.car_parking;

      // Financial
      if (apiData.amount) state.formData.amount = apiData.amount;

      // Handle arrays
      if (Array.isArray(apiData.images)) {
        state.formData.images = [...apiData.images];
      }
      if (Array.isArray(apiData.videos)) {
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