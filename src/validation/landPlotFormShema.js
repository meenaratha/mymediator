import * as Yup from 'yup';

export const landPlotFormSchema = Yup.object().shape({
  propertyName: Yup.string().required('Property name is required'),
  mobileNumber: Yup.string()
    .required('Mobile number is required')
    .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
  propertyType: Yup.string().required('Property type is required'),
  listedBy: Yup.string().required('Listed by is required'),
  plotarea: Yup.string().required('Plot area is required'),
  length: Yup.string().required('Length is required'),
  breadth: Yup.string().required('breadth is required'),
  buildingDirection: Yup.string().required('Building direction is required'),
  amount: Yup.string()
  .required('Amount is required')
  .matches(/^[0-9]+(\.[0-9]{1,2})?$/, 'Amount must be a valid number'),
  address: Yup.string().required('Address is required'),
  state: Yup.string().required('State is required'),
  district: Yup.string().required('District is required'),
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
});