import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  email: '',
  mobile: '',
  whatsapp: '',
  message: ''
};

const enquiryFormSlice = createSlice({
  name: 'enquiryForm',
  initialState,
  reducers: {
    updateFormData: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearFormData: () => {
      return initialState;
    }
  }
});

export const { updateFormData, clearFormData } = enquiryFormSlice.actions;
export default enquiryFormSlice.reducer;


