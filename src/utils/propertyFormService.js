import { api, apiForFiles } from "../api/axios";

// Property form submission service
class PropertyFormService {
  // Get subcategory ID mapping for all slugs
  getSubcategoryMapping() {
    return {
      "for-sale-houses-apartments": 1,
      "for-rent-houses-apartments": 2,
      "lands-plots": 3,
      "for-sale-shops-offices": 4,
      "for-rent-shops-offices": 5,
    };
  }

  // Get subcategory ID from slug
  getSubcategoryIdFromSlug(slug) {
    const mapping = this.getSubcategoryMapping();
    return mapping[slug] || 3; // Default to lands-plots
  }

  // Transform form data based on slug/subcategory
  transformFormData(formData, slug, subcategoryId, urlId) {
    // Base payload structure
    const basePayload = {
      form_type: "property",
      subcategory_id: subcategoryId,
      url_id: urlId, // ID from URL params
      property_name: formData.propertyName,
      mobile_number: formData.mobileNumber,
      address: formData.address,
      state_id: parseInt(formData.state) || formData.state,
      district_id: parseInt(formData.district) || formData.district,
      city_id: parseInt(formData.city) || formData.city,
      description: formData.description,
      amount: parseInt(formData.amount) || formData.amount,
      listed_by: parseInt(formData.listedBy) || formData.listedBy,
      building_direction_id:
        parseInt(formData.buildingDirection) || formData.buildingDirection,
      status: "available",
    };

    // Add slug-specific fields
    switch (slug) {
      case "lands-plots":
        return {
          ...basePayload,
          plot_area: parseInt(formData.plotArea) || formData.plotArea,
          length: parseInt(formData.length) || formData.length,
          breadth: parseInt(formData.breadth) || formData.breadth,
        };

      case "for-sale-houses-apartments":
      case "for-rent-houses-apartments":
        return {
          ...basePayload,
          bedrooms: parseInt(formData.bedroom) || formData.bedroom,
          bathroom: parseInt(formData.bathroom) || formData.bathroom,
          bhk_id: parseInt(formData.bhk) || formData.bhk,
          furnished_id: parseInt(formData.furnished) || formData.furnished,
          construction_status_id:
            parseInt(formData.constructionStatus) ||
            formData.constructionStatus,
          super_builtup_area:
            parseInt(formData.superBuildArea) || formData.superBuildArea,
          carpet_area: parseInt(formData.carpetArea) || formData.carpetArea,
          floor_no: parseInt(formData.floorNumber) || formData.floorNumber,
          total_floors: parseInt(formData.totalFloor) || formData.totalFloor,
          maintenance_id:
            parseInt(formData.maintenance) || formData.maintenance,
          bachelor: formData.bachelor,
          bike_parking: parseInt(formData.bikeParking) || formData.bikeParking,
          car_parking: parseInt(formData.carParking) || formData.carParking,
        };

      case "for-sale-shops-offices":
      case "for-rent-shops-offices":
        return {
          ...basePayload,
          furnished_id: parseInt(formData.furnished) || formData.furnished,
          construction_status_id:
            parseInt(formData.constructionStatus) ||
            formData.constructionStatus,
          super_builtup_area:
            parseInt(formData.superBuildArea) || formData.superBuildArea,
          carpet_area: parseInt(formData.carpetArea) || formData.carpetArea,
          floor_no: parseInt(formData.floorNumber) || formData.floorNumber,
          total_floors: parseInt(formData.totalFloor) || formData.totalFloor,
          maintenance_id:
            parseInt(formData.maintenance) || formData.maintenance,
          washroom: parseInt(formData.washRoom) || formData.washRoom,
          bike_parking: parseInt(formData.bikeParking) || formData.bikeParking,
          car_parking: parseInt(formData.carParking) || formData.carParking,
        };

      default:
        return basePayload;
    }
  }

