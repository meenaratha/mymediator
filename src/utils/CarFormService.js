import { api, apiForFiles } from "../api/axios";

// Car form submission service
class CarFormService {
  // Field mapping: backend field name -> frontend field name (for error handling)
  fieldMapping = {
    form_type: "form_type",
    title: "title",
    subcategory_id: "subcategory_id",
    year: "year",
    kilometers: "kilometers",
    brand_id: "brand_id",
    brand_name: "brand_name",
    model_id: "model_id",
    model_name: "model_name",
    fuel_type_id: "fuel_type_id",
    transmission_id: "transmission_id",
    number_of_owner_id: "number_of_owner_id",
    price: "price",
    description: "description",
    status: "status",
    state_id: "state_id",
    district_id: "district_id",
    city_id: "city_id",
    address: "address",
    latitude: "latitude",
    longitude: "longitude",
    mobile_number: "mobile_number",
    images: "images",
    videos: "videos",
    action_id: "action_id",
    media_to_delete: "media_to_delete",
  };

  // Map backend validation errors to frontend field names
  mapValidationErrors(backendErrors) {
    if (!backendErrors || typeof backendErrors !== "object") {
      return {};
    }

    const mappedErrors = {};

    Object.entries(backendErrors).forEach(([backendField, errorMessage]) => {
      // Get the frontend field name from mapping
      const frontendField = this.fieldMapping[backendField] || backendField;

      // Handle Laravel's array format for error messages
      if (Array.isArray(errorMessage)) {
        mappedErrors[frontendField] = errorMessage[0]; // Take the first error message
      } else {
        mappedErrors[frontendField] = errorMessage;
      }
    });

    console.log("Mapped validation errors:", mappedErrors);
    return mappedErrors;
  }

  // Transform car form data
  transformCarFormData(formData, subcategoryId, urlId) {
    const payload = {
      // Required fields
      form_type: "car",
      subcategory_id: subcategoryId,
      url_id: urlId, // ID from URL params
      
      // Car specific fields
      title: formData.title || "",
      year: formData.year || "",
      kilometers: formData.kilometers || "",
      price: formData.price || "",
      description: formData.description || "",
      mobile_number: formData.mobile_number || "",
      
      // Location fields
      address: formData.address || "",
      latitude: formData.latitude || "",
      longitude: formData.longitude || "",
      state_id: parseInt(formData.state_id) || formData.state_id || "",
      district_id: parseInt(formData.district_id) || formData.district_id || "",
      city_id: parseInt(formData.city_id) || formData.city_id || "",
      
      // Car specification fields
      fuel_type_id: parseInt(formData.fuel_type_id) || formData.fuel_type_id || "",
      transmission_id: parseInt(formData.transmission_id) || formData.transmission_id || "",
      number_of_owner_id: formData.number_of_owner_id || "",
      
      // Status
      status: formData.status || "available",
      
      // Media deletion tracking
      media_to_delete: formData.media_to_delete || "",
    };

    // Handle brand - either brand_id or brand_name (for custom brands)
    if (formData.brand_id && formData.brand_id !== "other") {
      payload.brand_id = parseInt(formData.brand_id) || formData.brand_id;
    } else if (formData.brand_name) {
      payload.brand_name = formData.brand_name;
      payload.brand_id = "other"; // or null, depending on your backend
    }

    // Handle model - either model_id or model_name (for custom models)
    if (formData.model_id && formData.model_id !== "other") {
      payload.model_id = parseInt(formData.model_id) || formData.model_id;
    } else if (formData.model_name) {
      payload.model_name = formData.model_name;
      payload.model_id = "other"; // or null, depending on your backend
    }

    // Add action_id for edit mode
    if (formData.action_id) {
      payload.action_id = formData.action_id;
    }

    console.log("Transformed car form data:", payload);
    return payload;
  }

