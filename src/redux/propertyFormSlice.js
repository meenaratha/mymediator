import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  formData: {
    propertyName: "",
    mobileNumber: "",
    building_direction_id: "",
    listedBy: "",
    plotarea: "",
    length: "",
    breadth: "",
    buildingDirection: "",
    amount: "",
    address: "",
    state: "",
    district: "",
    city:"",
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