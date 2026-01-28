// Import MUI icons
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ImageIcon from "@mui/icons-material/Image";
import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { DynamicInputs } from "@/components";
import { useDispatch, useSelector } from "react-redux";

// Import dynamic validation schemas
import { createValidationSchema } from "../validation/propertyFormValidation";

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
  loadDummyData,
  populateFormFromApi,
  setLoading,
  setApiError,
  resetForm,
  clearAutoPopulateData,
  selectIsAutoPopulating,
  updateMediaToDelete,
} from "../redux/propertyFormSlice";

import { toast } from "react-toastify";
import MapPickerModal from "@/components/common/MapPickerModal";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";

const GOOGLE_MAP_LIBRARIES = ["places"];

const PropertyForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug, id } = useParams(); // Get both slug and id from URL params
  const location = useLocation();
  const isEditMode = location.pathname.includes("edit");
  const subName = location.state?.subName;
  const editFormTitle = location.state?.slugName;
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null);
  const [usedAutocomplete, setUsedAutocomplete] = useState(false);



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

      // Mark that autocomplete was used
      setUsedAutocomplete(true);

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

      console.log("Autocomplete used:", {
        address: place.formatted_address,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    }
  };

  // Handle location confirmation from map modal
  const handleLocationConfirm = ({ address, latitude, longitude }) => {
    // Mark that map was used (not autocomplete)
    setUsedAutocomplete(false);

    dispatch(updateFormField({ field: "address", value: address }));
    dispatch(updateFormField({ field: "latitude", value: latitude }));
    dispatch(updateFormField({ field: "longitude", value: longitude }));
    setIsMapModalOpen(false);
    console.log("Map location confirmed:", { address, latitude, longitude });
  };

  const { formData, errors, touched, isLoading, apiError, autoPopulateData } =
    useSelector((state) => state.propertyform);

  const focusedField = useSelector((state) => state.propertyform.focusedField);
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
    buildingDirections: [],
    constructionStatuses: [],
    furnishingTypes: [],
    listedBy: [],
    maintenanceFrequencies: [],
    bhkTypes: [],
  });

  const [loadingDropdowns, setLoadingDropdowns] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // Dynamic validation schema based on slug
  const [validationSchema, setValidationSchema] = useState(null);

  // 👇 PASTE useEffect HERE (with other useEffects)
  // useEffect(() => {
  //   if (!formData.state) return;

  //   // ✅ load only when user manually changes state
  //   if (!isEditMode && !isAutoPopulating) {
  //     loadDistricts(formData.state);
  //   }
  // }, [formData.state]);




  useEffect(() => {
    if (!formData.state) return;

    // 🔥 IMPORTANT: Only when USER changes state
    if (!isAutoPopulating) {
      // clear dependent fields
      dispatch(updateFormField({ field: "district", value: "" }));

      setDropdownData((prev) => ({
        ...prev,
        districts: [],
        cities: [],
      }));

      // load new districts
      loadDistricts(formData.state);
    }
  }, [formData.state]);



  // Slug configuration mapping
  const SLUG_CONFIG = {
    "for-sale-houses-apartments": {
      title: "Houses & Apartments for Sale",
      subcategoryId: 1,
      type: "house-apartment",
      showFields: {
        bachelor: false,
        wash_room: false,
        bhk: true,
        bedroom: true,
        bathroom: true,
        furnished: true,
        constructionStatus: true,
        maintenance: true,
        superBuildArea: true,
        carpetArea: true,
        floorNumber: true,
        totalFloor: true,
        bikeParking: true,
        carParking: true,
        plotArea: false,
        length: false,
        breadth: false,
      },
    },
    "for-rent-houses-apartments": {
      title: "Houses & Apartments for Rent",
      subcategoryId: 2,
      type: "house-apartment",
      showFields: {
        bachelor: true,
        wash_room: false,
        bhk: true,
        bedroom: true,
        bathroom: true,
        furnished: true,
        constructionStatus: true,
        maintenance: true,
        superBuildArea: true,
        carpetArea: true,
        floorNumber: true,
        totalFloor: true,
        bikeParking: true,
        carParking: true,
        plotArea: false,
        length: false,
        breadth: false,
      },
    },
    "lands-plots": {
      title: "Land & Plot",
      subcategoryId: 3,
      type: "land-plot",
      showFields: {
        bachelor: false,
        wash_room: false,
        bhk: false,
        bedroom: false,
        bathroom: false,
        furnished: false,
        constructionStatus: false,
        maintenance: false,
        superBuildArea: false,
        carpetArea: false,
        floorNumber: false,
        totalFloor: false,
        bikeParking: false,
        carParking: false,
        plotArea: true,
        length: true,
        breadth: true,
      },
    },
    "for-sale-shops-offices": {
      title: "Shops & Offices for Sale",
      subcategoryId: 4,
      type: "commercial",
      showFields: {
        bachelor: false,
        wash_room: true,
        bhk: false,
        bedroom: false,
        bathroom: false,
        furnished: true,
        constructionStatus: true,
        maintenance: true,
        superBuildArea: true,
        carpetArea: true,
        floorNumber: true,
        totalFloor: true,
        bikeParking: true,
        carParking: true,
        plotArea: false,
        length: false,
        breadth: false,
      },
    },
    "for-rent-shops-offices": {
      title: "Shops & Offices for Rent",
      subcategoryId: 5,
      type: "commercial",
      showFields: {
        bachelor: false,
        wash_room: true,
        bhk: false,
        bedroom: false,
        bathroom: false,
        furnished: true,
        constructionStatus: true,
        maintenance: true,
        superBuildArea: true,
        carpetArea: true,
        floorNumber: true,
        totalFloor: true,
        bikeParking: true,
        carParking: true,
        plotArea: false,
        length: false,
        breadth: false,
      },
    },

    defult: {
      title: "Default Property",
      subcategoryId: null, // Changed from 3 to null
      type: "default",
      showFields: {
        bachelor: false,
        wash_room: false,
        bhk: false,
        bedroom: false,
        bathroom: false,
        furnished: false,
        constructionStatus: false,
        maintenance: false,
        superBuildArea: false,
        carpetArea: false,
        floorNumber: false,
        totalFloor: false,
        bikeParking: false,
        carParking: false,
        plotArea: false, // Hidden by default
        length: false, // Hidden by default
        breadth: false, // Hidden by default
      },
    },
  };

  // Get current slug configuration
  const getCurrentConfig = () => {
    const config = SLUG_CONFIG[slug];
    if (!config) {
      console.warn(
        `No configuration found for slug: ${slug}, using dynamic config`
      );
      // Return a complete dynamic configuration
      return {
        title: "Property Form",
        subcategoryId: id ? parseInt(id) : null, // Use URL id parameter instead of hardcoded 3
        type: "dynamic",
        showFields: {
          bachelor: false,
          wash_room: false,
          bhk: false,
          bedroom: false,
          bathroom: false,
          furnished: false,
          constructionStatus: false,
          maintenance: false,
          superBuildArea: false,
          carpetArea: false,
          floorNumber: false,
          totalFloor: false,
          bikeParking: false,
          carParking: false,
          plotArea: false,
          length: false,
          breadth: false,
        },
      };
    }
    return config;
  };

  // Helper function to check if field should be shown
  const shouldShowField = (fieldName) => {
    const config = getCurrentConfig();
    return config.showFields[fieldName] === true;
  };

  // Get subcategory ID for current slug
  const getSubcategoryId = () => getCurrentConfig().subcategoryId;

  // Initialize validation schema based on slug
  useEffect(() => {
    if (slug) {
      const schema = createValidationSchema(slug);
      setValidationSchema(schema);
      console.log(`Loaded validation schema for: ${slug}`);
    }
  }, [slug]);

  // Load dropdown data based on slug
  // Load initial dropdown data based on slug
  // useEffect(() => {
  //   const loadDropdownData = async () => {
  //     if (!slug) return;

  //     setLoadingDropdowns(true);
  //     try {
  //       const dropdowns = await dropdownService.getDropdownsForPropertyType(
  //         slug
  //       );
  //       console.log(`Loaded dropdown data for: ${slug}`, dropdowns);

  //       // Process each dropdown to ensure we have arrays
  //       const processedDropdowns = {};
  //       Object.keys(dropdowns).forEach((key) => {
  //         const data = dropdowns[key];
  //         if (Array.isArray(data)) {
  //           processedDropdowns[key] = data;
  //         } else if (data && data.data) {
  //           processedDropdowns[key] = Array.isArray(data.data) ? data.data : [];
  //         } else if (data && data.response) {
  //           processedDropdowns[key] = Array.isArray(data.response)
  //             ? data.response
  //             : [];
  //         } else {
  //           processedDropdowns[key] = [];
  //         }
  //       });

  //       setDropdownData((prev) => ({
  //         ...prev,
  //         ...processedDropdowns,
  //         districts: [], // Will be loaded when state is selected
  //         cities: [], // Will be loaded when district is selected
  //       }));
  //     } catch (error) {
  //       console.error("Failed to load dropdown data:", error);
  //       dispatch(
  //         setApiError("Failed to load form options. Please refresh the page.")
  //       );

  //     } finally {
  //       setLoadingDropdowns(false);
  //     }
  //   };

  //   loadDropdownData();
  // }, [slug, dispatch]);

  // Memoized function to load districts
  //   const loadDistricts = useCallback(
  //     async (stateId) => {
  //       if (!stateId) return;

  //       setLoadingDistricts(true);
  //       try {
  //         console.log("Loading districts for state:", stateId);
  //         const response = await dropdownService.getDistricts(stateId);

  //         // Handle different response formats
  //         let districtsData = [];
  //         if (Array.isArray(response)) {
  //           districtsData = response;
  //         } else if (response && response.data && Array.isArray(response.data)) {
  //           districtsData = response.data;
  //         } else if (
  //           response &&
  //           response.districts &&
  //           Array.isArray(response.districts)
  //         ) {
  //           districtsData = response.districts;
  //         } else if (
  //           response &&
  //           response.response &&
  //           Array.isArray(response.response)
  //         ) {
  //           districtsData = response.response;
  //         }

  //         console.log("Loaded districts:", districtsData);

  //         setDropdownData((prev) => ({
  //           ...prev,
  //           districts: districtsData,
  //           cities: [], // Clear cities when state changes
  //         }));

  //         // If not auto-populating and we have a selected district that's not in the new list, clear it
  //        // ✅ Only validate district when NOT auto-populating
  // if (!isAutoPopulating && formData.district) {
  //   const districtExists = districtsData.find(
  //     (d) =>
  //       String(d.id) === String(formData.district) ||
  //       String(d.value) === String(formData.district)
  //   );

  //   if (!districtExists) {
  //     dispatch(updateFormField({ field: "district", value: "" }));
  //     dispatch(updateFormField({ field: "city", value: "" }));
  //   }
  // }



  //       } catch (error) {
  //         console.error("Failed to load districts:", error);
  //         setDropdownData((prev) => ({
  //           ...prev,
  //           districts: [],
  //           cities: [],
  //         }));
  //         // Show user-friendly error
  //         dispatch(setApiError("Failed to load districts. Please try again."));
  //       } finally {
  //         setLoadingDistricts(false);
  //       }
  //     },
  //     [dispatch, isAutoPopulating, formData.district]
  //   );


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

  useEffect(() => {
    if (!formData.state) return;

    // ❌ block auto-populate
    if (isAutoPopulating) return;

    console.log("Loading districts for state:", formData.state);

    // clear old selections
    dispatch(updateFormField({ field: "district", value: "" }));
    dispatch(updateFormField({ field: "city", value: "" }));

    setDropdownData((prev) => ({
      ...prev,
      districts: [],
      cities: [],
    }));

    // ✅ SINGLE API CALL
    loadDistricts(formData.state);
  }, [formData.state]);



  // Memoized function to load cities
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

        // If not auto-populating and we have a selected city that's not in the new list, clear it
        if (isAutoPopulating && formData.city) {
          const cityExists = citiesData.find(
            (c) =>
              String(c.id) === String(formData.city) ||
              String(c.value) === String(formData.city)
          );
          if (!cityExists) {
            dispatch(updateFormField({ field: "city", value: "" }));
          }
        }
      } catch (error) {
        console.error("Failed to load cities:", error);
        setDropdownData((prev) => ({
          ...prev,
          cities: [],
        }));
        // Show user-friendly error
        dispatch(setApiError("Failed to load cities. Please try again."));
      } finally {
        setLoadingCities(false);
      }
    },
    [dispatch, isAutoPopulating, formData.city]
  );

  // 4. Update the initial dropdown loading to handle all responses properly
  useEffect(() => {
    const loadDropdownData = async () => {
      if (!slug) return;

      setLoadingDropdowns(true);
      try {
        const dropdowns = await dropdownService.getDropdownsForPropertyType(
          slug
        );
        console.log(`Loaded dropdown data for: ${slug}`, dropdowns);

        // Process each dropdown to ensure we have arrays
        const processedDropdowns = {};
        Object.keys(dropdowns).forEach((key) => {
          const data = dropdowns[key];
          if (Array.isArray(data)) {
            processedDropdowns[key] = data;
          } else if (data && data.data) {
            processedDropdowns[key] = data.data;
          } else if (data && data.response) {
            processedDropdowns[key] = data.response;
          } else {
            processedDropdowns[key] = [];
          }
        });

        setDropdownData({
          ...processedDropdowns,
          districts: [], // Will be loaded when state is selected
          cities: [], // Will be loaded when district is selected
        });
      } catch (error) {
        console.error("Failed to load dropdown data:", error);
        dispatch(
          setApiError("Failed to load form options. Please refresh the page.")
        );
      } finally {
        setLoadingDropdowns(false);
      }
    };

    loadDropdownData();
  }, [slug, dispatch]);

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
    console.log("Subcategory ID:", getSubcategoryId());
  }, [formData, slug, id]);

  // Auto-calculate plot area when length and breadth change (only for lands-plots)
  useEffect(() => {
    if (
      shouldShowField("plotArea") &&
      shouldShowField("length") &&
      shouldShowField("breadth")
    ) {
      const length = parseFloat(formData.length) || 0;
      const breadth = parseFloat(formData.breadth) || 0;

      if (length > 0 && breadth > 0) {
        const calculatedArea = length * breadth;

        // Only update if the calculated area is different from current plot area
        const currentPlotArea = parseFloat(formData.plotArea) || 0;

        if (Math.abs(calculatedArea - currentPlotArea) > 0.01) {
          // Small tolerance for floating point
          console.log(
            `Auto-calculating plot area: ${length} × ${breadth} = ${calculatedArea} sq ft`
          );

          // Update plot area automatically
          dispatch(
            updateFormField({
              field: "plotArea",
              value: calculatedArea.toString(),
            })
          );

          // Clear any plot area validation errors
          if (errors.plotArea) {
            dispatch(setErrors({ ...errors, plotArea: "" }));
          }
        }
      } else if ((length === 0 || breadth === 0) && formData.plotArea) {
        // Clear plot area if either length or breadth becomes empty/zero
        console.log("Clearing plot area due to empty length or breadth");
        dispatch(updateFormField({ field: "plotArea", value: "" }));
      }
    }
  }, [
    formData.length,
    formData.breadth,
    shouldShowField,
    dispatch,
    formData.plotArea,
    errors.plotArea,
  ]);

  useEffect(() => {
    const handleApiAutoPopulate = async () => {
      if (!isEditMode) return;

      dispatch(setLoading(true));
      try {
        const response = await apiForFiles.get(`/property/${id}/edit`);
        const result = response.data;

        console.log("API response:", result);
        if (result.status && result.data) {
          console.log("autopapulayte", result.data);

          // Store the action_id from API response in formData
          dispatch(
            populateFormFromApi({
              ...result.data,
              action_id: result.data.action_id,
            })
          );

          // FIXED: Load dependent dropdowns after form data is populated
          // Use setTimeout to ensure Redux state has been updated
          setTimeout(async () => {
            if (result.data.state_id || result.data.state) {
              const stateId = result.data.state_id || result.data.state;
              console.log(
                "Loading districts for auto-populated state:",
                stateId
              );
              await loadDistricts(stateId);

              // Then load cities if district exists
              if (result.data.district_id || result.data.district) {
                const districtId =
                  result.data.district_id || result.data.district;
                console.log(
                  "Loading cities for auto-populated district:",
                  districtId
                );
                await loadCities(districtId);
              }
            }
          }, 100); // Small delay to ensure Redux state update
        } else {
          dispatch(setApiError("Failed to load property data"));
        }
      } catch (error) {
        console.error("Auto-populate error:", error);
        dispatch(setApiError("Failed to auto-populate form."));
      } finally {
        dispatch(setLoading(false));
      }
    };

    handleApiAutoPopulate();
  }, [isEditMode, id, loadDistricts, loadCities, dispatch]);

  // FIXED: Update the loadDistricts useEffect to handle auto-population better
  useEffect(() => {
    if (!formData.state) {
      // Clear districts and cities if no state selected
      if (!isAutoPopulating) {
        setDropdownData((prev) => ({
          ...prev,
          districts: [],

        }));
        // Clear dependent fields
        if (formData.district) {
          dispatch(updateFormField({ field: "district", value: "" }));
        }

      }
      return;
    }

    // FIXED: Only auto-load districts if not currently auto-populating
    // During auto-population, districts are loaded manually in handleApiAutoPopulate
    if (!isAutoPopulating) {
      loadDistricts(formData.state);
    }
  }, [
    formData.state,
    loadDistricts,
    dispatch,
    isAutoPopulating, // Added this dependency
    formData.district,

  ]);

  // FIXED: Update the loadCities useEffect similarly
  useEffect(() => {
    if (!formData.district) {
      // Clear cities if no district selected
      if (!isAutoPopulating) {
        setDropdownData((prev) => ({
          ...prev,
          cities: [],
        }));
        // Clear city field
        if (formData.city) {
          dispatch(updateFormField({ field: "city", value: "" }));
        }
      }
      return;
    }

    // FIXED: Only auto-load cities if not currently auto-populating
    if (!isAutoPopulating) {
      loadCities(formData.district);
    }
  }, [
    formData.district,
    loadCities,
    dispatch,
    isAutoPopulating, // Added this dependency
    formData.city,
  ]);

  const handleResetForm = () => {
    if (
      window.confirm(
        "Are you sure you want to reset the form? All data will be lost."
      )
    ) {
      dispatch(resetForm());
    }
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

    // Show immediate feedback for length/breadth calculation
    if (
      (name === "length" || name === "breadth") &&
      shouldShowField("plotArea")
    ) {
      const otherField = name === "length" ? "breadth" : "length";
      const otherValue = parseFloat(formData[otherField]) || 0;
      const currentValue = parseFloat(value) || 0;

      if (currentValue > 0 && otherValue > 0) {
        console.log(
          `Will calculate: ${currentValue} × ${otherValue} = ${currentValue * otherValue
          } sq ft`
        );
      }
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

  // Handle form submission

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
        type: "propertyform/setAllTouched",
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

      // FIXED: Correctly determine subcategory_id
      let subcategoryId;

      if (isEditMode) {
        // In edit mode, use the subcategory_id from the API response (stored in formData)
        subcategoryId = formData.subcategory_id || getSubcategoryId();
      } else {
        // In create mode, prioritize URL id parameter over slug-based ID
        subcategoryId = id ? parseInt(id) : getSubcategoryId();
      }

      // Prepare submission data with URL params
      const submissionData = {
        ...formData,
        media_to_delete: allDeletedMedia, // Formatted string
        action_id: isEditMode ? formData.action_id : undefined,
        subcategory_id: getSubcategoryId(), // Subcategory ID based on slug
        urlId: getSubcategoryId(), // ID from URL params

        slug: slug, // Current slug
        form_type: "property",
      };

      console.log("Submitting form data:", submissionData);
      // Submit form with edit mode flag
      const result = await submitPropertyForm(submissionData, slug, isEditMode);

      if (result.success) {
        toast.success(
          isEditMode
            ? ` ${formData.propertyName} updated successfully`
            : `${formData.propertyName} submitted successfully. It will be reviewed and published after admin approval.`,
        );

        if (!isEditMode) {
          dispatch(resetForm());
          navigate("/sell");
        } else {
          // ✅ If edit mode → navigate
          navigate("/seller-post-details");
        }
        // Clear deleted media IDs after successful submission
        setDeletedMediaIds({ images: [], videos: [] });
      } else {


        if (result.error || result.details) {
          const errorMessage = result.error || result.details || "Submission failed";
          dispatch(setApiError(errorMessage));
          toast.error(errorMessage);
        }


        // if (
        //   result.validationErrors &&
        //   Object.keys(result.validationErrors).length > 0
        // ) {
        //   dispatch(setErrors(result.validationErrors));

        //   const firstErrorField = Object.keys(result.validationErrors)[0];
        //   if (firstErrorField) {
        //     dispatch(setFocusedField(firstErrorField));
        //     setTimeout(() => {
        //       const errorElement = document.getElementById(firstErrorField);
        //       if (errorElement) {
        //         errorElement.scrollIntoView({
        //           behavior: "smooth",
        //           block: "center",
        //         });
        //         errorElement.focus();
        //       }
        //     }, 100);
        //   }
        // }


        if (
          result.validationErrors &&
          Object.keys(result.validationErrors).length > 0
        ) {
          const formattedErrors = {};

          Object.entries(result.validationErrors).forEach(([field, messages]) => {
            // Flatten image.* errors into "images"
            if (field.startsWith("images")) {
              if (!formattedErrors["images"]) {
                formattedErrors["images"] = [];
              }
              formattedErrors["images"].push(...messages);
            }
            // Flatten videos.* errors into "videos"
            else if (field.startsWith("videos")) {
              if (!formattedErrors["videos"]) {
                formattedErrors["videos"] = [];
              }
              formattedErrors["videos"].push(...messages);
            }
            else {
              formattedErrors[field] = Array.isArray(messages) ? messages : [messages];
            }
          });

          dispatch(setErrors(formattedErrors));

          // Mark all error fields as touched
          const touchedFields = {};
          Object.keys(formattedErrors).forEach((field) => {
            touchedFields[field] = true;
          });
          dispatch({
            type: "propertyform/setAllTouched",
            payload: touchedFields,
          });

          // Focus first error field
          const firstErrorField = Object.keys(formattedErrors)[0];
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
          type: "propertyform/setAllTouched",
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
        const errorMessage =
          err?.response?.data?.message ||
          err.message ||
          "Something went wrong. Please try again.";
        toast.error(errorMessage);
        // dispatch(
        //   setApiError(errorMessage || "An error occurred during validation")

        // );

      }
    } finally {
      dispatch(setLoading(false));
    }
  };

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
          [type]: `Only ${type === "images" ? "image" : "video"
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
          [type]: `Only ${type === "images" ? "image" : "video"
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

  // Helper function to render dropdown options
  const renderDropdownOptions = (options) => {
    if (!Array.isArray(options)) return [];

    return options.map((option) => ({
      value: option.id || option.value || option.key,
      label: option.name || option.label || option.title || option.text,
    }));
  };

  // Handle form field changes with proper validation
  const handleFieldChange = (field, value) => {
    dispatch(updateFormField({ field, value }));

    // Handle dependent dropdown resets for manual changes (not auto-population)
    if (!isAutoPopulating) {
      if (field === "state") {
        // Clear dependent fields when state changes
        if (formData.district) {
          dispatch(updateFormField({ field: "district", value: "" }));
        }
        if (formData.city) {
          dispatch(updateFormField({ field: "city", value: "" }));
        }
      } else if (field === "district") {
        // Clear city when district changes
        if (formData.city) {
          dispatch(updateFormField({ field: "city", value: "" }));
        }
      }
    }
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
          <p className="text-red-500">Error loading Google Maps</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="bg-gray-50 p-6 rounded-3xl w-full max-w-6xl shadow-[0_0_10px_rgba(176,_176,_176,_0.25)] mx-auto border border-[#b9b9b9] bg-[#f6f6f6]">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-gray-600">Loading Google Maps...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 rounded-3xl w-full max-w-6xl shadow-[0_0_10px_rgba(176,_176,_176,_0.25)] mx-auto border border-[#b9b9b9] bg-[#f6f6f6]">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-center text-xl font-medium text-[#02487C] flex-1">
          {/* {getCurrentConfig().title} */}
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
        {/* Row 1 - Common fields for all property types */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Property Name
            </label>
            <DynamicInputs
              type="text"
              name="propertyName"
              id="propertyName"
              onChange={handleChange}
              value={formData.propertyName || ""}
              className="w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] 
              bg-white focus:outline-none "
              placeholder="Enter property name"
              onBlur={handleBlur}
              error={errors.propertyName}
              touched={touched.propertyName}
              focusedField={focusedField}
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Mobile Number
            </label>
            <DynamicInputs
              type="text"
              name="mobileNumber"
              id="mobileNumber"
              onChange={handleChange}
              value={formData.mobileNumber || ""}
              className="w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] bg-white
               focus:outline-none "
              placeholder="Enter mobile number"
              onBlur={handleBlur}
              error={errors.mobileNumber}
              touched={touched.mobileNumber}
              focusedField={focusedField}
            />
          </div>

          {/* <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Listed by
            </label>
            <DynamicInputs
              type="select"
              name="listedBy"
              id="listedBy"
              onChange={handleChange}
              value={formData.listedBy || ""}
              className="appearance-none w-full max-w-sm px-4 py-3 rounded-full border
                border-[#bfbfbf] bg-white focus:outline-none "
              placeholder="Select Listed By"
              onBlur={handleBlur}
              error={errors.listedBy}
              touched={touched.listedBy}
              focusedField={focusedField}
              options={renderDropdownOptions(dropdownData.listedBy)}
            />
          </div> */}
          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Building Direction
            </label>
            <DynamicInputs
              type="select"
              name="buildingDirection"
              id="buildingDirection"
              onChange={handleChange}
              value={formData.buildingDirection || ""}
              className="appearance-none w-full max-w-sm px-4 py-3 rounded-full border 
                border-[#bfbfbf] bg-white focus:outline-none "
              placeholder="Select direction"
              onBlur={handleBlur}
              error={errors.buildingDirection}
              touched={touched.buildingDirection}
              focusedField={focusedField}
              options={renderDropdownOptions(dropdownData.buildingDirections)}
            />
          </div>
        </div>

        {/* Address fields - Common for all property types */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Address
            </label>

            <div className="flex gap-2  flex-col">
              <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                <DynamicInputs
                  type="text"
                  name="address"
                  id="address"
                  onChange={handleChange}
                  value={formData.address || ""}
                  className="w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] 
          bg-white focus:outline-none"
                  placeholder="Type address or click map button"
                  onBlur={handleBlur}
                  error={errors.address}
                  touched={touched.address}
                  focusedField={focusedField}
                />
              </Autocomplete>
              <button
                type="button"
                onClick={() => setIsMapModalOpen(true)}
                className="cursor-pointer px-4 py-3 underline text-red-900 text-[12px] transition-colors font-medium whitespace-nowrap flex items-center gap-2"
                title="Select location on map"
              >
                {formData.address ? (<span className="flex items-center gap-1">
                  <LocationOnIcon className="w-5 h-5 text-red-500" />
                  Map
                </span>) : (<span className="flex items-center gap-1">
                  <LocationOnIcon className="w-5 h-5 text-red-500" />
                  Select Location on Map
                </span>)}
              </button>
            </div>
            {/* {!usedAutocomplete && formData.latitude && formData.longitude && (
              <p className="text-xs text-gray-500 mt-2 px-4">
                📍 Location selected from map
              </p>
            )}
            {usedAutocomplete && formData.latitude && formData.longitude && (
              <p className="text-xs text-gray-500 mt-2 px-4">
                ✓ Location from autocomplete
              </p>
            )} */}
          </div>
          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              State
            </label>
            <DynamicInputs
              type="select"
              name="state"
              id="state"
              onChange={(e) => handleFieldChange("state", e.target.value)}
              value={formData.state || ""}
              className="appearance-none w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] bg-white focus:outline-none"
              placeholder={isAutoPopulating ? "Loading..." : "Select state"}
              onBlur={handleBlur}
              error={errors.state}
              touched={touched.state}
              focusedField={focusedField}
              options={renderDropdownOptions(dropdownData.states)}
              loading={loadingDropdowns || isAutoPopulating}
              disabled={loadingDropdowns || isAutoPopulating}
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              District
            </label>
            <DynamicInputs
              type="select"
              name="district"
              id="district"
              onChange={(e) => handleFieldChange("district", e.target.value)}
              value={formData.district || ""}
              className="appearance-none w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] bg-white focus:outline-none"
              placeholder={
                !formData.state
                  ? "Select state first"
                  : loadingDistricts || isAutoPopulating
                    ? "Loading..."
                    : "Select district"
              }
              onBlur={handleBlur}
              error={errors.district}
              touched={touched.district}
              focusedField={focusedField}
              options={renderDropdownOptions(dropdownData.districts)}
              disabled={
                (!formData.state && !isAutoPopulating) || loadingDistricts
              }
              loading={loadingDistricts || isAutoPopulating}
            />
          </div>

          {/* <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              City
            </label>
            <DynamicInputs
              type="select"
              name="city"
              id="city"
              onChange={(e) => handleFieldChange("city", e.target.value)}
              value={formData.city || ""}
              className="appearance-none w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] bg-white focus:outline-none"
              placeholder={
                !formData.district
                  ? "Select district first"
                  : loadingCities || isAutoPopulating
                  ? "Loading..."
                  : "Select city"
              }
              onBlur={handleBlur}
              error={errors.city}
              touched={touched.city}
              focusedField={focusedField}
              options={renderDropdownOptions(dropdownData.cities)}
              disabled={!formData.district || loadingCities || isAutoPopulating}
              loading={loadingCities || isAutoPopulating}
            />
          </div> */}
        </div>

        {/* Land Plot specific fields */}
        {shouldShowField("plotArea") && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {shouldShowField("length") && (
              <div>
                <label className="block text-gray-800 font-medium mb-2 px-4">
                  Length (ft)
                </label>
                <DynamicInputs
                  type="text"
                  name="length"
                  id="length"
                  onChange={handleChange}
                  value={formData.length || ""}
                  className="w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] 
                  bg-white focus:outline-none "
                  placeholder="Enter length"
                  onBlur={handleBlur}
                  error={errors.length}
                  touched={touched.length}
                  focusedField={focusedField}
                />
              </div>
            )}

            {shouldShowField("breadth") && (
              <div>
                <label className="block text-gray-800 font-medium mb-2 px-4">
                  Breadth (ft)
                </label>
                <DynamicInputs
                  type="text"
                  name="breadth"
                  id="breadth"
                  onChange={handleChange}
                  value={formData.breadth || ""}
                  className="w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] 
                  bg-white focus:outline-none "
                  placeholder="Enter breadth"
                  onBlur={handleBlur}
                  error={errors.breadth}
                  touched={touched.breadth}
                  focusedField={focusedField}
                />
              </div>
            )}

            <div>
              <label className="block text-gray-800 font-medium mb-2 px-4">
                Plot Area (sq ft)
              </label>
              <DynamicInputs
                type="text"
                name="plotArea"
                id="plotArea"
                onChange={handleChange}
                value={formData.plotArea || ""}
                className="w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] 
                bg-white focus:outline-none "
                placeholder="Enter plot area"
                onBlur={handleBlur}
                error={errors.plotArea}
                touched={touched.plotArea}
                focusedField={focusedField}
              />
            </div>
          </div>
        )}

        {/* Room details row - Only show if any room field is enabled */}
        {(shouldShowField("bhk") ||
          shouldShowField("bedroom") ||
          shouldShowField("bathroom") ||
          shouldShowField("wash_room")) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {shouldShowField("bhk") && (
                <div>
                  <label className="block text-gray-800 font-medium mb-2 px-4">
                    BHK Type
                  </label>
                  <DynamicInputs
                    type="select"
                    name="bhk"
                    id="bhk"
                    onChange={handleChange}
                    value={formData.bhk || ""}
                    className="appearance-none w-full max-w-sm px-4 py-3 rounded-full border
                    border-[#bfbfbf] bg-white focus:outline-none "
                    placeholder="Select BHK"
                    onBlur={handleBlur}
                    error={errors.bhk}
                    touched={touched.bhk}
                    focusedField={focusedField}
                    options={renderDropdownOptions(dropdownData.bhkTypes)}
                  />
                </div>
              )}

              {shouldShowField("bedroom") && (
                <div>
                  <label className="block text-gray-800 font-medium mb-2 px-4">
                    Bedrooms
                  </label>
                  <DynamicInputs
                    type="text"
                    name="bedroom"
                    id="bedroom"
                    onChange={handleChange}
                    value={formData.bedroom || ""}
                    className="w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] 
                  bg-white focus:outline-none "
                    placeholder="Enter bedrooms"
                    onBlur={handleBlur}
                    error={errors.bedroom}
                    touched={touched.bedroom}
                    focusedField={focusedField}
                  />
                </div>
              )}

              {shouldShowField("bathroom") && (
                <div>
                  <label className="block text-gray-800 font-medium mb-2 px-4">
                    Bathrooms
                  </label>
                  <DynamicInputs
                    type="text"
                    name="bathroom"
                    id="bathroom"
                    onChange={handleChange}
                    value={formData.bathroom || ""}
                    className="w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] 
                  bg-white focus:outline-none "
                    placeholder="Enter bathrooms"
                    onBlur={handleBlur}
                    error={errors.bathroom}
                    touched={touched.bathroom}
                    focusedField={focusedField}
                  />
                </div>
              )}
            </div>
          )}

        {/* Property features row - Only show if any feature field is enabled */}
        {(shouldShowField("furnished") ||
          shouldShowField("constructionStatus") ||
          shouldShowField("maintenance")) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {shouldShowField("furnished") && (
                <div>
                  <label className="block text-gray-800 font-medium mb-2 px-4">
                    Furnished Status
                  </label>
                  <DynamicInputs
                    type="select"
                    name="furnished"
                    id="furnished"
                    onChange={handleChange}
                    value={formData.furnished || ""}
                    className="appearance-none w-full max-w-sm px-4 py-3 rounded-full border
                    border-[#bfbfbf] bg-white focus:outline-none "
                    placeholder="Select furnished status"
                    onBlur={handleBlur}
                    error={errors.furnished}
                    touched={touched.furnished}
                    focusedField={focusedField}
                    options={renderDropdownOptions(dropdownData.furnishingTypes)}
                  />
                </div>
              )}

              {shouldShowField("constructionStatus") && (
                <div>
                  <label className="block text-gray-800 font-medium mb-2 px-4">
                    Construction Status
                  </label>
                  <DynamicInputs
                    type="select"
                    name="constructionStatus"
                    id="constructionStatus"
                    onChange={handleChange}
                    value={formData.constructionStatus || ""}
                    className="appearance-none w-full max-w-sm px-4 py-3 rounded-full border
                    border-[#bfbfbf] bg-white focus:outline-none "
                    placeholder="Select construction status"
                    onBlur={handleBlur}
                    error={errors.constructionStatus}
                    touched={touched.constructionStatus}
                    focusedField={focusedField}
                    options={renderDropdownOptions(
                      dropdownData.constructionStatuses
                    )}
                  />
                </div>
              )}

              {shouldShowField("maintenance") && (
                <div>
                  <label className="block text-gray-800 font-medium mb-2 px-4">
                    Maintenance
                  </label>
                  <DynamicInputs
                    type="select"
                    name="maintenance"
                    id="maintenance"
                    onChange={handleChange}
                    value={formData.maintenance || ""}
                    className="appearance-none w-full max-w-sm px-4 py-3 rounded-full border
                    border-[#bfbfbf] bg-white focus:outline-none "
                    placeholder="Select maintenance"
                    onBlur={handleBlur}
                    error={errors.maintenance}
                    touched={touched.maintenance}
                    focusedField={focusedField}
                    options={renderDropdownOptions(
                      dropdownData.maintenanceFrequencies
                    )}
                  />
                </div>
              )}
            </div>
          )}

        {/* Area details row - Only show if any area field is enabled */}
        {(shouldShowField("superBuildArea") ||
          shouldShowField("carpetArea")) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {shouldShowField("superBuildArea") && (
                <div>
                  <label className="block text-gray-800 font-medium mb-2 px-4">
                    Super Built-up Area (sq ft)
                  </label>
                  <DynamicInputs
                    type="text"
                    name="superBuildArea"
                    id="superBuildArea"
                    onChange={handleChange}
                    value={formData.superBuildArea || ""}
                    className="w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] 
                  bg-white focus:outline-none "
                    placeholder=" e.g. 1,200 sq ft"
                    onBlur={handleBlur}
                    error={errors.superBuildArea}
                    touched={touched.superBuildArea}
                    focusedField={focusedField}
                  />
                </div>
              )}

              {shouldShowField("carpetArea") && (
                <div>
                  <label className="block text-gray-800 font-medium mb-2 px-4">
                    Carpet Area (sq ft)
                  </label>
                  <DynamicInputs
                    type="text"
                    name="carpetArea"
                    id="carpetArea"
                    onChange={handleChange}
                    value={formData.carpetArea || ""}
                    className="w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] 
                  bg-white focus:outline-none "
                    placeholder="Enter carpet area"
                    onBlur={handleBlur}
                    error={errors.carpetArea}
                    touched={touched.carpetArea}
                    focusedField={focusedField}
                  />
                </div>
              )}

              {shouldShowField("floorNumber") && (
                <div>
                  <label className="block text-gray-800 font-medium mb-2 px-4">
                    Floor Number
                  </label>
                  <DynamicInputs
                    type="text"
                    name="floorNumber"
                    id="floorNumber"
                    onChange={handleChange}
                    value={formData.floorNumber || ""}
                    className="w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] 
                  bg-white focus:outline-none "
                    placeholder="Enter floor number"
                    onBlur={handleBlur}
                    error={errors.floorNumber}
                    touched={touched.floorNumber}
                    focusedField={focusedField}
                  />
                </div>
              )}
            </div>
          )}

        {/* Floor and parking details row - Only show if any parking/floor field is enabled */}
        {(shouldShowField("floorNumber") ||
          shouldShowField("totalFloor") ||
          shouldShowField("bikeParking") ||
          shouldShowField("carParking")) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {shouldShowField("totalFloor") && (
                <div>
                  <label className="block text-gray-800 font-medium mb-2 px-4">
                    Total Floors
                  </label>
                  <DynamicInputs
                    type="text"
                    name="totalFloor"
                    id="totalFloor"
                    onChange={handleChange}
                    value={formData.totalFloor || ""}
                    className="w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] 
                  bg-white focus:outline-none "
                    placeholder="Enter total floors"
                    onBlur={handleBlur}
                    error={errors.totalFloor}
                    touched={touched.totalFloor}
                    focusedField={focusedField}
                  />
                </div>
              )}

              {shouldShowField("bikeParking") && (
                <div>
                  <label className="block text-gray-800 font-medium mb-2 px-4">
                    Bike Parking
                  </label>
                  <DynamicInputs
                    type="text"
                    name="bikeParking"
                    id="bikeParking"
                    onChange={handleChange}
                    value={formData.bikeParking || ""}
                    className="w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] 
                  bg-white focus:outline-none "
                    placeholder="Enter bike parking"
                    onBlur={handleBlur}
                    error={errors.bikeParking}
                    touched={touched.bikeParking}
                    focusedField={focusedField}
                  />
                </div>
              )}

              {shouldShowField("carParking") && (
                <div>
                  <label className="block text-gray-800 font-medium mb-2 px-4">
                    Car Parking
                  </label>
                  <DynamicInputs
                    type="text"
                    name="carParking"
                    id="carParking"
                    onChange={handleChange}
                    value={formData.carParking || ""}
                    className="w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] 
                  bg-white focus:outline-none "
                    placeholder="Enter car parking"
                    onBlur={handleBlur}
                    error={errors.carParking}
                    touched={touched.carParking}
                    focusedField={focusedField}
                  />
                </div>
              )}
            </div>
          )}

        {/* Additional fields row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Bachelor field - only for house/apartment types */}
          {shouldShowField("bachelor") && (
            <div>
              <label className="block text-gray-800 font-medium mb-2 px-4">
                Bachelor Accomodation
              </label>
              <DynamicInputs
                type="select"
                name="bachelor"
                id="bachelor"
                onChange={handleChange}
                value={formData.bachelor || ""}
                className="appearance-none w-full max-w-sm px-4 py-3 rounded-full border
                  border-[#bfbfbf] bg-white focus:outline-none "
                placeholder="Select bachelor accomodation"
                onBlur={handleBlur}
                error={errors.bachelor}
                touched={touched.bachelor}
                focusedField={focusedField}
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                ]}
              />
            </div>
          )}

          {shouldShowField("wash_room") && (
            <div>
              <label className="block text-gray-800 font-medium mb-2 px-4">
                Wash Rooms
              </label>
              <DynamicInputs
                type="text"
                name="wash_room"
                id="wash_room"
                onChange={handleChange}
                value={formData.wash_room || ""}
                className="w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] 
               bg-white focus:outline-none "
                placeholder="Enter wash rooms"
                onBlur={handleBlur}
                error={errors.wash_room}
                touched={touched.wash_room}
                focusedField={focusedField}
              />
            </div>
          )}

          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Amount (₹)
            </label>
            <DynamicInputs
              type="text"
              name="amount"
              id="amount"
              onChange={handleChange}
              value={formData.amount || ""}
              className="w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf]
               bg-white focus:outline-none "
              placeholder="Enter amount"
              onBlur={handleBlur}
              error={errors.amount}
              touched={touched.amount}
              focusedField={focusedField}
            />
          </div>
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Amount (₹)
            </label>
            <DynamicInputs
              type="text"
              name="amount"
              id="amount"
              onChange={handleChange}
              value={formData.amount || ""}
              className="w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf]
               bg-white focus:outline-none "
              placeholder="Enter amount"
              onBlur={handleBlur}
              error={errors.amount}
              touched={touched.amount}
              focusedField={focusedField}
            />
          </div>
        </div> */}

        {/* Description text area - Common for all types */}
        <div className="mb-6">
          <label className="block text-gray-800 font-medium mb-2 px-4">
            Description
          </label>

          <DynamicInputs
            type="textarea"
            name="description"
            id="description"
            onChange={handleChange}
            value={formData.description || ""}
            className="w-full max-w-[100%] h-[90px] px-4 py-3 rounded-[10px] border border-[#bfbfbf] 
              bg-white focus:outline-none "
            placeholder="Enter description"
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
                {/* {touched.images && errors.images && (
                  <p className="text-red-500 text-xs mt-2 px-4">
                    {Array.isArray(errors.images)
                      ? errors.images.join(", ")
                      : errors.images}
                  </p>
                )} */}
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
                {/* {touched.videos && errors.videos && (
                  <p className="text-red-500 text-xs mt-2 px-4">
                    {Array.isArray(errors.videos)
                      ? errors.videos
                      : errors.videos}
                  </p>
                )} */}
              </div>
            )}
          </div>
        </div>

        {/* Map Picker Modal */}
        <MapPickerModal
          isOpen={isMapModalOpen}
          onClose={() => setIsMapModalOpen(false)}
          initialLat={parseFloat(formData.latitude) || 28.6139}
          initialLng={parseFloat(formData.longitude) || 77.209}
          onConfirm={handleLocationConfirm}
        />

        {/* Submit Button */}
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

export default PropertyForm;
