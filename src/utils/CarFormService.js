import { apiForFiles } from "../api/axios";

class CarFormService {
  fieldMapping = {
    form_type: "form_type",
    title: "title",
    subcategory_id: "subcategory_id",
    year: "year",
    kilometers: "kilometers",
    brand_id: "brand_id",
    model_id: "model_id",
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
    media_to_delete: "media_to_delete",
  };

  mapValidationErrors(backendErrors) {
    if (!backendErrors || typeof backendErrors !== "object") {
      return {};
    }

    const mappedErrors = {};

    Object.entries(backendErrors).forEach(([backendField, errorMessage]) => {
      const frontendField = this.fieldMapping[backendField] || backendField;
      mappedErrors[frontendField] = Array.isArray(errorMessage)
        ? errorMessage[0]
        : errorMessage;
    });

    console.log("Mapped validation errors:", mappedErrors);
    return mappedErrors;
  }

  transformFormData(formData) {
    const payload = { ...formData, form_type: "car" };
    return payload;
  }

  async submitCarForm(submissionData, isEditMode = false) {
    try {
      const payload = this.transformFormData(submissionData);
      const formDataToSend = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          const backendField =
            Object.keys(this.fieldMapping).find(
              (k) => this.fieldMapping[k] === key
            ) || key;

          if (key === "media_to_delete" && value) {
            const cleanIds = value
              .split(",")
              .map((id) => id.trim())
              .filter((id) => id)
              .join(",");
            formDataToSend.append(key, cleanIds);
          } else {
            formDataToSend.append(backendField, value);
          }
        }
      });

      ["images", "videos"].forEach((type) => {
        submissionData[type]?.forEach((file, index) => {
          if (file instanceof File) {
            formDataToSend.append(`${type}[${index}]`, file);
          } else if (file.media_image_id) {
            formDataToSend.append(
              `existing_${type.slice(0, -1)}[${index}]`,
              file.media_image_id
            );
          } else if (file.media_video_id) {
            formDataToSend.append(
              `existing_${type.slice(0, -1)}[${index}]`,
              file.media_video_id
            );
          }
        });
      });

      console.log("Final Car FormData payload:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

      const endpoint = isEditMode ? "/upload/update" : "/upload-form";

      const response = await apiForFiles.post(endpoint, formDataToSend);

      if (response.data && response.data.success === false) {
        return {
          success: false,
          error: response.data.message || "Submission failed",
          details: response.data.details || response.data.message,
          validationErrors: this.mapValidationErrors(
            response.data.errors || {}
          ),
        };
      }

      return {
        success: true,
        data: response.data,
        message: isEditMode
          ? "Car details updated successfully"
          : "Car form submitted successfully",
      };
    } catch (error) {
      console.error("Error submitting car form:", error);

      if (error.response) {
        const { status, data } = error.response;
        const errors = data.errors || data.data?.errors || {};
        const mappedErrors = this.mapValidationErrors(errors);

        switch (status) {
          case 400:
            return {
              success: false,
              error: "Invalid form data",
              details: data.message || "Check form data and try again",
              validationErrors: mappedErrors,
            };
          case 413:
            return {
              success: false,
              error: "File too large",
              details: "One or more files exceed the size limit",
              validationErrors: mappedErrors,
            };
          case 422:
            return {
              success: false,
              error: "Validation failed",
              details: data.message || "Check your form data",
              validationErrors: mappedErrors,
            };
          case 500:
            return {
              success: false,
              error: "Server error",
              details: "An internal server error occurred.",
            };
          default:
            return {
              success: false,
              error: data.message || "Submission failed",
              details: data.message || "Unexpected error",
              validationErrors: mappedErrors,
            };
        }
      } else if (error.request) {
        return {
          success: false,
          error: "Network error",
          details: "Check your internet connection.",
        };
      } else {
        return {
          success: false,
          error: "Unexpected error",
          details: error.message || "Unknown issue occurred",
        };
      }
    }
  }
}

export const carFormService = new CarFormService();
export const submitCarForm = (formData, isEditMode = false) =>
  carFormService.submitCarForm(formData, isEditMode);
