import  { configureStore } from "@reduxjs/toolkit";
import salehouseformReducer from './salehouseformslice';
const store = configureStore({
    reducer: {
      salehouseform: salehouseformReducer, // You can name this anything (e.g., formState, formData)
    },
  });
  
  export default store;