import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: {
    brandName: "",
    model: "",
    variant: "",
    year: "",
    kmdriven: "",
    noofowner: "",
    amount: "",
    addtittle: "",
    transmissionautomatic: "",
    transmissionmanual: "",
    address: "",
    state: "",
    district: "",
    fuel: "",
    description: "",
    images: [],
    videos: [],
  },
  errors: {},
  touched: {},
  focusedField: null,
};

const uploadcarformSlice = createSlice({
  name: "uploadcarform",
  initialState,
  reducers: {
    setFormData: (state, action) => {
      state.formData = action.payload;
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
    // New actions for file handling
    addFiles: (state, action) => {
      const { type, files } = action.payload;
      // Ensure the array exists
      if (!state.formData[type]) {
        state.formData[type] = [];
      }

      // Clone the existing array to avoid mutation
      const currentFiles = [...state.formData[type]];

      // Add new files to the cloned array
      // We need a shallow copy of files since File objects can't be deep copied easily
      files.forEach((file) => {
        currentFiles.push(file);
      });

      // Update the state with the new array
      state.formData[type] = currentFiles;

      console.log(`Added files to ${type}, new count: ${currentFiles.length}`);
    },
    removeFile: (state, action) => {
      const { type, index } = action.payload;

      // Ensure the array exists and index is valid
      if (state.formData[type] && state.formData[type].length > index) {
        // Filter out the file at the specified index
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

      // Reset the array to empty
      state.formData[type] = [];

      console.log(`Cleared all files from ${type}`);
    },
    resetForm: (state) => {
      // Reset to initial state but preserve references
      Object.assign(state, initialState);
    },
  },
});

export const {
  setFormData,
  setErrors,
  setTouched,
  setAllTouched,
  setFocusedField,
  clearFocusedField,
  clearError,
  addFiles,
  removeFile,
  clearFiles,
  resetForm,
} = uploadcarformSlice.actions;
export default uploadcarformSlice.reducer;
