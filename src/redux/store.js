import { configureStore } from "@reduxjs/toolkit";
import salehouseformReducer from './salehouseformslice';

const store = configureStore({
  reducer: {
    salehouseform: salehouseformReducer,
  },
});

export default store;