import { configureStore } from "@reduxjs/toolkit";
import salehouseformReducer from './salehouseformslice';
import enquiryFormReducer from './enquiryFormSlice';
import landplotformReducer from './landplotformSlice';
import rentshopofficeformSlice from './rentShopOfficeFormSlice';
import saleshopofficeformSlice from './saleShopOfficeFormSlice';
import uploadmotorcycleformSlice from './uploadmotorcycleForm';
import uploadbicycleformSlice from './uploadbicycleFormSlice';
import uploadcarformSlice from './uploadcarFormSlice';
import propertyFormSlice from './propertyFormSlice';
import uploadBikeFormSlice from './uploadBikeFormSlice';
import uploadElectronicsFormSlice from './uploadElectronicsFormSlice';
const store = configureStore({
  reducer: {
    salehouseform: salehouseformReducer,
    enquiryForm: enquiryFormReducer,
    landplotform: landplotformReducer,
    rentshopofficeform: rentshopofficeformSlice,
    saleshopofficeformSlice: saleshopofficeformSlice,
    uploadmotorcycleform: uploadmotorcycleformSlice,
    uploadbicycleformSlice: uploadbicycleformSlice,
    uploadcarform: uploadcarformSlice,
    propertyform: propertyFormSlice ,
    uploadbikeform: uploadBikeFormSlice,
    uploadelectronicsform: uploadElectronicsFormSlice,
  },
});

export default store;