  // Submit form with files
  async submitPropertyForm(submissionData, slug) {
    try {
      const { urlId, subcategoryId, ...formData } = submissionData;

      // Transform form data based on slug
      const payload = this.transformFormData(
        formData,
        slug,
        subcategoryId,
        urlId
      );

      // Create FormData for multipart upload
      const formDataToSend = new FormData();

      // Add all form fields to FormData
      Object.keys(payload).forEach((key) => {
        if (
          payload[key] !== null &&
          payload[key] !== undefined &&
          payload[key] !== ""
        ) {
          formDataToSend.append(key, payload[key]);
        }
      });

      // Add images if they exist
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((image) => {
          formDataToSend.append(`images[]`, image);
        });
      }

      // Add videos if they exist
      if (formData.videos && formData.videos.length > 0) {
        formData.videos.forEach((video) => {
          formDataToSend.append(`videos[]`, video);
        });
      }

      // Log payload for debugging
      console.log("Submitting form with payload:", {
        slug,
        subcategoryId,
        urlId,
        formFields: Object.fromEntries(
          Object.entries(payload).filter(
            ([key, value]) =>
              value !== null && value !== undefined && value !== ""
          )
        ),
        imageCount: formData.images?.length || 0,
        videoCount: formData.videos?.length || 0,
      });

      // Submit using file upload API instance
      const response = await apiForFiles.post("/upload-form", formDataToSend);

      return {
        success: true,
        data: response.data,
        message: "Property form submitted successfully",
      };
    } catch (error) {
      console.error("Error submitting property form:", error);

      // Handle different error scenarios
      if (error.response) {
        const { status, data } = error.response;

        switch (status) {
          case 400:
            return {
              success: false,
              error: "Invalid form data",
              details:
                data.message || "Please check your form data and try again",
              validationErrors: data.errors || {},
            };

          case 413:
            return {
              success: false,
              error: "File too large",
              details: "One or more files exceed the maximum size limit",
            };

          case 422:
            return {
              success: false,
              error: "Validation failed",
              details: data.message || "Please check your form data",
              validationErrors: data.errors || {},
            };

          case 500:
            return {
              success: false,
              error: "Server error",
              details:
                "An internal server error occurred. Please try again later.",
            };

          default:
            return {
              success: false,
              error: "Submission failed",
              details: data.message || "An unexpected error occurred",
            };
        }
      } else if (error.request) {
        return {
          success: false,
          error: "Network error",
          details:
            "Unable to connect to the server. Please check your internet connection.",
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

  // Submit form with automatic subcategory detection
  async submitForm(submissionData, slug) {
    const subcategoryId = this.getSubcategoryIdFromSlug(slug);
    return this.submitPropertyForm(
      {
        ...submissionData,
        subcategoryId,
      },
      slug
    );
  }

  // Get form configuration for a slug
  getFormConfig(slug) {
    const configs = {
      "for-sale-houses-apartments": {
        title: "Houses & Apartments for Sale",
        type: "house-apartment-sale",
        subcategoryId: 1,
      },
      "for-rent-houses-apartments": {
        title: "Houses & Apartments for Rent",
        type: "house-apartment-rent",
        subcategoryId: 2,
      },
      "lands-plots": {
        title: "Land & Plot",
        type: "land-plot",
        subcategoryId: 3,
      },
      "for-sale-shops-offices": {
        title: "Shops & Offices for Sale",
        type: "commercial-sale",
        subcategoryId: 4,
      },
      "for-rent-shops-offices": {
        title: "Shops & Offices for Rent",
        type: "commercial-rent",
        subcategoryId: 5,
      },
    };

    return configs[slug] || configs["lands-plots"];
  }

  // Validate slug
  isValidSlug(slug) {
    const validSlugs = [
      "for-sale-houses-apartments",
      "for-rent-houses-apartments",
      "lands-plots",
      "for-sale-shops-offices",
      "for-rent-shops-offices",
    ];
    return validSlugs.includes(slug);
  }
}

// Create and export singleton instance
export const propertyFormService = new PropertyFormService();

// Export the main submit method for convenience
export const submitPropertyForm = (submissionData, slug) =>
  propertyFormService.submitForm(submissionData, slug);

// Export form configuration helper
export const getFormConfig = (slug) => propertyFormService.getFormConfig(slug);

// Export slug validation helper
export const isValidSlug = (slug) => propertyFormService.isValidSlug(slug);
