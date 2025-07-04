
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

  // Add these state variables at the top of your component
  const [showOtherBrand, setShowOtherBrand] = useState(false);
  const [showOtherModel, setShowOtherModel] = useState(false);

  // Dynamic validation schema based on slug
  const [validationSchema, setValidationSchema] = useState(uploadCarFormSchema);

  useEffect(() => {
    const loadDropdownData = async () => {
      console.log("🔄 Loading dropdown data for slug:", slug);
      setLoadingDropdowns(true);

      try {
        const data = await dropdownService.getDropdownsForPropertyType(
          slug || "car"
        );

        console.log("📦 Raw dropdown data received:", data);

        const processedData = {
          states: response.states?.data || response.states || [],
          districts: [],
          cities: [],
          carBrand: response.carBrand?.data || response.carBrand || [],
          carModel: [],
          fuelTypes: response.fuelTypes?.data || response.fuelTypes || [],
          transmissions:
            response.transmissions?.data || response.transmissions || [],
        };

        console.log("✅ Processed dropdown data:", processedData);
        console.log("🚗 Car brands count:", processedData.carBrand.length);

        setDropdownData(processedData);
        setLoadingDropdowns(false);
      } catch (error) {
        console.error("❌ Failed to load dropdowns:", error);
        console.error("Error details:", error.response?.data || error.message);
        dispatch(setApiError("Failed to load dropdown data"));
        setLoadingDropdowns(false);
      }
    };

    loadDropdownData();
  }, [slug, dispatch]);

  // 3. Add debugging to your car models loading effect
  useEffect(() => {
    const loadCarModels = async () => {
      if (formData.brand_id) {
        console.log("🔄 Loading car models for brand_id:", formData.brand_id);

        try {
          const models = await dropdownService.getcarModel(formData.brand_id);
          console.log("📦 Car models received:", models);

          setDropdownData((prev) => {
            const newData = {
              ...prev,
              carModel: models || [],
            };
            console.log("✅ Updated dropdown data with models:", newData);
            return newData;
          });
        } catch (error) {
          console.error("❌ Failed to load car models:", error);
        }
      } else {
        console.log("⚠️ No brand_id selected, clearing models");
        setDropdownData((prev) => ({
          ...prev,
          carModel: [],
        }));
      }
    };

    loadCarModels();
  }, [formData.brand_id]);

  // 4. Add a debugging useEffect to monitor dropdownData state
  useEffect(() => {
    console.log("📊 Dropdown data state updated:", dropdownData);
    console.log("🚗 Car brands in state:", dropdownData.carBrand);
    console.log("🚙 Car models in state:", dropdownData.carModel);
  }, [dropdownData]);

  // Load districts when state changes
  useEffect(() => {
    const loadDistricts = async () => {
      if (formData.state_id) {
        try {
          const districts = await dropdownService.getDistricts(
            formData.state_id
          );
          setDropdownData((prev) => ({
            ...prev,
            districts: districts || [],
            cities: [], // Reset cities when state changes
          }));
          // Reset district and city in form if state changes
          dispatch(updateFormField({ field: "district_id", value: "" }));
          dispatch(updateFormField({ field: "city_id", value: "" }));
        } catch (error) {
          console.error("Failed to load districts:", error);
        }
      }
    };

    loadDistricts();
  }, [formData.state_id, dispatch]);

  // Load cities when district changes
  useEffect(() => {
    const loadCities = async () => {
      if (formData.district_id) {
        try {
          const cities = await dropdownService.getCities(formData.district_id);
          setDropdownData((prev) => ({
            ...prev,
            cities: cities || [],
          }));
          // Reset city in form if district changes
          dispatch(updateFormField({ field: "city_id", value: "" }));
        } catch (error) {
          console.error("Failed to load cities:", error);
        }
      }
    };

    loadCities();
  }, [formData.district_id, dispatch]);

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

  // Enhanced handleChange function with better "Other" handling
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form field
    dispatch(updateFormField({ field: name, value }));

    // Handle Brand selection logic
    if (name === "brand_id") {
      if (value === "other") {
        setShowOtherBrand(true);
        // Clear brand_name when switching to other
        dispatch(updateFormField({ field: "brand_name", value: "" }));
      } else {
        setShowOtherBrand(false);
        // Clear brand_name when selecting a predefined brand
        dispatch(updateFormField({ field: "brand_name", value: "" }));
      }

      // Reset model selection when brand changes
      dispatch(updateFormField({ field: "model_id", value: "" }));
      dispatch(updateFormField({ field: "model_name", value: "" }));
      setShowOtherModel(false);
    }

    // Handle Model selection logic
    if (name === "model_id") {
      if (value === "other") {
        setShowOtherModel(true);
        // Clear model_name when switching to other
        dispatch(updateFormField({ field: "model_name", value: "" }));
      } else {
        setShowOtherModel(false);
        // Clear model_name when selecting a predefined model
        dispatch(updateFormField({ field: "model_name", value: "" }));
      }
    }

    // Handle location dependencies
    if (name === "state_id") {
      dispatch(updateFormField({ field: "district_id", value: "" }));
      dispatch(updateFormField({ field: "city_id", value: "" }));
    }

    if (name === "district_id") {
      dispatch(updateFormField({ field: "city_id", value: "" }));
    }

    // Clear errors when user starts typing
    if (errors[name]) {
      dispatch(setErrors({ ...errors, [name]: "" }));
    }
  };

  // Handle form field changes with proper validation
    const handleFieldChange = (field, value) => {
      dispatch(updateFormField({ field, value }));
  
      // Handle dependent dropdown resets for manual changes (not auto-population)
      if (!isAutoPopulating) {
        if (field === "state_id") {
          // Clear dependent fields when state changes
          if (formData.district) {
            dispatch(updateFormField({ field: "district_id", value: "" }));
          }
          if (formData.city) {
            dispatch(updateFormField({ field: "city_id", value: "" }));
          }
        } else if (field === "district_id") {
          // Clear city when district changes
          if (formData.city) {
            dispatch(updateFormField({ field: "city_id", value: "" }));
          }
        }
      }
    };
  

  // Enhanced useEffect for edit mode initialization
  useEffect(() => {
    // Initialize "Other" states based on existing data
    if (
      formData.brand_id === "other" ||
      (formData.brand_name && !formData.brand_id)
    ) {
      setShowOtherBrand(true);
    } else {
      setShowOtherBrand(false);
    }

    if (
      formData.model_id === "other" ||
      (formData.model_name && !formData.model_id)
    ) {
      setShowOtherModel(true);
    } else {
      setShowOtherModel(false);
    }
  }, [
    formData.brand_id,
    formData.model_id,
    formData.brand_name,
    formData.model_name,
  ]);

  // Enhanced function to check if "Other" option should be added
  const shouldAddOtherOption = (options) => {
    if (!Array.isArray(options)) return false;

    // Check if "Other" option already exists in API data
    const hasOtherOption = options.some(
      (option) =>
        option.id === "other" ||
        option.value === "other" ||
        (option.name && option.name.toLowerCase() === "other")
    );

    return !hasOtherOption;
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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Prevent double submission
  //   if (isLoading) {
  //     return;
  //   }

  //   if (!validationSchema) {
  //     dispatch(
  //       setApiError("Validation schema not loaded. Please refresh the page.")
  //     );
  //     return;
  //   }
  //   // Get isEditMode from the URL
  //   const isEditMode = location.pathname.includes("edit");

  //   // Clear any previous errors
  //   dispatch(setErrors({}));
  //   dispatch(setApiError(null));

  //   try {
  //     // Set loading state
  //     dispatch(setLoading(true));
  //     // Validate form data locally first
  //     await validationSchema.validate(formData, { abortEarly: false });

  //     // If validation passes, mark all fields as touched before submission
  //     const allFieldsTouched = {};
  //     Object.keys(formData).forEach((key) => {
  //       allFieldsTouched[key] = true;
  //     });
  //     dispatch({
  //       type: "uploadcarform/setAllTouched",
  //       payload: allFieldsTouched,
  //     });

  //     console.log("✅ Client-side validation passed:", formData);

  //     // Prepare media_to_delete string
  //     const allDeletedMedia = [
  //       ...deletedMediaIds.images,
  //       ...deletedMediaIds.videos,
  //     ].join(",");

  //     // Prepare the media_to_delete string from deletedMediaIds state
  //     const mediaToDeleteString = deletedMediaIds.images.join(",");

  //     // Prepare submission data with URL params
  //     const submissionData = {
  //       ...formData,
  //       media_to_delete: allDeletedMedia, // Formatted string
  //       action_id: isEditMode ? formData.action_id : undefined,
  //       subcategory_id: id, // Subcategory ID based on slug
  //       slug: slug, // Current slug
  //     };

  //     console.log("Submitting form data:", submissionData);
  //     // Submit form with edit mode flag
  //     const result = await submitPropertyForm(submissionData, slug, isEditMode);

  //     if (result.success) {
  //       alert(
  //         isEditMode
  //           ? "car updated successfully!"
  //           : "Form submitted successfully!"
  //       );
  //       if (!isEditMode) {
  //         dispatch(resetForm());
  //       }
  //       // Clear deleted media IDs after successful submission
  //       setDeletedMediaIds({ images: [], videos: [] });
  //     } else {
  //       // Handle backend errors
  //       if (result.error || result.details) {
  //         dispatch(
  //           setApiError(result.error || result.details || "Submission failed")
  //         );
  //       }

  //       if (
  //         result.validationErrors &&
  //         Object.keys(result.validationErrors).length > 0
  //       ) {
  //         dispatch(setErrors(result.validationErrors));

  //         const firstErrorField = Object.keys(result.validationErrors)[0];
  //         if (firstErrorField) {
  //           dispatch(setFocusedField(firstErrorField));
  //           setTimeout(() => {
  //             const errorElement = document.getElementById(firstErrorField);
  //             if (errorElement) {
  //               errorElement.scrollIntoView({
  //                 behavior: "smooth",
  //                 block: "center",
  //               });
  //               errorElement.focus();
  //             }
  //           }, 100);
  //         }
  //       }
  //     }
  //   } catch (err) {
  //     // Handle validation errors
  //     if (err.name === "ValidationError" && err.inner) {
  //       console.log("❌ Validation failed:", err.inner);

  //       // Create error object
  //       const formattedErrors = {};
  //       const touchedFields = {};

  //       err.inner.forEach((error) => {
  //         formattedErrors[error.path] = error.message;
  //         touchedFields[error.path] = true;
  //       });

  //       // Mark ALL fields as touched to show all errors
  //       const allFields = Object.keys(formData).reduce((acc, key) => {
  //         acc[key] = true;
  //         return acc;
  //       }, {});

  //       // Dispatch both errors and touched state
  //       dispatch(setErrors(formattedErrors));
  //       dispatch({
  //         type: "uploadcarform/setAllTouched",
  //         payload: allFields,
  //       });

  //       // Focus on first error field
  //       if (err.inner.length > 0) {
  //         const firstErrorField = err.inner[0].path;

  //         // Small delay to ensure DOM is updated
  //         setTimeout(() => {
  //           const errorElement = document.getElementById(firstErrorField);
  //           if (errorElement) {
  //             errorElement.scrollIntoView({
  //               behavior: "smooth",
  //               block: "center",
  //             });
  //             errorElement.focus();
  //           }
  //         }, 100);
  //       }
  //     } else {
  //       dispatch(
  //         setApiError(err.message || "An error occurred during validation")
  //       );
  //     }
  //   } finally {
  //     dispatch(setLoading(false));
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    if (!validationSchema) {
      dispatch(
        setApiError("Validation schema not loaded. Please refresh the page.")
      );
      return;
    }

    const isEditMode = location.pathname.includes("edit");

    dispatch(setErrors({}));
    dispatch(setApiError(null));

    try {
      dispatch(setLoading(true));
      await validationSchema.validate(formData, { abortEarly: false });

      const allFieldsTouched = {};
      Object.keys(formData).forEach((key) => {
        allFieldsTouched[key] = true;
      });
      dispatch({
        type: "uploadcarform/setAllTouched",
        payload: allFieldsTouched,
      });

      console.log("✅ Client-side validation passed:", formData);

      const allDeletedMedia = [
        ...deletedMediaIds.images,
        ...deletedMediaIds.videos,
      ].join(",");

      const submissionData = {
        ...formData,
        media_to_delete: allDeletedMedia,
        action_id: isEditMode ? formData.action_id : undefined,
        subcategory_id: id, // ID from URL
        slug: slug, // current slug
        url_id: urlId, // add this if required by your backend
      };

      // 🟡 Important: Let the service decide if full or partial data should be sent
      const result = await submitPropertyForm(submissionData, slug, isEditMode);

      if (result.success) {
        alert(
          isEditMode
            ? "Car updated successfully!"
            : "Form submitted successfully!"
        );
        if (!isEditMode) {
          dispatch(resetForm());
        }
        setDeletedMediaIds({ images: [], videos: [] });
      } else {
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
      if (err.name === "ValidationError" && err.inner) {
        console.log("❌ Validation failed:", err.inner);
        const formattedErrors = {};
        const touchedFields = {};
        err.inner.forEach((error) => {
          formattedErrors[error.path] = error.message;
          touchedFields[error.path] = true;
        });
        const allFields = Object.keys(formData).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {});
        dispatch(setErrors(formattedErrors));
        dispatch({ type: "uploadcarform/setAllTouched", payload: allFields });

        if (err.inner.length > 0) {
          const firstErrorField = err.inner[0].path;
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
  

  // Enhanced renderDropdownOptions with smart "Other" handling
  const renderDropdownOptionsWithOther = (options, fieldName = "") => {
    console.log(`🔄 Rendering dropdown options for ${fieldName}:`, options);

    // Handle nested API response structure
    let dataArray = options;

    if (options && typeof options === "object" && !Array.isArray(options)) {
      if (options.data && Array.isArray(options.data)) {
        dataArray = options.data;
      } else {
        console.warn("⚠️ Options object doesn't have a data array:", options);
        return [{ value: "other", label: "Other" }];
      }
    }

    if (!Array.isArray(dataArray)) {
      console.warn(
        "⚠️ Final data is not an array:",
        typeof dataArray,
        dataArray
      );
      return [{ value: "other", label: "Other" }];
    }

    // Process options
    const processedOptions = dataArray.map((option, index) => ({
      value: option.id || option.value || option.key || index,
      label:
        option.name ||
        option.label ||
        option.title ||
        option.text ||
        `Option ${index + 1}`,
    }));

    // Add "Other" option if it doesn't exist in API data
    if (shouldAddOtherOption(dataArray)) {
      processedOptions.push({ value: "other", label: "Other" });
    }

    console.log(
      `✅ Final processed options for ${fieldName}:`,
      processedOptions
    );
    return processedOptions;
  };

  // SOLUTION 3: Enhanced renderDropdownOptions function
  const renderDropdownOptions = (options) => {
    console.log("🔄 Rendering dropdown options:", options);

    // Handle nested API response structure
    let dataArray = options;

    // If it's an object with 'data' property, extract the data array
    if (options && typeof options === "object" && !Array.isArray(options)) {
      if (options.data && Array.isArray(options.data)) {
        dataArray = options.data;
        console.log("📦 Extracted data array from response:", dataArray);
      } else {
        console.warn("⚠️ Options object doesn't have a data array:", options);
        return [];
      }
    }

    if (!Array.isArray(dataArray)) {
      console.warn(
        "⚠️ Final data is not an array:",
        typeof dataArray,
        dataArray
      );
      return [];
    }

    if (dataArray.length === 0) {
      console.warn("⚠️ Data array is empty");
      return [];
    }

    const processedOptions = dataArray.map((option, index) => {
      console.log(`Processing option ${index}:`, option);

      return {
        value: option.id || option.value || option.key,
        label: option.name || option.label || option.title || option.text,
      };
    });

    console.log("✅ Final processed options:", processedOptions);
    return processedOptions;
  };

  // SOLUTION 4: Alternative approach - Create a helper function
  const extractDataFromResponse = (response) => {
    if (!response) return [];

    // If response has a 'data' property, use it
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }

    // If response is already an array, use it directly
    if (Array.isArray(response)) {
      return response;
    }

    // Otherwise, return empty array
    return [];
  };

  // Then use it in your useEffect:
  useEffect(() => {
    const loadDropdownData = async () => {
      console.log("🔄 Loading dropdown data for slug:", slug);
      setLoadingDropdowns(true);

      try {
        const response = await dropdownService.getDropdownsForPropertyType(
          slug || "car"
        );

        console.log("📦 Raw API response:", response);

        const processedData = {
          states: extractDataFromResponse(response.states),
          districts: [],
          cities: [],
          carBrand: extractDataFromResponse(response.carBrand),
          carModel: [],
          fuelTypes: extractDataFromResponse(response.fuelTypes),
          transmissions: extractDataFromResponse(response.transmissions),
        };

        console.log("✅ Processed dropdown data:", processedData);
        setDropdownData(processedData);
        setLoadingDropdowns(false);
      } catch (error) {
        console.error("❌ Failed to load dropdowns:", error);
        dispatch(setApiError("Failed to load dropdown data"));
        setLoadingDropdowns(false);
      }
    };

    loadDropdownData();
  }, [slug, dispatch]);

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
                className="w-full px-4 py-3 rounded-full border border-[#bfbfbf]
                   bg-white focus:outline-none"
                placeholder="Enter Title"
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
                Brand Name <span className="text-red-500">*</span>
              </label>

              {!showOtherBrand && (
                <DynamicInputs
                  type="select"
                  name="brand_id"
                  id="brand_id"
                  className="appearance-none w-full px-4 py-3 rounded-full border
                 border-[#bfbfbf] bg-white focus:outline-none"
                  placeholder="Select Brand"
                  onChange={handleChange}
                  value={formData.brand_id || ""}
                  onBlur={handleBlur}
                  error={errors.brand_id}
                  touched={touched.brand_id}
                  focusedField={focusedField}
                  options={renderDropdownOptionsWithOther(
                    dropdownData.carBrand,
                    "brand"
                  )}
                  disabled={loadingDropdowns}
                />
              )}

              {showOtherBrand && (
                <>
                  <DynamicInputs
                    type="text"
                    name="brand_name"
                    id="brand_name"
                    className="w-full px-4 py-3 rounded-full border border-[#bfbfbf]
                     bg-white focus:outline-none"
                    placeholder="Enter Brand Name"
                    onChange={handleChange}
                    value={formData.brand_name || ""}
                    onBlur={handleBlur}
                    error={errors.brand_name}
                    touched={touched.brand_name}
                    focusedField={focusedField}
                  />
                </>
              )}
            </div>

            <div>
              <label className="block text-gray-800 font-medium mb-2 px-4">
                Model Name <span className="text-red-500">*</span>
              </label>
              {!showOtherModel && (
                <DynamicInputs
                  type="select"
                  name="model_id"
                  id="model_id"
                  className="appearance-none w-full px-4 py-3 rounded-full border
                   border-[#bfbfbf] bg-white focus:outline-none"
                  placeholder="Select Model"
                  onChange={handleChange}
                  value={formData.model_id || ""}
                  onBlur={handleBlur}
                  error={errors.model_id}
                  touched={touched.model_id}
                  focusedField={focusedField}
                  options={renderDropdownOptionsWithOther(
                    dropdownData.carModel,
                    "model"
                  )}
                  disabled={loadingDropdowns}
                />
              )}

              {showOtherModel && (
                <>
                  <DynamicInputs
                    type="text"
                    name="model_name"
                    id="model_name"
                    className="w-full px-4 py-3 rounded-full border border-[#bfbfbf]
                     bg-white focus:outline-none"
                    placeholder="Enter Model Name"
                    onChange={handleChange}
                    value={formData.model_name || ""}
                    onBlur={handleBlur}
                    error={errors.model_name}
                    touched={touched.model_name}
                    focusedField={focusedField}
                  />
                </>
              )}
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
                onChange={handleChange}
                value={formData.kilometers || ""}
                onBlur={handleBlur}
                error={errors.kilometers}
                touched={touched.kilometers}
                focusedField={focusedField}
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
                value={formData.year || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.year}
                touched={touched.year}
                focusedField={focusedField}
              />
            </div>

            <div>
              <label className="block text-gray-800 font-medium mb-2 px-4">
                Address
              </label>
              <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                <DynamicInputs
                  type="text"
                  name="address"
                  id="address"
                  className="appearance-none w-full max-w-sm px-4 py-3 rounded-full border 
                border-[#bfbfbf] bg-white focus:outline-none "
                  placeholder="Enter address"
                  onChange={handleChange}
                  value={formData.address || ""}
                  onBlur={handleBlur}
                  error={errors.address}
                  touched={touched.address}
                  focusedField={focusedField}
                />
              </Autocomplete>
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
                placeholder={isAutoPopulating ? "Loading..." : "Select state"}
                onChange={(e) => handleFieldChange("state_id", e.target.value)}
                value={formData.state_id || ""}
                onBlur={handleBlur}
                error={errors.state_id}
                touched={touched.state_id}
                focusedField={focusedField}
                options={renderDropdownOptions(dropdownData.states)}
                loading={loadingDropdowns || isAutoPopulating}
                disabled={loadingDropdowns || isAutoPopulating}
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
                placeholder={
                  !formData.state
                    ? "Select state first"
                    : loadingDistricts || isAutoPopulating
                    ? "Loading..."
                    : "Select district"
                }
                onChange={(e) =>
                  handleFieldChange("district_id", e.target.value)
                }
                value={formData.district_id || ""}
                onBlur={handleBlur}
                error={errors.district_id}
                touched={touched.district_id}
                focusedField={focusedField}
                options={renderDropdownOptions(dropdownData.districts)}
                disabled={
                  !formData.state_id || loadingDistricts || isAutoPopulating
                }
                loading={loadingDistricts || isAutoPopulating}
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
                placeholder={
                  !formData.district_id
                    ? "Select district first"
                    : loadingCities || isAutoPopulating
                    ? "Loading..."
                    : "Select city"
                }
                onChange={(e) => handleFieldChange("city_id", e.target.value)}
                value={formData.city_id || ""}
                onBlur={handleBlur}
                error={errors.city_id}
                touched={touched.city_id}
                focusedField={focusedField}
                options={renderDropdownOptions(dropdownData.cities)}
                disabled={
                  !formData.district_id || loadingCities || isAutoPopulating
                }
                loading={loadingCities || isAutoPopulating}
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
                onChange={handleChange}
                value={formData.fuel_type_id || ""}
                onBlur={handleBlur}
                error={errors.fuel_type_id}
                touched={touched.fuel_type_id}
                focusedField={focusedField}
                options={renderDropdownOptions(dropdownData.fuelTypes)}
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
                onChange={handleChange}
                value={formData.transmission_id || ""}
                onBlur={handleBlur}
                error={errors.transmission_id}
                touched={touched.transmission_id}
                focusedField={focusedField}
                options={renderDropdownOptions(dropdownData.fuelTypes)}
              />
            </div>

            <div>
              <label className="block text-gray-800 font-medium mb-2 px-4">
                Owner
              </label>
              <DynamicInputs
                type="text"
                name="number_of_owner_id"
                id="number_of_owner_id"
                className="appearance-none w-full max-w-sm px-4 py-3 rounded-full border 
                border-[#bfbfbf] bg-white focus:outline-none "
                placeholder="Select Owner"
                onChange={handleChange}
                value={formData.number_of_owner_id || ""}
                onBlur={handleBlur}
                error={errors.number_of_owner_id}
                touched={touched.number_of_owner_id}
                focusedField={focusedField}
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
                onChange={handleChange}
                value={formData.price || ""}
                onBlur={handleBlur}
                error={errors.price}
                touched={touched.price}
                focusedField={focusedField}
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
                onChange={handleChange}
                value={formData.mobile_number || ""}
                onBlur={handleBlur}
                error={errors.mobile_number}
                touched={touched.mobile_number}
                focusedField={focusedField}
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
              onChange={handleChange}
              value={formData.description || ""}
              onBlur={handleBlur}
              error={errors.description}
              touched={touched.description}
              focusedField={focusedField}
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
                handleFileChange={(e) => handleFileChange(e, "images")}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, "images")}
                isDragging={isDragging}
                error={errors.images}
                touched={touched.images}
                accept="image/*"
              />

              {/* Display image file previews and clear icon */}
              {formData.images && formData.images.length > 0 && (
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
              )}
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
                handleFileChange={(e) => handleFileChange(e, "videos")}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, "videos")}
                isDragging={isDragging}
                error={errors.videos}
                touched={touched.videos}
                accept="video/*"
              />

              {/* Display video file previews and clear icon */}
              {formData.videos && formData.videos.length > 0 && (
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
              )}
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
