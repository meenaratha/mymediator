
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ImageIcon from "@mui/icons-material/Image";
import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import { DynamicInputs } from "@/components";
import { useDispatch, useSelector } from "react-redux";

// Import dynamic validation schemas
import { uploadCarFormSchema } from "../validation/uploadCarFormShema";

// Import API services
import { dropdownService } from "../utils/propertyDropdownService";
import { submitPropertyForm } from "../utils/propertyFormService";
import { api, apiForFiles } from "../api/axios";

import {
  setFormData,
  updateFormField,
  setErrors,
  setTouched,
  setFocusedField,
  clearFocusedField,
  addFiles,
  removeFile,
  clearFiles,
  populateFormFromApi,
  setLoading,
  setApiError,
  resetForm,
  clearAutoPopulateData,
  selectIsAutoPopulating,
  updateMediaToDelete,
} from "../redux/uploadcarFormSlice";

import { useLoadScript } from "@react-google-maps/api";
import { Autocomplete } from "@react-google-maps/api";
const GOOGLE_MAP_LIBRARIES = ["places"];


const UploadCarForm = () => {
  const dispatch = useDispatch();
  const { slug, id } = useParams(); // Get both slug and id from URL params
  const location = useLocation();
  const isEditMode = location.pathname.includes("edit");

  const [autocomplete, setAutocomplete] = useState(null);

  useEffect(() => {
    if (!isEditMode) {
      dispatch(clearAutoPopulateData()); // Clear form data when not in edit mode
    }
  }, [isEditMode]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAP_LIBRARIES,
  });

  const onLoad = (autocomplete) => {
    setAutocomplete(autocomplete);
    autocomplete.setFields([
      "address_components",
      "geometry",
      "formatted_address",
    ]);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        console.log("No geometry available for this place");
        return;
      }

      // Update address and coordinates in Redux
      dispatch(
        updateFormField({
          field: "address",
          value: place.formatted_address,
        })
      );
      dispatch(
        updateFormField({
          field: "latitude",
          value: place.geometry.location.lat(),
        })
      );
      dispatch(
        updateFormField({
          field: "longitude",
          value: place.geometry.location.lng(),
        })
      );
    }
  };

  useEffect(() => {
    setValidationSchema(uploadCarFormSchema);
  }, []);

  const { formData, errors, touched, isLoading, apiError, autoPopulateData } =
    useSelector((state) => state.uploadcarform);

  const focusedField = useSelector((state) => state.uploadcarform.focusedField);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrls, setPreviewUrls] = useState({
    images: [],
    videos: [],
  });

  // State for dropdown data
  const isAutoPopulating = useSelector(selectIsAutoPopulating);
  const [dropdownData, setDropdownData] = useState({
    states: [],
    districts: [],
    cities: [],
    carBrand: [],
    carModel: [],
    fuelTypes: [],
    transmissions: [],
  });
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // Dynamic validation schema based on slug
  const [validationSchema, setValidationSchema] = useState(null);

  useEffect(() => {
    const loadDropdownData = async () => {
      setLoadingDropdowns(true);

      try {
        const carDropdowns = await dropdownService.getCarDropdowns();

        const processedDropdowns = {};
        Object.keys(carDropdowns).forEach((key) => {
          const data = carDropdowns[key];
          processedDropdowns[key] = Array.isArray(data)
            ? data
            : data?.data || data?.response || [];
        });

        setDropdownData((prev) => ({
          ...prev,
          ...processedDropdowns,
          districts: [],
          cities: [],
        }));
      } catch (error) {
        console.error("Failed to load car dropdowns:", error);
        dispatch(
          setApiError("Car form dropdowns load ஆகவில்லை. Please try again.")
        );
      } finally {
        setLoadingDropdowns(false);
      }
    };

    // Car form என்று நிச்சயமாகத்தெரிந்தால், slug இல்லாமலே load செய்யலாம்
    if (!slug) {
      loadDropdownData();
    }
  }, [slug, dispatch]);

  // image videos

  useEffect(() => {
    // Revoke previous object URLs to prevent memory leaks
    previewUrls.images.forEach((url) => {
      if (url?.url?.startsWith?.("blob:")) URL.revokeObjectURL(url.url);
    });
    previewUrls.videos.forEach((url) => {
      if (url?.url?.startsWith?.("blob:")) URL.revokeObjectURL(url.url);
    });

    // Generate image previews
    const imageUrls =
      formData.images?.map((file) => {
        const isFileObject = file instanceof File;
        return {
          file,
          url: isFileObject ? URL.createObjectURL(file) : file.url || file,
        };
      }) || [];

    // Generate video previews
    const videoUrls =
      formData.videos?.map((file) => {
        const isFileObject = file instanceof File;
        return {
          file,
          url: isFileObject ? URL.createObjectURL(file) : file.url || file,
        };
      }) || [];

    setPreviewUrls({
      images: imageUrls,
      videos: videoUrls,
    });

    return () => {
      imageUrls.forEach((item) => {
        if (item?.url?.startsWith?.("blob:")) URL.revokeObjectURL(item.url);
      });
      videoUrls.forEach((item) => {
        if (item?.url?.startsWith?.("blob:")) URL.revokeObjectURL(item.url);
      });
    };
  }, [formData.images, formData.videos]);

  // Console log to verify Redux state updates
  useEffect(() => {
    console.log("Form data updated:", formData);
    console.log("Current slug:", slug);
    console.log("URL ID:", id);
  }, [formData, slug, id]);

  // Handle file selection with validation
  const handleFileChange = async (e, type) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length === 0) return;

    // Filter files based on type
    const filteredFiles =
      type === "images"
        ? selectedFiles.filter((file) => file.type.startsWith("image/"))
        : selectedFiles.filter((file) => file.type.startsWith("video/"));

    if (filteredFiles.length === 0) {
      dispatch(
        setErrors({
          ...errors,
          [type]: `Only ${
            type === "images" ? "image" : "video"
          } files are allowed`,
        })
      );
      dispatch(setTouched(type));
      return;
    }

    // Clear any previous errors for this field
    if (errors[type]) {
      dispatch(
        setErrors({
          ...errors,
          [type]: "",
        })
      );
    }

    // Use the addFiles action to update Redux store
    dispatch(addFiles({ type, files: filteredFiles }));

    // For debugging
    console.log(`Added ${filteredFiles.length} files to ${type}`);

    // Validate the files right after adding them
    if (validationSchema) {
      try {
        const updatedFiles = [...(formData[type] || []), ...filteredFiles];
        await validationSchema.validateAt(type, { [type]: updatedFiles });
      } catch (err) {
        dispatch(
          setErrors({
            ...errors,
            [type]: err.message,
          })
        );
        dispatch(setTouched(type));
      }
    }
  };

  // Handle file drag-and-drop with validation
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e, type) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);

    if (droppedFiles.length === 0) return;

    // Filter files based on type
    const filteredFiles =
      type === "images"
        ? droppedFiles.filter((file) => file.type.startsWith("image/"))
        : droppedFiles.filter((file) => file.type.startsWith("video/"));

    if (filteredFiles.length === 0) {
      dispatch(
        setErrors({
          ...errors,
          [type]: `Only ${
            type === "images" ? "image" : "video"
          } files are allowed`,
        })
      );
      dispatch(setTouched(type));
      return;
    }

    // Clear any previous errors for this field
    if (errors[type]) {
      dispatch(
        setErrors({
          ...errors,
          [type]: "",
        })
      );
    }

    // Use the addFiles action to update Redux store
    dispatch(addFiles({ type, files: filteredFiles }));

    // For debugging
    console.log(`Added ${filteredFiles.length} files to ${type} via drop`);

    // Validate the files right after adding them
    if (validationSchema) {
      try {
        const updatedFiles = [...(formData[type] || []), ...filteredFiles];
        await validationSchema.validateAt(type, { [type]: updatedFiles });
      } catch (err) {
        dispatch(
          setErrors({
            ...errors,
            [type]: err.message,
          })
        );
        dispatch(setTouched(type));
      }
    }
  };

  // Track deleted media IDs in state
  const [deletedMediaIds, setDeletedMediaIds] = useState({
    images: [],
    videos: [],
  });

  const handleRemoveFile = (type, index) => {
    const file = formData[type][index];

    // Track deleted IDs
    if (file?.media_image_id || file?.media_video_id) {
      const id = file.media_image_id || file.media_video_id;
      const newDeletedIds = [...deletedMediaIds[type], id];

      setDeletedMediaIds((prev) => ({
        ...prev,
        [type]: newDeletedIds,
      }));

      // Update formData.media_to_delete immediately
      const allDeleted = [
        ...newDeletedIds,
        ...(type === "images"
          ? deletedMediaIds.videos
          : deletedMediaIds.images),
      ].join(",");

      dispatch(
        updateFormField({
          field: "media_to_delete",
          value: allDeleted,
        })
      );
    }

    // Remove from UI
    dispatch(removeFile({ type, index }));
  };

  const handleClearFiles = (type) => {
    const files = formData[type] || [];
    const idsToDelete = files
      .filter((file) => file?.media_image_id || file?.media_video_id)
      .map((file) => file.media_image_id || file.media_video_id);

    if (idsToDelete.length > 0) {
      const newDeletedIds = [...deletedMediaIds[type], ...idsToDelete];
      setDeletedMediaIds((prev) => ({
        ...prev,
        [type]: newDeletedIds,
      }));

      // Update formData.media_to_delete
      const allDeleted = [
        ...newDeletedIds,
        ...(type === "images"
          ? deletedMediaIds.videos
          : deletedMediaIds.images),
      ].join(",");

      dispatch(
        updateFormField({
          field: "media_to_delete",
          value: allDeleted,
        })
      );
    }

    dispatch(clearFiles(type));
  };

  // Handle input change and clear error
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Use updateFormField for better performance
    dispatch(updateFormField({ field: name, value }));

    // Clear any existing error for this field when user starts typing
    if (errors[name]) {
      dispatch(setErrors({ ...errors, [name]: "" }));
    }
  };

  // Handle field blur for validation
  const handleBlur = async (e) => {
    const { name } = e.target;
    dispatch(setTouched(name));

    if (!validationSchema) return;

    try {
      await validationSchema.validateAt(name, formData);
      dispatch(setErrors({ ...errors, [name]: "" }));
    } catch (err) {
      dispatch(setErrors({ ...errors, [name]: err.message }));
    }
  };

  // handle submit

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent double submission
    if (isLoading) {
      return;
    }

    if (!validationSchema) {
      dispatch(
        setApiError("Validation schema not loaded. Please refresh the page.")
      );
      return;
    }
    // Get isEditMode from the URL
    const isEditMode = location.pathname.includes("edit");

    // Clear any previous errors
    dispatch(setErrors({}));
    dispatch(setApiError(null));

    try {
      // Set loading state
      dispatch(setLoading(true));
      // Validate form data locally first
      await validationSchema.validate(formData, { abortEarly: false });

      // If validation passes, mark all fields as touched before submission
      const allFieldsTouched = {};
      Object.keys(formData).forEach((key) => {
        allFieldsTouched[key] = true;
      });
      dispatch({
        type: "uploadcarform/setAllTouched",
        payload: allFieldsTouched,
      });

      console.log("✅ Client-side validation passed:", formData);

      // Prepare media_to_delete string
      const allDeletedMedia = [
        ...deletedMediaIds.images,
        ...deletedMediaIds.videos,
      ].join(",");

      // Prepare the media_to_delete string from deletedMediaIds state
      const mediaToDeleteString = deletedMediaIds.images.join(",");

      // Prepare submission data with URL params
      const submissionData = {
        ...formData,
        media_to_delete: allDeletedMedia, // Formatted string
        action_id: isEditMode ? formData.action_id : undefined,
        subcategory_id: id, // Subcategory ID based on slug
        slug: slug, // Current slug
      };

      console.log("Submitting form data:", submissionData);
      // Submit form with edit mode flag
      const result = await submitPropertyForm(submissionData, slug, isEditMode);

      if (result.success) {
        alert(
          isEditMode
            ? "car updated successfully!"
            : "Form submitted successfully!"
        );
        if (!isEditMode) {
          dispatch(resetForm());
        }
        // Clear deleted media IDs after successful submission
        setDeletedMediaIds({ images: [], videos: [] });
      } else {
        // Handle backend errors
        if (result.error || result.details) {
          dispatch(
            setApiError(result.error || result.details || "Submission failed")
          );
        }

        if (
          result.validationErrors &&
          Object.keys(result.validationErrors).length > 0
        ) {
          dispatch(setErrors(result.validationErrors));

          const firstErrorField = Object.keys(result.validationErrors)[0];
          if (firstErrorField) {
            dispatch(setFocusedField(firstErrorField));
            setTimeout(() => {
              const errorElement = document.getElementById(firstErrorField);
              if (errorElement) {
                errorElement.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
                errorElement.focus();
              }
            }, 100);
          }
        }
      }
    } catch (err) {
      // Handle validation errors
      if (err.name === "ValidationError" && err.inner) {
        console.log("❌ Validation failed:", err.inner);

        // Create error object
        const formattedErrors = {};
        const touchedFields = {};

        err.inner.forEach((error) => {
          formattedErrors[error.path] = error.message;
          touchedFields[error.path] = true;
        });

        // Mark ALL fields as touched to show all errors
        const allFields = Object.keys(formData).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {});

        // Dispatch both errors and touched state
        dispatch(setErrors(formattedErrors));
        dispatch({
          type: "uploadcarform/setAllTouched",
          payload: allFields,
        });

        // Focus on first error field
        if (err.inner.length > 0) {
          const firstErrorField = err.inner[0].path;

          // Small delay to ensure DOM is updated
          setTimeout(() => {
            const errorElement = document.getElementById(firstErrorField);
            if (errorElement) {
              errorElement.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
              errorElement.focus();
            }
          }, 100);
        }
      } else {
        dispatch(
          setApiError(err.message || "An error occurred during validation")
        );
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Helper function to render dropdown options
  const renderDropdownOptions = (options) => {
    if (!Array.isArray(options)) return [];

    return options.map((option) => ({
      value: option.id || option.value || option.key,
      label: option.name || option.label || option.title || option.text,
    }));
  };

  // Show loading state while dropdowns are loading
  if (loadingDropdowns) {
    return (
      <div className="bg-gray-50 p-6 rounded-3xl w-full max-w-6xl shadow-[0_0_10px_rgba(176,_176,_176,_0.25)] mx-auto border border-[#b9b9b9] bg-[#f6f6f6]">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-gray-600">Loading form ...</span>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="bg-gray-50 p-6 rounded-3xl w-full max-w-6xl shadow-[0_0_10px_rgba(176,_176,_176,_0.25)] mx-auto border border-[#b9b9b9] bg-[#f6f6f6]">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-gray-600">Error map loading</span>
        </div>
      </div>
    );
  }
  if (!isLoaded) {
    return (
      <div className="bg-gray-50 p-6 rounded-3xl w-full max-w-6xl shadow-[0_0_10px_rgba(176,_176,_176,_0.25)] mx-auto border border-[#b9b9b9] bg-[#f6f6f6]">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-gray-600"> map loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-50 p-6 rounded-3xl w-full max-w-6xl shadow-[0_0_10px_rgba(176,_176,_176,_0.25)] mx-auto border border-[#b9b9b9] bg-[#f6f6f6]">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-center text-xl font-medium text-[#02487C] flex-1">
            Car Upload Form
          </h1>
        </div>
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="subcategory_id" value={id} />
          {/* Row 1 - Common fields for all property types */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-gray-800 font-medium mb-2 px-4">
                AD Title
              </label>
              <DynamicInputs
                type="text"
                name="title"
                id="title"
                className="w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf]
                               bg-white focus:outline-none "
                placeholder="Enter Tittle"
                onChange={handleChange}
                value={formData.title || ""}
                onBlur={handleBlur}
                error={errors.title}
                touched={touched.title}
                focusedField={focusedField}
              />
            </div>

            <div>
              <label className="block text-gray-800 font-medium mb-2 px-4">
                Brand Name
              </label>
              <DynamicInputs
                type="select"
                name="brand_id"
                id="brand_id"
                className="appearance-none w-full max-w-sm px-4 py-3 rounded-full border 
                border-[#bfbfbf] bg-white focus:outline-none "
                placeholder="Select Brand"
                onChange={handleChange}
                value={formData.brand_id || ""}
                onBlur={handleBlur}
                error={errors.brand_id}
                touched={touched.brand_id}
                focusedField={focusedField}
                options={renderDropdownOptions(dropdownData.carBrand)}
              />
            </div>

            <div>
              <label className="block text-gray-800 font-medium mb-2 px-4">
                Model Name
              </label>
              <DynamicInputs
                type="select"
                name="model_id"
                id="model_id"
                className="appearance-none w-full max-w-sm px-4 py-3 rounded-full border 
                border-[#bfbfbf] bg-white focus:outline-none "
                placeholder="Select Brand"
              />
            </div>
          </div>

          {/* Row 2 - Common fields for all property types */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-gray-800 font-medium mb-2 px-4">
                Enter kilometers
              </label>
              <DynamicInputs
                type="text"
                name="kilometers"
                id="kilometers"
                className="appearance-none w-full max-w-sm px-4 py-3 rounded-full border 
                border-[#bfbfbf] bg-white focus:outline-none "
                placeholder="Enter kilometers"
              />
            </div>

            <div>
              <label className="block text-gray-800 font-medium mb-2 px-4">
                Enter year
              </label>
              <DynamicInputs
                type="text"
                name="year"
                id="year"
                className="appearance-none w-full max-w-sm px-4 py-3 rounded-full border 
                border-[#bfbfbf] bg-white focus:outline-none "
                placeholder="Enter year"
              />
            </div>

            <div>
              <label className="block text-gray-800 font-medium mb-2 px-4">
                Address
              </label>
              <DynamicInputs
                type="text"
                name="address"
                id="city_addressid"
                className="appearance-none w-full max-w-sm px-4 py-3 rounded-full border 
                border-[#bfbfbf] bg-white focus:outline-none "
                placeholder="Select city"
              />
            </div>
          </div>

          {/* Row 3 - Common fields for all property types */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-gray-800 font-medium mb-2 px-4">
                Enter State
              </label>
              <DynamicInputs
                type="select"
                name="state_id"
                id="state_id"
                className="appearance-none w-full max-w-sm px-4 py-3 rounded-full border 
                border-[#bfbfbf] bg-white focus:outline-none "
                placeholder="Select state"
              />
            </div>

            <div>
              <label className="block text-gray-800 font-medium mb-2 px-4">
                Enter District
              </label>
              <DynamicInputs
                type="select"
                name="district_id"
                id="district_id"
                className="appearance-none w-full max-w-sm px-4 py-3 rounded-full border 
                border-[#bfbfbf] bg-white focus:outline-none "
                placeholder="Select district"
              />
            </div>

            <div>
              <label className="block text-gray-800 font-medium mb-2 px-4">
                Select City
              </label>
              <DynamicInputs
                type="select"
                name="city_id"
                id="city_id"
                className="appearance-none w-full max-w-sm px-4 py-3 rounded-full border 
                border-[#bfbfbf] bg-white focus:outline-none "
                placeholder="Select city"
              />
            </div>
          </div>

          {/* Row 4 - Common fields for all property types */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-gray-800 font-medium mb-2 px-4">
                Enter Fuel type
              </label>
              <DynamicInputs
                type="select"
                name="fuel_type_id"
                id="fuel_type_id"
                className="appearance-none w-full max-w-sm px-4 py-3 rounded-full border 
                border-[#bfbfbf] bg-white focus:outline-none "
                placeholder="Select Fuel type "
              />
            </div>

            <div>
              <label className="block text-gray-800 font-medium mb-2 px-4">
                Select transmission
              </label>
              <DynamicInputs
                type="select"
                name="transmission_id"
                id="transmission_id"
                className="appearance-none w-full max-w-sm px-4 py-3 rounded-full border 
                border-[#bfbfbf] bg-white focus:outline-none "
                placeholder="Select transmission"
              />
            </div>

            <div>
              <label className="block text-gray-800 font-medium mb-2 px-4">
                Select Owner
              </label>
              <DynamicInputs
                type="select"
                name="number_of_owner_id"
                id="number_of_owner_id"
                className="appearance-none w-full max-w-sm px-4 py-3 rounded-full border 
                border-[#bfbfbf] bg-white focus:outline-none "
                placeholder="Select Owner"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-gray-800 font-medium mb-2 px-4">
                Enter Prize
              </label>
              <DynamicInputs
                type="text"
                name="price"
                id="price"
                className="appearance-none w-full max-w-sm px-4 py-3 rounded-full border 
                border-[#bfbfbf] bg-white focus:outline-none "
                placeholder="Enter Prize "
              />
            </div>

            <div>
              <label className="block text-gray-800 font-medium mb-2 px-4">
                Enter Mobile No.
              </label>
              <DynamicInputs
                type="text"
                name="mobile_number"
                id="mobile_number"
                className="appearance-none w-full max-w-sm px-4 py-3 rounded-full border 
                border-[#bfbfbf] bg-white focus:outline-none "
                placeholder="Enter mobile no.  "
              />
            </div>
          </div>
          {/* Description text area - Common for all types */}
          <div className="mb-6">
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Description
            </label>

            <DynamicInputs
              type="textarea"
              name="description"
              id="description"
              className="w-full max-w-[100%] h-[90px] px-4 py-3 rounded-[10px] border border-[#bfbfbf] 
              bg-white focus:outline-none "
              placeholder="Enter description"
            />
          </div>

          {/* File Upload Section - Common for all types */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 mx-auto">
            {/* Image Upload */}
            <div>
              <label className="block text-gray-800 font-medium mb-2 px-4">
                Image Upload
              </label>
              <DynamicInputs
                type="file-image"
                name="images"
                id="image-upload"
                accept="image/*"
              />

              {/* Display image file previews and clear icon */}
              {/* {formData.images && formData.images.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-700">
                      Selected Images: {formData.images.length}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleClearFiles("images")}
                      className="text-red-500 hover:text-red-700"
                    >
                      <DeleteIcon sx={{ cursor: "pointer" }} />
                    </button>
                  </div>
                  <ul className="mt-2 flex flex-wrap gap-[10px]">
                    {previewUrls.images.map((item, index) => (
                      <li
                        key={index}
                        className="relative flex items-center justify-between p-2 border border-gray-200 rounded-lg mb-2 hover:bg-gray-50 w-[fit-content]"
                      >
                        <div className="w-[140px] h-[140px] rounded-[10px] object-cover">
                          <img
                            src={item.url}
                            alt={`Image ${index}`}
                            title={item.file.name}
                            className="object-cover w-[100%] h-[100%] rounded-[10px]"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile("images", index)}
                          className="absolute top-[-15px] border border-[#bfbfbf] right-[-10px] z-10 text-red-500 hover:text-red-700 focus:outline-none cursor-pointer w-[30px] h-[30px] flex items-center justify-center rounded-full bg-[#fff]"
                        >
                          <ClearIcon fontSize="small" />
                        </button>
                      </li>
                    ))}
                  </ul>
                  {touched.images && errors.images && (
                    <p className="text-red-500 text-xs mt-2 px-4">
                      {errors.images}
                    </p>
                  )}
                </div>
              )} */}
            </div>

            {/* Video Upload */}
            <div>
              <label className="block text-gray-800 font-medium mb-2 px-4">
                Video Upload
              </label>
              <DynamicInputs
                type="file-video"
                name="videos"
                id="video-upload"
                accept="video/*"
              />

              {/* Display video file previews and clear icon */}
              {/* {formData.videos && formData.videos.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-700">
                      Selected Videos: {formData.videos.length}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleClearFiles("videos")}
                      className="text-red-500 hover:text-red-700"
                    >
                      <DeleteIcon sx={{ cursor: "pointer" }} />
                    </button>
                  </div>
                  <ul className="mt-2">
                    {previewUrls.videos.map((item, index) => (
                      <li
                        key={index}
                        className="relative flex items-center justify-between p-2 border border-gray-200 rounded-lg mb-2 hover:bg-gray-50 w-[fit-content]"
                      >
                        <div className="mt-2">
                          <video
                            src={item.url}
                            controls
                            className="w-[250px] h-[170px] rounded-[10px]"
                            title={item.file.name}
                          >
                            Your browser does not support the video tag.
                          </video>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile("videos", index)}
                          className="absolute top-[-15px] border border-[#bfbfbf] right-[-10px] z-10 text-red-500 hover:text-red-700 focus:outline-none cursor-pointer w-[30px] h-[30px] flex items-center justify-center rounded-full bg-[#fff]"
                        >
                          <ClearIcon fontSize="small" />
                        </button>
                      </li>
                    ))}
                  </ul>
                  {touched.videos && errors.videos && (
                    <p className="text-red-500 text-xs mt-2 px-4">
                      {errors.videos}
                    </p>
                  )}
                </div>
              )} */}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="cursor-pointer bg-[#02487c] text-white
             text-lg font-medium rounded-full px-10 py-3 hover:bg-blue-900 focus:outline-none disabled:opacity-50"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default UploadCarForm
