import { configureStore } from "@reduxjs/toolkit";
import salehouseformReducer from './salehouseformslice';
import enquiryFormReducer from './enquiryFormSlice';

const store = configureStore({
  reducer: {
    salehouseform: salehouseformReducer,
    enquiryForm: enquiryFormReducer,
  },
});

export default store;