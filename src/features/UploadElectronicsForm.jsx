import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ImageIcon from "@mui/icons-material/Image";
import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { DynamicInputs } from "@/components";
import { useDispatch, useSelector } from "react-redux";

// Import dynamic validation schemas
import { uploadElectronicsFormSchema } from "../validation/ElectronicsFormSchema";

// Import API services
import { dropdownService } from "../utils/propertyDropdownService";
import { submitElectronicsForm } from "../utils/ElectronicsFormService";
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
} from "../redux/uploadElectronicsFormSlice";

import { useLoadScript } from "@react-google-maps/api";
import { Autocomplete } from "@react-google-maps/api";
const GOOGLE_MAP_LIBRARIES = ["places"];

const UploadElectronicsForm = () => {
    const navigate = useNavigate();
  
  const dispatch = useDispatch();
  const { slug, id } = useParams();
  const location = useLocation();
const subName = location.state?.subName;
  const editFormTitle = location.state?.slugName;
  const formTittle = subName;
  const isEditMode = location.pathname.includes("edit");

  const [autocomplete, setAutocomplete] = useState(null);
  
 useEffect(() => {
     if (!isEditMode) {
       console.log("🧹 Exiting edit mode - clearing form data");
 
       // Reset everything to initial state
       dispatch(resetForm());
 
       // Clear local states
       setDeletedMediaIds({ images: [], videos: [] });
 
       // Clear auto-populate data
       dispatch(clearAutoPopulateData());
 
       console.log("✅ Form cleared successfully");
     }
   }, [isEditMode, dispatch]);

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
    setValidationSchema(uploadElectronicsFormSchema);
  }, []);

  const { formData, errors, touched, isLoading, apiError, autoPopulateData } =
    useSelector((state) => state.uploadelectronicsform);

  const focusedField = useSelector((state) => state.uploadelectronicsform.focusedField);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrls, setPreviewUrls] = useState({
    images: [],
    videos: [],
  });

  const isAutoPopulating = useSelector(selectIsAutoPopulating);
  const [dropdownData, setDropdownData] = useState({
    states: [],
    districts: [],
    cities: [],
    electronicsBrand: [],
    electronicsModel: [],
  });
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  const [showOtherBrand, setShowOtherBrand] = useState(false);
  const [showOtherModel, setShowOtherModel] = useState(false);
  const [validationSchema, setValidationSchema] = useState(uploadElectronicsFormSchema);
  const [deletedMediaIds, setDeletedMediaIds] = useState({
    images: [],
    videos: [],
  });

  useEffect(() => {
    const loadDropdownData = async () => {
      console.log("🔄 Loading dropdown data for slug:", slug);
      setLoadingDropdowns(true);

      try {
        const response = await dropdownService.getDropdownsForPropertyType(
          slug || "electronics"
        );

        const processedDropdowns = {
          states: response.states?.data || response.states || [],
          districts: [],
          cities: [],
         electronicsBrand: extractDataFromResponse(response.electronicsBrand),
        electronicsModel: [],
        };

        setDropdownData((prev) => ({
          ...prev,
          ...processedDropdowns,
          districts: [],
          cities: [],
           electronicsModel: [],
        }));

         // FIXED: Additional validation for electronics brands
      if (!processedDropdowns.electronicsBrand || processedDropdowns.electronicsBrand.length === 0) {
        console.warn("⚠️ No electronics brands loaded, trying direct API call");
        try {
          const directBrands = await dropdownService.getelectronicsBrand();
          const extractedBrands = extractDataFromResponse(directBrands);
          console.log("🔄 Direct brands call result:", extractedBrands);
          
          setDropdownData(prev => ({
            ...prev,
            electronicsBrand: extractedBrands,
          }));
        } catch (directError) {
          console.error("❌ Direct brands call failed:", directError);
        }
      }

        setLoadingDropdowns(false);
      } catch (error) {
        console.error("❌ Failed to load dropdowns:", error);
        dispatch(setApiError("Failed to load dropdown data"));
        setLoadingDropdowns(false);
      }
    };

    loadDropdownData();
  }, [slug, dispatch]);

  const loadDistricts = useCallback(
    async (stateId) => {
      if (!stateId) return;

      setLoadingDistricts(true);
      try {
        const response = await dropdownService.getDistricts(stateId);

        let districtsData = [];
        if (Array.isArray(response)) {
          districtsData = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          districtsData = response.data;
        } else if (response && response.districts && Array.isArray(response.districts)) {
          districtsData = response.districts;
        } else if (response && response.response && Array.isArray(response.response)) {
          districtsData = response.response;
        }

        setDropdownData((prev) => ({
          ...prev,
          districts: districtsData,
        }));

        return districtsData;
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

  const loadCities = useCallback(
    async (districtId) => {
      if (!districtId) return;

      setLoadingCities(true);
      try {
        const response = await dropdownService.getCities(districtId);

        let citiesData = [];
        if (Array.isArray(response)) {
          citiesData = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          citiesData = response.data;
        } else if (response && response.cities && Array.isArray(response.cities)) {
          citiesData = response.cities;
        } else if (response && response.response && Array.isArray(response.response)) {
          citiesData = response.response;
        }

        setDropdownData((prev) => ({
          ...prev,
          cities: citiesData,
        }));

        return citiesData;
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

  useEffect(() => {
    if (!formData.state_id) {
      if (!isAutoPopulating) {
        setDropdownData((prev) => ({
          ...prev,
          districts: [],
          cities: [],
        }));
        if (formData.district_id) {
          dispatch(updateFormField({ field: "district_id", value: "" }));
        }
        if (formData.city_id) {
          dispatch(updateFormField({ field: "city_id", value: "" }));
        }
      }
      return;
    }

    loadDistricts(formData.state_id);
  }, [
    formData.state_id,
    loadDistricts,
    dispatch,
    isAutoPopulating,
    formData.district_id,
    formData.city_id,
  ]);

  useEffect(() => {
    if (!formData.district_id) {
      if (!isAutoPopulating) {
        setDropdownData((prev) => ({
          ...prev,
          cities: [],
        }));
        if (formData.city_id) {
          dispatch(updateFormField({ field: "city_id", value: "" }));
        }
      }
      return;
    }

    loadCities(formData.district_id);
  }, [
    formData.district_id,
    loadCities,
    dispatch,
    isAutoPopulating,
    formData.city_id,
  ]);

  useEffect(() => {
    if (isAutoPopulating && formData.state_id && formData.district_id) {
      const ensureDistrictsLoaded = async () => {
        if (dropdownData.districts.length === 0) {
          await loadDistricts(formData.state_id);
        }
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

 useEffect(() => {
  const loadElectronicsModels = async () => {
    if (!formData.brand_id || formData.brand_id === "other") {
      setDropdownData((prev) => ({
        ...prev,
        electronicsModel: [],
      }));
      return;
    }

    console.log("📱 Loading models for brand:", formData.brand_id);

    try {
      const models = await dropdownService.getelectronicsModel(formData.brand_id);
      console.log("📱 Models response:", models);
      
      const extractedModels = extractDataFromResponse(models);
      console.log("📱 Extracted models:", extractedModels);
      
      setDropdownData((prev) => ({
        ...prev,
        electronicsModel: extractedModels,
      }));
    } catch (error) {
      console.error("Failed to load electronics models:", error);
      setDropdownData((prev) => ({
        ...prev,
        electronicsModel: [],
      }));
      // Optional: Show user-friendly error
      dispatch(setApiError("Failed to load models for selected brand"));
    }
  };

  loadElectronicsModels();
}, [formData.brand_id, dispatch]);

  useEffect(() => {
    previewUrls.images.forEach((url) => {
      if (url?.url?.startsWith?.("blob:")) URL.revokeObjectURL(url.url);
    });
    previewUrls.videos.forEach((url) => {
      if (url?.url?.startsWith?.("blob:")) URL.revokeObjectURL(url.url);
    });

    const imageUrls =
      formData.images?.map((file) => {
        const isFileObject = file instanceof File;
        return {
          file,
          url: isFileObject ? URL.createObjectURL(file) : file.url || file,
        };
      }) || [];

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

  const handleFileChange = async (e, type) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length === 0) return;

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

    if (errors[type]) {
      dispatch(
        setErrors({
          ...errors,
          [type]: "",
        })
      );
    }

    dispatch(addFiles({ type, files: filteredFiles }));

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

    if (errors[type]) {
      dispatch(
        setErrors({
          ...errors,
          [type]: "",
        })
      );
    }

    dispatch(addFiles({ type, files: filteredFiles }));

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

  const handleRemoveFile = (type, index) => {
    const file = formData[type][index];

    if (file?.media_image_id || file?.media_video_id) {
      const id = file.media_image_id || file.media_video_id;
      const newDeletedIds = [...deletedMediaIds[type], id];

      setDeletedMediaIds((prev) => ({
        ...prev,
        [type]: newDeletedIds,
      }));

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    dispatch(updateFormField({ field: name, value }));

    if (name === "brand_id") {
      if (value === "other") {
        setShowOtherBrand(true);
        dispatch(updateFormField({ field: "brand_name", value: "" }));
      } else {
        setShowOtherBrand(false);
        dispatch(updateFormField({ field: "brand_name", value: "" }));
      }

      dispatch(updateFormField({ field: "model_id", value: "" }));
      dispatch(updateFormField({ field: "model_name", value: "" }));
      setShowOtherModel(false);
    }

    if (name === "model_id") {
      if (value === "other") {
        setShowOtherModel(true);
        dispatch(updateFormField({ field: "model_name", value: "" }));
      } else {
        setShowOtherModel(false);
        dispatch(updateFormField({ field: "model_name", value: "" }));
      }
    }

    if (name === "state_id") {
      dispatch(updateFormField({ field: "district_id", value: "" }));
      dispatch(updateFormField({ field: "city_id", value: "" }));
    }

    if (name === "district_id") {
      dispatch(updateFormField({ field: "city_id", value: "" }));
    }

    if (errors[name]) {
      dispatch(setErrors({ ...errors, [name]: "" }));
    }
  };

  const handleFieldChange = (field, value) => {
    dispatch(updateFormField({ field, value }));

    if (!isAutoPopulating) {
      if (field === "state_id") {
        if (formData.district) {
          dispatch(updateFormField({ field: "district_id", value: "" }));
        }
        if (formData.city) {
          dispatch(updateFormField({ field: "city_id", value: "" }));
        }
      } else if (field === "district_id") {
        if (formData.city) {
          dispatch(updateFormField({ field: "city_id", value: "" }));
        }
      }
    }
  };

  useEffect(() => {
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

  const shouldAddOtherOption = (options) => {
    if (!Array.isArray(options)) return false;

    const hasOtherOption = options.some(
      (option) =>
        option.id === "other" ||
        option.value === "other" ||
        (option.name && option.name.toLowerCase() === "other")
    );

    return !hasOtherOption;
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    if (!validationSchema) {
      dispatch(
        setApiError("Validation schema not loaded. Please refresh the page.")
      );
      return;
    }

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
        type: "uploadelectronicsform/setAllTouched",
        payload: allFieldsTouched,
      });

      const allDeletedMedia = [
        ...deletedMediaIds.images,
        ...deletedMediaIds.videos,
      ].join(",");

      const submissionData = {
        ...formData,
        form_type: "electronics",
        media_to_delete: allDeletedMedia,
        action_id: isEditMode ? formData.action_id : undefined,
        subcategory_id:  isEditMode ? formData.subcategory_id : id,
        slug: slug,
        urlId: id,
      };

      const result = await submitElectronicsForm(submissionData, slug, isEditMode);

      if (result.success) {
        alert(
          isEditMode
            ? `${formData.title} updated successfully!`
            : `${formData.title} submitted successfully!`
        );
        if (!isEditMode) {
          dispatch(resetForm());
                    navigate("/sell");

        } else {
          // ✅ If edit mode → navigate
          navigate("/seller-post-details");
        }
        setDeletedMediaIds({ images: [], videos: [] });
      } else {
        if (result.error || result.details) {
          dispatch(
            setApiError(result.error || result.details || "Submission failed")
          );
        }

        if (result.validationErrors) {
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
        dispatch({ type: "uploadelectronicsform/setAllTouched", payload: allFields });

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
  console.log(`🎛️ Rendering options for ${fieldName}:`, options);
  
  let dataArray = extractDataFromResponse(options);
  
  if (!Array.isArray(dataArray) || dataArray.length === 0) {
    console.log(`⚠️ No options available for ${fieldName}, returning Other only`);
    return [{ value: "other", label: "Other" }];
  }

  const processedOptions = dataArray.map((option, index) => {
    const processedOption = {
      value: option.id || option.value || option.key || index,
      label: option.name || option.label || option.title || option.text || `Option ${index + 1}`,
    };
    console.log(`🔄 Processed option ${index}:`, processedOption);
    return processedOption;
  });

  // Add "Other" option if not already present
  if (shouldAddOtherOption(dataArray)) {
    processedOptions.push({ value: "other", label: "Other" });
  }

  console.log(`✅ Final options for ${fieldName}:`, processedOptions);
  return processedOptions;
};

  const renderDropdownOptions = (options) => {
    let dataArray = options;

    if (options && typeof options === "object" && !Array.isArray(options)) {
      if (options.data && Array.isArray(options.data)) {
        dataArray = options.data;
      } else {
        return [];
      }
    }

    if (!Array.isArray(dataArray)) {
      return [];
    }

    if (dataArray.length === 0) {
      return [];
    }

    const processedOptions = dataArray.map((option, index) => {
      return {
        value: option.id || option.value || option.key,
        label: option.name || option.label || option.title || option.text,
      };
    });

    return processedOptions;
  };

  const extractDataFromResponse = (response) => {
    if (!response) return [];

    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }

    if (Array.isArray(response)) {
      return response;
    }

    return [];
  };

  useEffect(() => {
    const loadElectronicsDataForEdit = async () => {
      if (!isEditMode || !id) {
        return;
      }

      try {
        dispatch(setLoading(true));
        dispatch(setApiError(null));
        
        const response = await api.get(`/electronics/${id}/edit`);
        const result = response.data;
        
        if (result && (result.data || result.status)) {
          const electronicsData = result.data || result;
          
          const formFields = {
            action_id:  electronicsData.action_id,
            form_type: "electronics",
            title: electronicsData.title || "",
            subcategory_id: electronicsData.subcategory_id || "",
            price: electronicsData.price || "",
             year: electronicsData.year || electronicsData.post_year,
            description: electronicsData.description || "",
            mobile_number: electronicsData.mobile_number || "",
            brand_id: electronicsData.brand_id || "",
            brand_name: electronicsData.brand_name || "",
            model_id: electronicsData.model_id || "",
            model_name: electronicsData.model_name || "",
            features: electronicsData.features || "",
            specifications: electronicsData.specifications || "",
            address: electronicsData.address || "",
            latitude: electronicsData.latitude || "",
            longitude: electronicsData.longitude || "",
            state_id: electronicsData.state_id || "",
            district_id: electronicsData.district_id || "",
            city_id: electronicsData.city_id || "",
            status: electronicsData.status || "available",
            images: transformMediaFiles(electronicsData.images || [], 'image'),
            videos: transformMediaFiles(electronicsData.videos || [], 'video'),
            media_to_delete: "",
          };
          
          dispatch(populateFormFromApi(formFields));
          
          if (electronicsData.state_id) {
            await loadDistricts(electronicsData.state_id);
            
            if (electronicsData.district_id) {
              await loadCities(electronicsData.district_id);
            }
          }
          
          if (electronicsData.brand_id && electronicsData.brand_id !== "other") {
            try {
              const models = await dropdownService.getElectronicsModel(electronicsData.brand_id);
              setDropdownData((prev) => ({
                ...prev,
                electronicsModel: models || [],
              }));
            } catch (error) {
              console.error("Failed to load electronics models:", error);
            }
          }
        } else {
          dispatch(setApiError("Failed to load electronics data - invalid response"));
        }
      } catch (error) {
        console.error("Error loading electronics data:", error);
        
        if (error.response) {
          const { status, data } = error.response;
          switch (status) {
            case 404:
              dispatch(setApiError("Electronics item not found"));
              break;
            case 403:
              dispatch(setApiError("You don't have permission to edit this item"));
              break;
            case 500:
              dispatch(setApiError("Server error occurred"));
              break;
            default:
              dispatch(setApiError(data.message || "Failed to load electronics data"));
          }
        } else {
          dispatch(setApiError("Failed to load electronics data for editing"));
        }
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadElectronicsDataForEdit();
  }, [isEditMode, id, dispatch, loadDistricts, loadCities]);

  const transformMediaFiles = (mediaArray, type) => {
    if (!Array.isArray(mediaArray)) {
      return [];
    }

    return mediaArray.map((media, index) => {
      const transformedMedia = {
        [`media_${type}_id`]: media.id || media.media_image_id || media.media_video_id,
        url: media.url || media.file_path,
        name: media.name || `${type}_${index + 1}`,
        type: type === 'image' ? 'image/jpeg' : 'video/mp4',
        size: media.size || 0,
        isFromApi: true,
        originalData: media,
      };

      return transformedMedia;
    });
  };

  useEffect(() => {
    if (formData.brand_name && (!formData.brand_id || formData.brand_id === "")) {
      setShowOtherBrand(true);
      dispatch(updateFormField({ field: "brand_id", value: "other" }));
    } else if (formData.brand_id === "other") {
      setShowOtherBrand(true);
    } else if (formData.brand_id && dropdownData.electronicsBrand.length > 0) {
      const brandExists = dropdownData.electronicsBrand.find(
        brand => String(brand.id) === String(formData.brand_id)
      );
      if (!brandExists && formData.brand_name) {
        setShowOtherBrand(true);
        dispatch(updateFormField({ field: "brand_id", value: "other" }));
      } else {
        setShowOtherBrand(false);
      }
    }

    if (formData.model_name && (!formData.model_id || formData.model_id === "")) {
      setShowOtherModel(true);
      dispatch(updateFormField({ field: "model_id", value: "other" }));
    } else if (formData.model_id === "other") {
      setShowOtherModel(true);
    } else if (formData.model_id && dropdownData.electronicsModel.length > 0) {
      const modelExists = dropdownData.electronicsModel.find(
        model => String(model.id) === String(formData.model_id)
      );
      if (!modelExists && formData.model_name) {
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
    dropdownData.electronicsBrand,
    dropdownData.electronicsModel,
    dispatch
  ]);

  if (isEditMode && isLoading && !formData.title) {
    return (
      <div className="bg-gray-50 p-6 rounded-3xl w-full max-w-6xl shadow-[0_0_10px_rgba(176,_176,_176,_0.25)] mx-auto border border-[#b9b9b9] bg-[#f6f6f6]">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-gray-600">Loading electronics data for editing...</span>
        </div>
      </div>
    );
  }

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
    <div className="bg-gray-50 p-6 rounded-3xl w-full max-w-6xl shadow-[0_0_10px_rgba(176,_176,_176,_0.25)] mx-auto border border-[#b9b9b9] bg-[#f6f6f6]">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-center text-xl font-medium text-[#02487C] flex-1">
           {!isEditMode ? `${subName} Form` : `${editFormTitle} Form`}
        </h1>
      </div>

      {/* Show API error if exists */}
      {apiError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Error:</strong> {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              AD Title <span className="text-red-500">*</span>
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
                  dropdownData.electronicsBrand,
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
                      dispatch(
                        updateFormField({ field: "brand_id", value: "" })
                      );
                      dispatch(
                        updateFormField({ field: "brand_name", value: "" })
                      );
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
                placeholder="Select Model"
                onChange={handleChange}
                value={formData.model_id || ""}
                onBlur={handleBlur}
                error={errors.model_id}
                touched={touched.model_id}
                focusedField={focusedField}
                options={renderDropdownOptionsWithOther(
                  dropdownData.electronicsModel,
                  "model"
                )}
                disabled={
                  !formData.brand_id || loadingDropdowns || isAutoPopulating
                }
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
                      dispatch(
                        updateFormField({ field: "model_id", value: "" })
                      );
                      dispatch(
                        updateFormField({ field: "model_name", value: "" })
                      );
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Features
            </label>
            <DynamicInputs
              type="text"
              name="features"
              id="features"
              className="appearance-none w-full px-4 py-3 rounded-full border 
              border-[#bfbfbf] bg-white focus:outline-none"
              placeholder="WiFi, Bluetooth, HDMI, etc."
              onChange={handleChange}
              value={formData.features || ""}
              onBlur={handleBlur}
              error={errors.features}
              touched={touched.features}
              focusedField={focusedField}
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Enter Price <span className="text-red-500">*</span>
            </label>
            <DynamicInputs
              type="text"
              name="price"
              id="price"
              className="appearance-none w-full px-4 py-3 rounded-full border 
              border-[#bfbfbf] bg-white focus:outline-none"
              placeholder="Enter Price"
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
              Specifications
            </label>
            <DynamicInputs
              type="text"
              name="specifications"
              id="specifications"
              className="appearance-none w-full px-4 py-3 rounded-full border 
              border-[#bfbfbf] bg-white focus:outline-none"
              placeholder="Resolution: 3840x2160, Refresh Rate: 60Hz, etc."
              onChange={handleChange}
              value={formData.specifications || ""}
              onBlur={handleBlur}
              error={errors.specifications}
              touched={touched.specifications}
              focusedField={focusedField}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Address <span className="text-red-500">*</span>
            </label>
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
              <DynamicInputs
                type="text"
                name="address"
                id="address"
                className="appearance-none w-full px-4 py-3 rounded-full border 
              border-[#bfbfbf] bg-white focus:outline-none"
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
              Enter State <span className="text-red-500">*</span>
            </label>
            <DynamicInputs
              type="select"
              name="state_id"
              id="state_id"
              className="appearance-none w-full px-4 py-3 rounded-full border 
              border-[#bfbfbf] bg-white focus:outline-none"
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
              Enter District <span className="text-red-500">*</span>
            </label>
            <DynamicInputs
              type="select"
              name="district_id"
              id="district_id"
              className="appearance-none w-full px-4 py-3 rounded-full border 
              border-[#bfbfbf] bg-white focus:outline-none"
              placeholder={
                !formData.state_id
                  ? "Select state first"
                  : loadingDistricts || isAutoPopulating
                  ? "Loading..."
                  : "Select district"
              }
              onChange={(e) => handleFieldChange("district_id", e.target.value)}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Select City <span className="text-red-500">*</span>
            </label>
            <DynamicInputs
              type="select"
              name="city_id"
              id="city_id"
              className="appearance-none w-full px-4 py-3 rounded-full border 
              border-[#bfbfbf] bg-white focus:outline-none"
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
              Enter Mobile No. <span className="text-red-500">*</span>
            </label>
            <DynamicInputs
              type="tel"
              name="mobile_number"
              id="mobile_number"
              className="appearance-none w-full px-4 py-3 rounded-full border 
              border-[#bfbfbf] bg-white focus:outline-none"
              placeholder="Enter mobile no."
              onChange={handleChange}
              value={formData.mobile_number || ""}
              onBlur={handleBlur}
              error={errors.mobile_number}
              touched={touched.mobile_number}
              focusedField={focusedField}
              maxLength="10"
              pattern="[0-9]*"
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Manufacturing Year
            </label>
            <DynamicInputs
              type="text"
              name="year"
              id="year"
              className="appearance-none w-full px-4 py-3 rounded-full border 
                border-[#bfbfbf] bg-white focus:outline-none"
              placeholder="Enter year (e.g., 2023)"
              onChange={handleChange}
              value={formData.year || ""}
              onBlur={handleBlur}
              error={errors.year}
              touched={touched.year}
              focusedField={focusedField}
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-800 font-medium mb-2 px-4">
            Description <span className="text-red-500">*</span>
          </label>

          <DynamicInputs
            type="textarea"
            name="description"
            id="description"
            className="w-full max-w-[100%] h-[90px] px-4 py-3 rounded-[10px] border border-[#bfbfbf] 
            bg-white focus:outline-none"
            placeholder="Enter description"
            onChange={handleChange}
            value={formData.description || ""}
            onBlur={handleBlur}
            error={errors.description}
            touched={touched.description}
            focusedField={focusedField}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 mx-auto">
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
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadElectronicsForm;