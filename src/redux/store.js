import { configureStore } from "@reduxjs/toolkit";
import salehouseformReducer from './salehouseformslice';
import enquiryFormReducer from './enquiryFormSlice';
import landplotformReducer from './landplotformSlice';

const store = configureStore({
  reducer: {
    salehouseform: salehouseformReducer,
    enquiryForm: enquiryFormReducer,
    landplotform: landplotformReducer,
  },
});

export default store;