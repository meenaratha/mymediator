// validationSchema.js
import * as Yup from 'yup';

export const saleHouseFormSchema = Yup.object().shape({
  propertyName: Yup.string().required('Property name is required'),

});