  // Submit car form with files
  async submitCarForm(submissionData, slug, isEditMode = false) {
    try {
      const { urlId, subcategoryId, ...formData } = submissionData;

      // Transform form data for car submission
      const payload = this.transformCarFormData(formData, subcategoryId, urlId);

      // Create FormData for multipart upload
      const formDataToSend = new FormData();

      // Add all regular form fields
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          // Special handling for media_to_delete
          if (key === "media_to_delete" && value) {
            const cleanIds = value
              .split(",")
              .map((id) => id.trim())
              .filter((id) => id)
              .join(",");
            if (cleanIds) {
              formDataToSend.append(key, cleanIds);
            }
          } else {
            formDataToSend.append(key, value);
          }
        }
      });

      // Handle media files
      ["images", "videos"].forEach((type) => {
        if (formData[type] && Array.isArray(formData[type])) {
          formData[type].forEach((file, index) => {
            if (file instanceof File) {
              // New file upload
              formDataToSend.append(`${type}[${index}]`, file);
            } else if (file.media_image_id || file.media_video_id) {
              // Existing media file - keep reference
              const mediaId = file.media_image_id || file.media_video_id;
              formDataToSend.append(`existing_${type.slice(0, -1)}_ids[${index}]`, mediaId);
            }
          });
        }
      });

      // Debug the payload
      console.log("Final Car FormData payload:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

      // Determine the API endpoint based on mode
      const endpoint = isEditMode ? `/upload/update` : "/upload-form";

      // Submit using file upload API instance
      const response = await apiForFiles.post(endpoint, formDataToSend);

      // Handle API response that indicates failure
      if (response.data && response.data.success === false) {
        return {
          success: false,
          error: response.data.message || "Car submission failed",
          details: response.data.details || response.data.message,
          validationErrors: this.mapValidationErrors(
            response.data.errors || {}
          ),
        };
      }

      // Default success response
      return {
        success: true,
        data: response.data,
        message: isEditMode
          ? "Car updated successfully"
          : "Car submitted successfully",
      };
    } catch (error) {
      console.error("Error submitting car form:", error);

      // Handle different error scenarios
      if (error.response) {
        const { status, data } = error.response;
        const errors = data.errors || data.data?.errors || {};
        const mappedErrors = this.mapValidationErrors(errors);

        switch (status) {
          case 400:
            return {
              success: false,
              error: "Invalid car form data",
              details: data.message || "Please check your form data and try again",
              validationErrors: mappedErrors,
            };

          case 413:
            return {
              success: false,
              error: "File too large",
              details: "One or more files exceed the maximum size limit",
              validationErrors: mappedErrors,
            };

          case 422:
            return {
              success: false,
              error: "Car form validation failed",
              details: data.message || "Please check your form data",
              validationErrors: mappedErrors,
            };

          case 500:
            return {
              success: false,
              error: "Server error",
              details: "An internal server error occurred. Please try again later.",
            };

          default:
            return {
              success: false,
              error: data.message || "Car submission failed",
              details: data.message || "An unexpected error occurred",
              validationErrors: mappedErrors,
            };
        }
      } else if (error.request) {
        return {
          success: false,
          error: "Network error",
          details: "Unable to connect to the server. Please check your internet connection.",
        };
      } else {
        return {
          success: false,
          error: "Unexpected error",
          details: error.message || "An unexpected error occurred",
        };
      }
    }
  }

  // Get car subcategory ID (if you have different car subcategories)
  getCarSubcategoryId(slug) {
    // Adjust these IDs based on your backend subcategory setup
    const carSubcategoryMapping = {
      "car": 1, // Default car subcategory
      "used-cars": 1,
      "new-cars": 2,
      // Add more as needed
    };
    
    return carSubcategoryMapping[slug] || 1; // Default to 1
  }

  // Main submit method that determines subcategory automatically
  async submitForm(submissionData, slug, isEditMode = false) {
    // Get subcategory ID for cars (you might need to adjust this based on your URL structure)
    const subcategoryId = submissionData.subcategory_id || this.getCarSubcategoryId(slug);
    
    return this.submitCarForm(
      {
        ...submissionData,
        subcategoryId,
      },
      slug,
      isEditMode
    );
  }
}

// Create and export singleton instance
export const carFormService = new CarFormService();

// Export the main submit method for convenience
export const submitCarForm = (submissionData, slug, isEditMode = false) =>
  carFormService.submitForm(submissionData, slug, isEditMode);

// Export for direct use
export default carFormService;