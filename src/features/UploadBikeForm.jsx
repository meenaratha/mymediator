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
import {  createBikeFormSchema, getVehicleType } from "../validation/BikeFormSchema";

// Import API services
import { dropdownService } from "../utils/propertyDropdownService";
import { submitBikeForm } from "../utils/BikeFormService";
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
} from "../redux/uploadBikeFormSlice";

import { useLoadScript } from "@react-google-maps/api";
import { Autocomplete } from "@react-google-maps/api";
const GOOGLE_MAP_LIBRARIES = ["places"];

const UploadBikeForm = () => {
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
  // Create dynamic validation schema based on slug
  const dynamicSchema = createBikeFormSchema(slug);
  setValidationSchema(dynamicSchema);
  
  console.log("🔧 Validation schema updated for slug:", slug);
}, [slug]);


  const { formData, errors, touched, isLoading, apiError, autoPopulateData } =
    useSelector((state) => state.uploadbikeform);

  const focusedField = useSelector((state) => state.uploadbikeform.focusedField);
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
    bikeBrand: [],
    bikeModel: [],
    fuelTypes: [],
    numberOfOwners: [],
  });
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // Add these state variables at the top of your component
  const [showOtherBrand, setShowOtherBrand] = useState(false);
  const [showOtherModel, setShowOtherModel] = useState(false);

  // Dynamic validation schema based on slug
  const [validationSchema, setValidationSchema] = useState();

  useEffect(() => {
    const loadDropdownData = async () => {
      console.log("🔄 Loading dropdown data for slug:", slug);
      setLoadingDropdowns(true);

      try {
        const response = await dropdownService.getDropdownsForPropertyType(
          slug || "bike"
        );

        console.log("📦 Raw dropdown data received:", response);

        const processedDropdowns = {
          states: response.states?.data || response.states || [],
          districts: [],
          cities: [],
         bikeBrand: response.bikeBrand?.data || response.bikeBrand || [],
          bikeModel: [],
         fuelTypes: response.FuelTypes?.data || response.FuelTypes || response.fuelTypes?.data || response.fuelTypes || [],
          numberOfOwners: response.bikeOwners?.data || response.bikeOwners || response.numberOfOwners?.data || response.numberOfOwners || [],
        };

        console.log("✅ Processed dropdown data:", processedDropdowns);
        console.log("🏍️ Bike brands count:", processedDropdowns.bikeBrand.length);

        setDropdownData((prev) => ({
          ...prev,
          ...processedDropdowns,
          districts: [], // Will be loaded when state is selected
          cities: [], // Will be loaded when district is selected
        }));
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

  // Enhanced function to load districts
  const loadDistricts = useCallback(
    async (stateId) => {
      if (!stateId) return;

      setLoadingDistricts(true);
      try {
        console.log("Loading districts for state:", stateId);
        const response = await dropdownService.getDistricts(stateId);

        // Handle different response formats
        let districtsData = [];
        if (Array.isArray(response)) {
          districtsData = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          districtsData = response.data;
        } else if (
          response &&
          response.districts &&
          Array.isArray(response.districts)
        ) {
          districtsData = response.districts;
        } else if (
          response &&
          response.response &&
          Array.isArray(response.response)
        ) {
          districtsData = response.response;
        }

        console.log("Loaded districts:", districtsData);

        setDropdownData((prev) => ({
          ...prev,
          districts: districtsData,
        }));

        return districtsData; // Return the data for chaining
      } catch (error) {
        console.error("Failed to load districts:", error);
        setDropdownData((prev) => ({
          ...prev,
          districts: [],
          cities: [],
        }));
        dispatch(setApiError("Failed to load districts. Please try again."));
        return [];
      } finally {
        setLoadingDistricts(false);
      }
    },
    [dispatch]
  );

  // Enhanced function to load cities
  const loadCities = useCallback(
    async (districtId) => {
      if (!districtId) return;

      setLoadingCities(true);
      try {
        console.log("Loading cities for district:", districtId);
        const response = await dropdownService.getCities(districtId);

        // Handle different response formats
        let citiesData = [];
        if (Array.isArray(response)) {
          citiesData = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          citiesData = response.data;
        } else if (
          response &&
          response.cities &&
          Array.isArray(response.cities)
        ) {
          citiesData = response.cities;
        } else if (
          response &&
          response.response &&
          Array.isArray(response.response)
        ) {
          citiesData = response.response;
        }

        console.log("Loaded cities:", citiesData);

        setDropdownData((prev) => ({
          ...prev,
          cities: citiesData,
        }));

        return citiesData; // Return the data for chaining
      } catch (error) {
        console.error("Failed to load cities:", error);
        setDropdownData((prev) => ({
          ...prev,
          cities: [],
        }));
        dispatch(setApiError("Failed to load cities. Please try again."));
        return [];
      } finally {
        setLoadingCities(false);
      }
    },
    [dispatch]
  );

  // Load districts when state changes
  useEffect(() => {
    if (!formData.state_id) {
      // Clear districts and cities if no state selected
      if (!isAutoPopulating) {
        setDropdownData((prev) => ({
          ...prev,
          districts: [],
          cities: [],
        }));
        // Clear dependent fields
        if (formData.district_id) {
          dispatch(updateFormField({ field: "district_id", value: "" }));
        }
        if (formData.city_id) {
          dispatch(updateFormField({ field: "city_id", value: "" }));
        }
      }
      return;
    }

    // Load districts for the selected state
    loadDistricts(formData.state_id);
  }, [
    formData.state_id,
    loadDistricts,
    dispatch,
    isAutoPopulating,
    formData.district_id,
    formData.city_id,
  ]);

  // Load cities when district changes
  useEffect(() => {
    if (!formData.district_id) {
      // Clear cities if no district selected
      if (!isAutoPopulating) {
        setDropdownData((prev) => ({
          ...prev,
          cities: [],
        }));
        // Clear city field
        if (formData.city_id) {
          dispatch(updateFormField({ field: "city_id", value: "" }));
        }
      }
      return;
    }

    // Load cities for the selected district
    loadCities(formData.district_id);
  }, [
    formData.district_id,
    loadCities,
    dispatch,
    isAutoPopulating,
    formData.city_id,
  ]);

  // Special handling for auto-population - ensure dependent dropdowns are loaded
  useEffect(() => {
    if (isAutoPopulating && formData.state_id && formData.district_id) {
      // When auto-populating, we need to ensure districts are loaded first
      const ensureDistrictsLoaded = async () => {
        if (dropdownData.districts.length === 0) {
          await loadDistricts(formData.state_id);
        }
        // Then load cities if we have a district
        if (formData.district_id && dropdownData.cities.length === 0) {
          await loadCities(formData.district_id);
        }
      };

      ensureDistrictsLoaded();
    }
  }, [
    isAutoPopulating,
    formData.state_id,
    formData.district_id,
    dropdownData.districts.length,
    dropdownData.cities.length,
    loadDistricts,
    loadCities,
  ]);

  // Load bike models when brand changes
  useEffect(() => {
    const loadBikeModels = async () => {
      if (!formData.brand_id || formData.brand_id === "other") {
        setDropdownData((prev) => ({
          ...prev,
          bikeModel: [],
        }));
        return;
      }

      try {
        console.log("Loading bike models for brand:", formData.brand_id);
        const models = await dropdownService.getbikeModel(formData.brand_id);
        setDropdownData((prev) => ({
          ...prev,
          bikeModel: models || [],
        }));
      } catch (error) {
        console.error("Failed to load bike models:", error);
        setDropdownData((prev) => ({
          ...prev,
          bikeModel: [],
        }));
      }
    };

    loadBikeModels();
  }, [formData.brand_id]);

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

  const currentValidationSchema = createBikeFormSchema(slug);
  if (!currentValidationSchema) return;

  // Skip validation for bicycle-excluded fields
  const isBicycle = slug?.toLowerCase().includes('bicycle');
  const bicycleExcludedFields = ['kilometers', 'engine_cc', 'fuel_type_id'];
  
  if (isBicycle && bicycleExcludedFields.includes(name)) {
    console.log(`🚲 Skipping validation for ${name} (bicycle mode)`);
    return;
  }

  try {
    await currentValidationSchema.validateAt(name, formData);
    dispatch(setErrors({ ...errors, [name]: "" }));
  } catch (err) {
    dispatch(setErrors({ ...errors, [name]: err.message }));
  }
};

  // Update your handleSubmit function to use the dynamic schema:
const handleSubmit = async (e) => {
  e.preventDefault();

  if (isLoading) return;

  // Create validation schema based on current slug
  const currentValidationSchema = createBikeFormSchema(slug);
  
  if (!currentValidationSchema) {
    dispatch(
      setApiError("Validation schema not loaded. Please refresh the page.")
    );
    return;
  }

  const isEditMode = location.pathname.includes("edit");
  const isBicycle = slug?.toLowerCase().includes('bicycle');

  dispatch(setErrors({}));
  dispatch(setApiError(null));

  try {
    dispatch(setLoading(true));
    
    // Filter form data to exclude irrelevant fields for bicycles
    let dataToValidate = { ...formData };
    
    if (isBicycle) {
      // Remove motor bike specific fields from validation data
      const { kilometers, engine_cc, fuel_type_id, ...bicycleData } = dataToValidate;
      dataToValidate = bicycleData;
      
      console.log("🚲 Validating bicycle data (excluding motor bike fields):", Object.keys(dataToValidate));
    } else {
      console.log("🏍️ Validating motor bike data (all fields):", Object.keys(dataToValidate));
    }
    
    await currentValidationSchema.validate(dataToValidate, { abortEarly: false });

    const allFieldsTouched = {};
    Object.keys(formData).forEach((key) => {
      allFieldsTouched[key] = true;
    });
    dispatch({
      type: "uploadbikeform/setAllTouched",
      payload: allFieldsTouched,
    });

    console.log("✅ Client-side validation passed:", dataToValidate);

    const allDeletedMedia = [
      ...deletedMediaIds.images,
      ...deletedMediaIds.videos,
    ].join(",");

    const submissionData = {
      ...formData,
      media_to_delete: allDeletedMedia,
      action_id: isEditMode ? formData.action_id : undefined,
      subcategory_id: id,
      slug: slug,
      urlId: id,
      vehicle_type: getVehicleType(slug), // Add vehicle type for backend
    };

    console.log("🏍️ Submitting bike form data:", submissionData);

    const result = await submitBikeForm(submissionData, slug, isEditMode);

    if (result.success) {
      alert(
        isEditMode
          ? `${isBicycle ? 'Bicycle' : 'Bike'} updated successfully!`
          : `${isBicycle ? 'Bicycle' : 'Bike'} submitted successfully!`
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
      dispatch({ type: "uploadbikeform/setAllTouched", payload: allFields });

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


  const renderDropdownOptionsWithOther = (options, fieldName = "") => {
    // console.log(`🔄 Rendering dropdown options for ${fieldName}:`, options);

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
    // FIX: Better handling of option properties
    const value = option.id || option.value || option.key || index;
    const label = option.name || option.label || option.title || option.text || option.display_name || `Option ${index + 1}`;
    
    return {
      value: value,
      label: label,
    };
  });
    // console.log("✅ Final processed options:", processedOptions);
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

  // Enhanced useEffect for bike models loading
  useEffect(() => {
  const loadBikeModels = async () => {
    if (formData.brand_id && formData.brand_id !== "other") {
      console.log("🔄 Loading bike models for brand_id:", formData.brand_id);

      try {
        setDropdownData((prev) => ({
          ...prev,
          bikeModel: [], // Clear existing models while loading
        }));

        const models = await dropdownService.getBikeModel(formData.brand_id);
        console.log("📦 Bike models received:", models);

        // FIX: Better handling of different response formats
        let modelData = [];
        if (Array.isArray(models)) {
          modelData = models;
        } else if (models && models.data && Array.isArray(models.data)) {
          modelData = models.data;
        } else if (models && models.response && Array.isArray(models.response)) {
          modelData = models.response;
        } else if (models && models.bikeModel && Array.isArray(models.bikeModel)) {
          modelData = models.bikeModel;
        }

        console.log("🏍️ Processed bike models:", modelData);

        setDropdownData((prev) => {
          const newData = {
            ...prev,
            bikeModel: modelData,
          };
          console.log("✅ Updated dropdown data with models:", newData);
          return newData;
        });
      } catch (error) {
        console.error("❌ Failed to load bike models:", error);
        setDropdownData((prev) => ({
          ...prev,
          bikeModel: [],
        }));
        // Don't show error for models as it's not critical
      }
    } else {
      console.log("⚠️ No brand_id selected or brand is 'other', clearing models");
      setDropdownData((prev) => ({
        ...prev,
        bikeModel: [],
      }));
    }
  };

  // Only load models when not in auto-populating mode OR when it's the initial load
  if (!isAutoPopulating || formData.brand_id) {
    loadBikeModels();
  }
}, [formData.brand_id, isAutoPopulating]);


  // Enhanced useEffect for edit mode initialization with proper dependent dropdowns
  useEffect(() => {
    const loadBikeDataForEdit = async () => {
      // Only run in edit mode and when we have an ID
      if (!isEditMode || !id) {
        return;
      }

      console.log("🔄 Loading bike data for edit mode, ID:", id);
      
      try {
        dispatch(setLoading(true));
        dispatch(setApiError(null));
        
        // Fetch bike data from API
        const response = await api.get(`/bike/${id}/edit`);
        const result = response.data;
        
        console.log("📦 Bike API response:", result);
        
        if (result && (result.data || result.status)) {
          const bikeData = result.data || result;
          console.log("✅ Bike data received:", bikeData);
          
          // Map API response to form fields
          const formFields = {
            // Basic Information
            action_id: bikeData.id || bikeData.action_id,
            form_type: "bike",
            title: bikeData.title || "",
            subcategory_id: bikeData.subcategory_id || "",
            year: bikeData.year || "",
            kilometers: bikeData.kilometers || "",
            engine_cc: bikeData.engine_cc || "",
            price: bikeData.price || "",
            description: bikeData.description || "",
            mobile_number: bikeData.mobile_number || "",
            
            // Bike specifications
            brand_id: bikeData.brand_id || "",
            brand_name: bikeData.brand_name || "",
            model_id: bikeData.model_id || "",
            model_name: bikeData.model_name || "",
            fuel_type_id: bikeData.fuel_type_id || "",
            number_of_owner_id: bikeData.number_of_owner_id || "",
            
            // Location
            address: bikeData.address || "",
            latitude: bikeData.latitude || "",
            longitude: bikeData.longitude || "",
            state_id: bikeData.state_id || "",
            district_id: bikeData.district_id || "",
            city_id: bikeData.city_id || "",
            
            // Status
            status: bikeData.status || "available",
            
            // Media files
            images: transformMediaFiles(bikeData.images || [], 'image'),
            videos: transformMediaFiles(bikeData.videos || [], 'video'),
            
            // Media deletion tracking
            media_to_delete: "",
          };
          
          console.log("🔧 Transformed form fields:", formFields);
          
          // Populate form using Redux action
          dispatch(populateFormFromApi(formFields));
          
          // Load dependent dropdowns AFTER populating form data
          if (bikeData.state_id) {
            console.log("🌍 Loading districts for state:", bikeData.state_id);
            await loadDistricts(bikeData.state_id);
            
            // Load cities after districts are loaded
            if (bikeData.district_id) {
              console.log("🏙️ Loading cities for district:", bikeData.district_id);
              await loadCities(bikeData.district_id);
            }
          }
          
          // Load bike models if brand is selected
          if (bikeData.brand_id && bikeData.brand_id !== "other") {
            console.log("🏍️ Loading bike models for brand:", bikeData.brand_id);
            try {
              const models = await dropdownService.getBikeModel(bikeData.brand_id);
              setDropdownData((prev) => ({
                ...prev,
                bikeModel: models || [],
              }));
            } catch (error) {
              console.error("❌ Failed to load bike models:", error);
            }
          }
          
          console.log("✅ Bike form populated successfully");
        } else {
          console.error("❌ Invalid bike API response:", result);
          dispatch(setApiError("Failed to load bike data - invalid response"));
        }
      } catch (error) {
        console.error("❌ Error loading bike data:", error);
        
        if (error.response) {
          const { status, data } = error.response;
          switch (status) {
            case 404:
              dispatch(setApiError("Bike not found"));
              break;
            case 403:
              dispatch(setApiError("You don't have permission to edit this bike"));
              break;
            case 500:
              dispatch(setApiError("Server error occurred"));
              break;
            default:
              dispatch(setApiError(data.message || "Failed to load bike data"));
          }
        } else {
          dispatch(setApiError("Failed to load bike data for editing"));
        }
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadBikeDataForEdit();
  }, [isEditMode, id, dispatch, loadDistricts, loadCities]);

  // Add this helper function inside your component (before the return statement):
  const transformMediaFiles = (mediaArray, type) => {
    if (!Array.isArray(mediaArray)) {
      return [];
    }

    return mediaArray.map((media, index) => {
      console.log(`📎 Processing ${type} ${index + 1}:`, media);
      
      // Create a file-like object that passes validation
      const transformedMedia = {
        // API data
        [`media_${type}_id`]: media.id || media.media_image_id || media.media_video_id,
        url: media.url || media.file_path,
        name: media.name || `${type}_${index + 1}`,
        
        // Form validation requirements
        type: type === 'image' ? 'image/jpeg' : 'video/mp4',
        size: media.size || 0,
        isFromApi: true,
        
        // Original API data for reference
        originalData: media,
      };

      console.log(`✅ Transformed ${type}:`, transformedMedia);
      return transformedMedia;
    });
  };

  // Add this useEffect to handle "Other" brand/model detection in edit mode:
  useEffect(() => {
    // Handle "Other" brand detection in edit mode
    if (formData.brand_name && (!formData.brand_id || formData.brand_id === "")) {
      // If we have brand_name but no brand_id, it's a custom brand
      console.log("🏷️ Detected custom brand:", formData.brand_name);
      setShowOtherBrand(true);
      dispatch(updateFormField({ field: "brand_id", value: "other" }));
    } else if (formData.brand_id === "other") {
      setShowOtherBrand(true);
    } else if (formData.brand_id && dropdownData.bikeBrand.length > 0) {
      // Check if the brand_id exists in dropdown
      const brandExists = dropdownData.bikeBrand.find(
        brand => String(brand.id) === String(formData.brand_id)
      );
      if (!brandExists && formData.brand_name) {
        console.log("🏷️ Brand ID not found in dropdown, showing custom:", formData.brand_name);
        setShowOtherBrand(true);
        dispatch(updateFormField({ field: "brand_id", value: "other" }));
      } else {
        setShowOtherBrand(false);
      }
    }

    // Handle "Other" model detection in edit mode
    if (formData.model_name && (!formData.model_id || formData.model_id === "")) {
      // If we have model_name but no model_id, it's a custom model
      console.log("🏍️ Detected custom model:", formData.model_name);
      setShowOtherModel(true);
      dispatch(updateFormField({ field: "model_id", value: "other" }));
    } else if (formData.model_id === "other") {
      setShowOtherModel(true);
    } else if (formData.model_id && dropdownData.bikeModel.length > 0) {
      // Check if the model_id exists in dropdown
      const modelExists = dropdownData.bikeModel.find(
        model => String(model.id) === String(formData.model_id)
      );
      if (!modelExists && formData.model_name) {
        console.log("🏍️ Model ID not found in dropdown, showing custom:", formData.model_name);
        setShowOtherModel(true);
        dispatch(updateFormField({ field: "model_id", value: "other" }));
      } else {
        setShowOtherModel(false);
      }
    }
  }, [
    formData.brand_id, 
    formData.model_id, 
    formData.brand_name, 
    formData.model_name, 
    dropdownData.bikeBrand,
    dropdownData.bikeModel,
    dispatch
  ]);


const isBicycle = slug?.toLowerCase().includes('bicycles');



  if (isEditMode && isLoading && !formData.title) {
    return (
      <div className="bg-gray-50 p-6 rounded-3xl w-full max-w-6xl shadow-[0_0_10px_rgba(176,_176,_176,_0.25)] mx-auto border border-[#b9b9b9] bg-[#f6f6f6]">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-gray-600">Loading bike data for editing...</span>
        </div>
      </div>
    );
  }

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
            Bike Upload Form
          </h1>
        </div>
        
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="subcategory_id" value={id} />
          
          {/* Row 1 - Common fields for all bike types */}
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
                    dropdownData.bikeBrand,
                    "brand"
                  )}
                  disabled={loadingDropdowns}
                />
              )}

              {showOtherBrand && (
                <div className="space-y-2">
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
                    disabled={isAutoPopulating}
                  />
                  {!isAutoPopulating && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowOtherBrand(false);
                        dispatch(updateFormField({ field: "brand_id", value: "" }));
                        dispatch(updateFormField({ field: "brand_name", value: "" }));
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      ← Back to brand selection
                    </button>
                  )}
                </div>
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
      placeholder={
        !formData.brand_id || formData.brand_id === "other"
          ? "Select brand first"
          : dropdownData.bikeModel.length === 0
          ? "No models available"
          : "Select Model"
      }
      onChange={handleChange}
      value={formData.model_id || ""}
      onBlur={handleBlur}
      error={errors.model_id}
      touched={touched.model_id}
      focusedField={focusedField}
      options={renderDropdownOptionsWithOther(
        dropdownData.bikeModel,
        "model"
      )}
      disabled={!formData.brand_id || formData.brand_id === "other" || loadingDropdowns || isAutoPopulating}
    />
              )}

              {showOtherModel && (
                <div className="space-y-2">
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
                  {!isAutoPopulating && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowOtherModel(false);
                        dispatch(updateFormField({ field: "model_id", value: "" }));
                        dispatch(updateFormField({ field: "model_name", value: "" }));
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      ← Back to model selection
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Row 2 - Bike specific fields */}

         
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
           
          {!isBicycle && (
              <>
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
                Engine CC
              </label>
              <DynamicInputs
                type="text"
                name="engine_cc"
                id="engine_cc"
                className="appearance-none w-full max-w-sm px-4 py-3 rounded-full border 
                border-[#bfbfbf] bg-white focus:outline-none "
                placeholder="Enter engine CC (e.g., 125cc)"
                value={formData.engine_cc || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.engine_cc}
                touched={touched.engine_cc}
                focusedField={focusedField}
              />
            </div>
           </>
             )}
           
           
          </div>
        

          {/* Row 3 - Location fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                  !formData.state_id
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
          </div>

          {/* Row 4 - More location and specification fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* <div>
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
            </div> */}

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
                placeholder="Enter mobile no."
               onChange={handleChange}
                value={formData.mobile_number || ""}
                onBlur={handleBlur}
                error={errors.mobile_number}
                touched={touched.mobile_number}
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
                Select Owner
              </label>
              <DynamicInputs
                type="select"
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
                 options={renderDropdownOptions(dropdownData.numberOfOwners)}
    disabled={loadingDropdowns}
              />
            </div>
          </div>

          {/* Row 5 - Price and Mobile */}
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
    disabled={loadingDropdowns}
              />
            </div>
            <div>
              <label className="block text-gray-800 font-medium mb-2 px-4">
                Enter Price
              </label>
              <DynamicInputs
                type="text"
                name="price"
                id="price"
                className="appearance-none w-full max-w-sm px-4 py-3 rounded-full border 
                border-[#bfbfbf] bg-white focus:outline-none "
                placeholder="Enter Price "
                onChange={handleChange}
                value={formData.price || ""}
                onBlur={handleBlur}
                error={errors.price}
                touched={touched.price}
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
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : isEditMode ? "Update " : "Submit "}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UploadBikeForm;

