import { api, apiForFiles } from "../api/axios";

// Electronics form submission service
class ElectronicsFormService {
  // Field mapping: backend field name -> frontend field name (for error handling)
  fieldMapping = {
    form_type: "form_type",
    title: "title",
    subcategory_id: "subcategory_id",
    brand_id: "brand_id",
    brand_name: "brand_name",
    model_id: "model_id",
    model_name: "model_name",
    price: "price",
    features: "features",
    specifications: "specifications",
    description: "description",
    status: "status",
    state_id: "state_id",
    district_id: "district_id",
    city_id: "city_id",
    address: "address",
    year:"year",
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

  // Transform electronics form data
  transformElectronicsFormData(formData, subcategoryId, urlId) {
    const payload = {
      // Required fields
      form_type: "electronics",
      subcategory_id: subcategoryId,
      url_id: urlId, // ID from URL params
      
      // Electronics specific fields
      title: formData.title || "",
      price: formData.price || "",
      features: formData.features || "",
      specifications: formData.specifications || "",
      description: formData.description || "",
      mobile_number: formData.mobile_number || "",
      year:formData.year || "",
      // Location fields
      address: formData.address || "",
      latitude: formData.latitude || "",
      longitude: formData.longitude || "",
      state_id: parseInt(formData.state_id) || formData.state_id || "",
      district_id: parseInt(formData.district_id) || formData.district_id || "",
      city_id: parseInt(formData.city_id) || formData.city_id || "",
      
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

    console.log("Transformed electronics form data:", payload);
    return payload;
  }

  // Submit electronics form with files
  async submitElectronicsForm(submissionData, slug, isEditMode = false) {
    try {
      const { urlId, subcategoryId, ...formData } = submissionData;

      // Transform form data for electronics submission
      const payload = this.transformElectronicsFormData(formData, subcategoryId, urlId);

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
      console.log("Final Electronics FormData payload:");
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
          error: response.data.message || "Electronics submission failed",
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
          ? "Electronics updated successfully"
          : "Electronics submitted successfully",
      };
    } catch (error) {
      console.error("Error submitting electronics form:", error);

      // Handle different error scenarios
      if (error.response) {
        const { status, data } = error.response;
        const errors = data.errors || data.data?.errors || {};
        const mappedErrors = this.mapValidationErrors(errors);

        switch (status) {
          case 400:
            return {
              success: false,
              error: "Invalid electronics form data",
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
              error: "Electronics form validation failed",
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
              error: data.message || "Electronics submission failed",
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

  // Get electronics subcategory ID (if you have different electronics subcategories)
  getElectronicsSubcategoryId(slug) {
    // Adjust these IDs based on your backend subcategory setup
    const electronicsSubcategoryMapping = {
      "electronics": 1, // Default electronics subcategory
      "mobile-phones": 1,
      "laptops": 2,
      "tv-audio": 3,
      "cameras": 4,
      "gaming": 5,
      // Add more as needed
    };
    
    return electronicsSubcategoryMapping[slug] || 1; // Default to 1
  }

  // Main submit method that determines subcategory automatically
  async submitForm(submissionData, slug, isEditMode = false) {
    // Get subcategory ID for electronics (you might need to adjust this based on your URL structure)
    const subcategoryId = submissionData.subcategory_id || this.getElectronicsSubcategoryId(slug);
    
    return this.submitElectronicsForm(
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
export const electronicsFormService = new ElectronicsFormService();

// Export the main submit method for convenience
export const submitElectronicsForm = (submissionData, slug, isEditMode = false) =>
  electronicsFormService.submitForm(submissionData, slug, isEditMode);

// Export for direct use
export default electronicsFormService;