import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: {
    propertyName: "",
  },
  errors: {},
  touched: {},
  focusedField: null, // 👈 for managing autoFocus dynamically
};

const salehouseformSlice = createSlice({
  name: "salehouseform",
  initialState,
  reducers: {
    setFormData: (state, action) => {
        state.formData = action.payload;
      },
      setFocusedField: (state, action) => {
        state.focusedField = action.payload;
      },
      clearFocusedField: (state) => {
        state.focusedField = null;
      },
    setErrors: (state, action) => {
      state.errors = action.payload;
    },
    setTouched: (state, action) => {
      state.touched[action.payload] = true;
    },
    setFocusedField: (state, action) => {
        state.focusedField = action.payload;
      },
    resetForm: () => initialState,
  },
});

export const { setFormData, setErrors, setTouched,   setFocusedField, clearFocusedField , resetForm } =
salehouseformSlice.actions;
export default salehouseformSlice.reducer;
