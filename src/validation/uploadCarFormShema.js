import * as Yup from 'yup';

export const uploadcarFormSchema = Yup.object().shape({
  brandName: Yup.string().required('Brand name is required'),
  model: Yup.string().required('Model is required'),
  variant: Yup.string().required('Variant is required'),
  year: Yup.string()
  .required(' Year is required')
  .matches(/^[0-9]+(\.[0-9]{1,2})?$/, 'Amount must be a valid year'),
  kmdriven: Yup.string().required(' Kmdriven is required'),
  noofowner: Yup.string().required('No of owner is required'),
 amount: Yup.string()
    .required('Amount is required')
    .matches(/^[0-9]+(\.[0-9]{1,2})?$/, 'Amount must be a valid number'),
  addtittle: Yup.string().required('Addtittle is required'),
  transmissionautomatic: Yup.string().required('Transmission is required'),
  transmissionmanual: Yup.string().required(' Transmission is required'),
  address: Yup.string().required('Address is required'),
  state: Yup.string().required('State is required'),
  district: Yup.string().required('District is required'),
  fuel: Yup.string().required('Fuel is required'),
  description: Yup.string().required('Description is required'),
  
  images: Yup.array()
    .required('At least one image is required')
    .min(1, 'Please upload at least one image')
    .test('fileSize', 'Each image file should be less than 5MB', (value) => {
      if (!value || value.length === 0) return true;
      return value.every(file => file.size <= 5 * 1024 * 1024);
    })
    .test('fileType', 'Only image files are allowed', (value) => {
      if (!value || value.length === 0) return true;
      return value.every(file => 
        ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)
      );
    }),
  videos: Yup.array()
    .test('fileSize', 'Each video file should be less than 50MB', (value) => {
      if (!value || value.length === 0) return true;
      return value.every(file => file.size <= 50 * 1024 * 1024);
    })
    .test('fileType', 'Only video files are allowed', (value) => {
      if (!value || value.length === 0) return true;
      return value.every(file => 
        file.type.startsWith('video/')
      );
    }),
  longdescription: Yup.string().required('Description is required'),
});