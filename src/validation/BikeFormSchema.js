import * as Yup from "yup";

export const uploadBikeFormSchema = Yup.object().shape({
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
  
  kilometers: Yup.string().required("Kilometers driven is required"),
  engine_cc: Yup.string().required("Engine capacity is required"),
  
  year: Yup.string()
    .required("Year is required")
    .matches(/^\d{4}$/, "Year must be a 4-digit number"),
    
  address: Yup.string().required("Address is required"),
  latitude: Yup.string().required("Latitude is required"),
  longitude: Yup.string().required("Longitude is required"),
  state_id: Yup.string().required("State is required"),
  district_id: Yup.string().required("District is required"),
  city_id: Yup.string().required("City is required"),
  
  fuel_type_id: Yup.string().required("Fuel type is required"),
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
});