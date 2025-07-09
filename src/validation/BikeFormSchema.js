import * as Yup from "yup";

// Base schema with all common fields
const baseFormSchema = {
  title: Yup.string().required("Title is required"),
  
  brand_id: Yup.string().required("Brand is required"),
  brand_name: Yup.string().when("brand_id", (brand_id, schema) => {
    return brand_id === "other"
      ? schema.required("Brand name is required when 'Other' is selected")
      : schema.notRequired();
  }),
  
  model_id: Yup.string().required("Model is required"),
  model_name: Yup.string().when("model_id", (model_id, schema) => {
    return model_id === "other"
      ? schema.required("Model name is required when 'Other' is selected")
      : schema.notRequired();
  }),
  
  year: Yup.string()
    .required("Year is required")
    .matches(/^\d{4}$/, "Year must be a 4-digit number"),
    
  address: Yup.string().required("Address is required"),
  latitude: Yup.string().required("Latitude is required"),
  longitude: Yup.string().required("Longitude is required"),
  state_id: Yup.string().required("State is required"),
  district_id: Yup.string().required("District is required"),
  // city_id: Yup.string().required("City is required"),
  
  number_of_owner_id: Yup.string().required("Number of owners is required"),
  
  price: Yup.string()
    .required("Price is required")
    .matches(/^[0-9]+(\.[0-9]{1,2})?$/, "Price must be a valid number"),
    
  mobile_number: Yup.string()
    .required("Mobile number is required")
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
    
  description: Yup.string().required("Short description is required"),
  
  images: Yup.array()
    .test("fileSize", "Each image must be less than 5MB", (value) => {
      if (!value || value.length === 0) return true;
      return value.every((file) => file.size <= 5 * 1024 * 1024);
    })
    .test(
      "fileType",
      "Only JPG, PNG, GIF, or WEBP images are allowed",
      (value) => {
        if (!value || value.length === 0) return true;
        return value.every((file) =>
          ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
            file.type
          )
        );
      }
    ),
    
  videos: Yup.array()
    .test("fileSize", "Each video must be less than 50MB", (value) => {
      if (!value || value.length === 0) return true;
      return value.every((file) => file.size <= 50 * 1024 * 1024);
    })
    .test("fileType", "Only video files are allowed", (value) => {
      if (!value || value.length === 0) return true;
      return value.every((file) => file.type.startsWith("video/"));
    }),
};

// Motor bike specific fields (not for bicycles)
const motorBikeFields = {
  kilometers: Yup.string().required("Kilometers driven is required"),
  engine_cc: Yup.string().required("Engine capacity is required"),
  fuel_type_id: Yup.string().required("Fuel type is required"),
};

// Function to create dynamic schema based on vehicle type
export const createBikeFormSchema = (slug) => {
  const isBicycle = slug?.toLowerCase().includes('bicycle');
  
  console.log("🔧 Creating validation schema for:", { slug, isBicycle });
  
  if (isBicycle) {
    // For bicycles: exclude motor bike specific fields
    console.log("🚲 Using bicycle validation schema (no kilometers, engine_cc, fuel_type_id)");
    return Yup.object().shape(baseFormSchema);
  } else {
    // For motor bikes: include all fields
    console.log("🏍️ Using motor bike validation schema (all fields required)");
    return Yup.object().shape({
      ...baseFormSchema,
      ...motorBikeFields,
    });
  }
};

// Default export for backward compatibility (motor bike schema)
export const uploadBikeFormSchema = Yup.object().shape({
  ...baseFormSchema,
  ...motorBikeFields,
});

// Alternative approach: Single schema with conditional validation
export const conditionalBikeFormSchema = Yup.object().shape({
  ...baseFormSchema,
  
  // Conditional validation for motor bike fields
  kilometers: Yup.string().when('$vehicleType', (vehicleType, schema) => {
    return vehicleType === 'bicycle' 
      ? schema.notRequired() 
      : schema.required("Kilometers driven is required");
  }),
  
  engine_cc: Yup.string().when('$vehicleType', (vehicleType, schema) => {
    return vehicleType === 'bicycle' 
      ? schema.notRequired() 
      : schema.required("Engine capacity is required");
  }),
  
  fuel_type_id: Yup.string().when('$vehicleType', (vehicleType, schema) => {
    return vehicleType === 'bicycle' 
      ? schema.notRequired() 
      : schema.required("Fuel type is required");
  }),
});

// Helper function to get vehicle type from slug
export const getVehicleType = (slug) => {
  return slug?.toLowerCase().includes('bicycle') ? 'bicycle' : 'motorbike';
};