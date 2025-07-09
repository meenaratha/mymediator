import * as Yup from 'yup';

// Common validation fields used across all property types
const commonFields = {
  propertyName: Yup.string().required("Property name is required"),
  mobileNumber: Yup.string()
    .required("Mobile number is required")
    .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
  address: Yup.string().required("Address is required"),
  state: Yup.string().required("State is required"),
  district: Yup.string().required("District is required"),
  // city: Yup.string().required("City is required"),
  description: Yup.string().required("Description is required"),
  amount: Yup.string()
    .required("Amount is required")
    .matches(/^[0-9]+(\.[0-9]{1,2})?$/, "Amount must be a valid number"),
  buildingDirection: Yup.string().required("Building direction is required"),
  images: Yup.array().required("images is required"),
  videos: Yup.array().of(
    Yup.mixed().test("fileType", "Only video files are allowed", (file) => {
      if (!file) return true; // ✅ Skip validation if no file (not required)
      return file && file.type.startsWith("video/");
    })
  ),
  // images: Yup.array()
  //   .required("At least one image is required")
  //   .min(1, "Please upload at least one image")
  //   .test("fileSize", "Each image file should be less than 5MB", (value) => {
  //     if (!value || value.length === 0) return true;
  //     return value.every((file) => {
  //       // Skip size check for auto-populated images from API
  //       if (file.isFromApi) return true;
  //       return file.size <= 5 * 1024 * 1024;
  //     });
  //   })
  //   .test("fileType", "Only image files are allowed", (value) => {
  //     if (!value || value.length === 0) return true;
  //     return value.every((file) => {
  //       // Skip type check for auto-populated images from API
  //       if (file.isFromApi) return true;
  //       return [
  //         "image/jpeg",
  //         "image/jpg",
  //         "image/png",
  //         "image/gif",
  //         "image/webp",
  //       ].includes(file.type);
  //     });
  //   }),
  // videos: Yup.array()
  //   .test("fileSize", "Each video file should be less than 50MB", (value) => {
  //     if (!value || value.length === 0) return true;
  //     return value.every((file) => file.size <= 50 * 1024 * 1024);
  //   })
  //   .test("fileType", "Only video files are allowed", (value) => {
  //     if (!value || value.length === 0) return true;
  //     return value.every((file) => file.type.startsWith("video/"));
  //   }),
};

// Land and Plot specific fields
const landPlotFields = {
  plotArea: Yup.string().required('Plot area is required'),
  length: Yup.string().required('Length is required'),
  breadth: Yup.string().required('Breadth is required'),
};

// House/Apartment specific fields (for sale and rent)
const houseApartmentFields = {
    bhk: Yup.string().required('BHK type is required'),
  bedroom: Yup.string().required('Number of bedrooms is required'),
  bathroom: Yup.string().required('Number of bathrooms is required'),
  furnished: Yup.string().required('Furnished status is required'),
  constructionStatus: Yup.string().required('Construction status is required'),
  maintenance: Yup.string().required('Maintenance is required'),
  superBuildArea: Yup.string().required('Super built-up area is required'),
  carpetArea: Yup.string().required('Carpet area is required'),
  floorNumber: Yup.string().required('Floor number is required'),
  totalFloor: Yup.string().required('Total floors is required'),
  bikeParking: Yup.string().required('Bike parking is required'),
  carParking: Yup.string().required('Car parking is required'),
  bachelor: Yup.string().required('Bachelor accommodation is required'),
};

// salehouse apartment
const salehouseApartmentFields = {
  bedroom: Yup.string().required('Number of bedrooms is required'),
  bathroom: Yup.string().required('Number of bathrooms is required'),
  bhk: Yup.string().required('BHK type is required'),
  furnished: Yup.string().required('Furnished status is required'),
  constructionStatus: Yup.string().required('Construction status is required'),
  maintenance: Yup.string().required('Maintenance is required'),
  superBuildArea: Yup.string().required('Super built-up area is required'),
  carpetArea: Yup.string().required('Carpet area is required'),
  floorNumber: Yup.string().required('Floor number is required'),
  totalFloor: Yup.string().required('Total floors is required'),
  bikeParking: Yup.string().required('Bike parking is required'),
  carParking: Yup.string().required('Car parking is required'),
};

// Commercial specific fields (shops/offices for sale and rent)
const commercialFields = {
  furnished: Yup.string().required('Furnished status is required'),
  constructionStatus: Yup.string().required('Construction status is required'),
  maintenance: Yup.string().required('Maintenance is required'),
  superBuildArea: Yup.string().required('Super built-up area is required'),
  carpetArea: Yup.string().required('Carpet area is required'),
  floorNumber: Yup.string().required('Floor number is required'),
  totalFloor: Yup.string().required('Total floors is required'),
  bikeParking: Yup.string().required('Bike parking is required'),
  carParking: Yup.string().required('Car parking is required'),
  washRoom: Yup.string().required('Wash room details are required'),
};

// Schema factory function based on slug
export const createValidationSchema = (slug) => {
  let schemaFields = { ...commonFields };

  switch (slug) {
    case "lands-plots":
      schemaFields = { ...schemaFields, ...landPlotFields };
      break;

    case "for-sale-houses-apartments":
      
            schemaFields = { ...schemaFields, ...salehouseApartmentFields };
              break;

    case "for-rent-houses-apartments":
      schemaFields = { ...schemaFields, ...houseApartmentFields };
      break;

    case "for-sale-shops-offices":
    case "for-rent-shops-offices":
      schemaFields = { ...schemaFields, ...commercialFields };
      break;

    default:
      // Default to land plot validation if slug is not recognized
      schemaFields = { ...schemaFields, ...landPlotFields };
      break;
  }

  return Yup.object().shape(schemaFields);
};

// Export individual schemas for direct use if needed
export const landPlotFormSchema = Yup.object().shape({
  ...commonFields,
  ...landPlotFields
});

export const houseApartmentSaleFormSchema = Yup.object().shape({
  ...commonFields,
  ...houseApartmentFields
});

export const houseApartmentRentFormSchema = Yup.object().shape({
  ...commonFields,
  ...houseApartmentFields
});

export const commercialSaleFormSchema = Yup.object().shape({
  ...commonFields,
  ...commercialFields
});

export const commercialRentFormSchema = Yup.object().shape({
  ...commonFields,
  ...commercialFields
});

// Helper function to get validation schema by slug
export const getSchemaBySlug = (slug) => {
  switch (slug) {
    case 'lands-plots':
      return landPlotFormSchema;
    case 'for-sale-houses-apartments':
      return houseApartmentSaleFormSchema;
    case 'for-rent-houses-apartments':
      return houseApartmentRentFormSchema;
    case 'for-sale-shops-offices':
      return commercialSaleFormSchema;
    case 'for-rent-shops-offices':
      return commercialRentFormSchema;
    default:
      return landPlotFormSchema;
  }
};